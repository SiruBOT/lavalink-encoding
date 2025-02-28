import DataInput from "./DataInput";
import DataOutput from "./DataOutput";

export interface TrackInfo {
    flags?: number;
    source: Source;
    identifier: string;
    author: string;
    length: bigint;
    isStream: boolean;
    position: bigint;
    title: string;
    uri: string | null;
    version?: number;
    probeInfo?: { raw: string, name: string, parameters: string | null };
    spotifyInfo?: {  ISRC: string | null, thumbnail: string | null };
}

const TRACK_INFO_VERSIONED = 1;
const TRACK_INFO_VERSION = 2;
const PARAMETERS_SEPARATOR = "|";

function parseProbeInfo(track: Pick<TrackInfo, 'probeInfo'>, input: DataInput) {
    const probeInfo = input.readUTF();
    const separatorPosition = probeInfo.indexOf(PARAMETERS_SEPARATOR);
    const name = separatorPosition < 0 ? probeInfo : probeInfo.substring(0, separatorPosition);
    const parameters = separatorPosition < 0 ? null : probeInfo.substring(separatorPosition + 1);
    track.probeInfo = { raw: probeInfo, name, parameters };
}

function parseSpotifyInfo(track: Pick<TrackInfo, "spotifyInfo">, input: DataInput) {
    /***
     *  Ref: com.sedmelluq.discord.lavaplayer.tools.DataFormatTools.java
     *  Line: 141-155
     *  writeNullableText(output, text);
     *  writeNullableText  -> if text is null, write 0, else write 1 and write text
     *  https://github.com/sedmelluq/lavaplayer/blob/707771af705b14ecc0c0ca4b5e5b6546e85f4b1c/main/src/main/java/com/sedmelluq/discord/lavaplayer/tools/DataFormatTools.java#LL141C1-L155C4
     */
    track.spotifyInfo = {
        ISRC: input.readBoolean() ? input.readUTF() : null,
        thumbnail: input.readBoolean() ? input.readUTF() : null
    };
}

function writeProbeInfo(track: Pick<TrackInfo, 'probeInfo'>, output: DataOutput) {
    if(typeof track.probeInfo === "object") {
        output.writeUTF(track.probeInfo.raw || "<no probe info provided>");
    } else {
        output.writeUTF("<no probe info provided>");
    }
}

// source manager name -> reader
// should either read the data into the track or
// discard it, so the position can be safely read.
const sourceReaders: { [key: string]: typeof parseProbeInfo | typeof parseSpotifyInfo | undefined } = {
    http: parseProbeInfo,
    local: parseProbeInfo,
    spotify: parseSpotifyInfo,
};

const sourceWriters: { [key: string]: typeof writeProbeInfo | undefined } = {
    http: writeProbeInfo,
    local: writeProbeInfo
};

type Source = string;

// version -> decoder
const decoders = [
    undefined,
    (input: DataInput, flags: number) => {
        const title = input.readUTF();
        const author = input.readUTF();
        const length = input.readLong();
        const identifier = input.readUTF();
        const isStream = input.readBoolean();
        const uri = null;
        const source: Source = input.readUTF() as Source;
        const track: TrackInfo = {
            flags,
            version: 1,
            title,
            author,
            length,
            identifier,
            isStream,
            uri,
            source,
            position: 0n,
        };
        const reader = sourceReaders[source];
        if (reader) reader(track, input);
        track.position = input.readLong();

        return track;
    },
    (input: DataInput, flags: number) => {
        const title = input.readUTF();
        const author = input.readUTF();
        const length = input.readLong();
        const identifier = input.readUTF();
        const isStream = input.readBoolean();
        const uri = input.readBoolean() ? input.readUTF() : null;
        const source: Source = input.readUTF() as Source;
        const track: TrackInfo = {
            flags,
            version: 2,
            title,
            author,
            length,
            identifier,
            isStream,
            uri,
            source,
            position: 0n,
        };
        const reader = sourceReaders[source];
        if (reader) reader(track, input);
        track.position = input.readLong();

        return track;
    },
];

const encoders = [
    undefined,
    undefined,
    (track: Partial<TrackInfo>, output: DataOutput) => {
        output.writeUTF(track.title || "<no title provided>");
        output.writeUTF(track.author || "<no author provided>");
        output.writeLong(track.length || 0n);
        output.writeUTF(track.identifier || "<no identifier provided>");
        output.writeBoolean(track.isStream || false);
        output.writeBoolean(Boolean(track.uri));
        if (track.uri) output.writeUTF(track.uri);
        output.writeUTF(track.source || "<no source provided>");
        const writer = sourceWriters[track.source || ''];
        if (writer) writer(track, output);
        output.writeLong(track.position || 0n);
    },
];

export function decode(data: Uint8Array | string): TrackInfo {
    const input = new DataInput(data);
    const flags = input.readInt() >> 30;
    const version = Boolean(flags & TRACK_INFO_VERSIONED) ? input.readByte() : 1;
    const decoder = decoders[version];
    if (!decoder) {
        throw new Error("This track's version is not supported. Track version: " + version
            + ", supported versions: " + decoders.filter(e => e).map((_, i) => i).join(", "));
    }
    return decoder(input, flags);
}

export function encode(track: Partial<TrackInfo>, version: number = TRACK_INFO_VERSION): string {
    const encoder = encoders[version];
    if (!encoder) {
        throw new Error("This track's version is not supported. Track version: " + version
            + ", supported versions: " + encoders.filter(e => e).map((_, i) => i).join(", "));
    }

    const out = new DataOutput();
    out.writeInt(0); // overwritten by prefix
    out.writeByte(version);

    encoder(track, out);

    const prefix = new DataOutput(5);
    prefix.writeInt((out.length - 4) | (TRACK_INFO_VERSIONED << 30));
    out.set(prefix.valueOf());

    return out.toString();
}
