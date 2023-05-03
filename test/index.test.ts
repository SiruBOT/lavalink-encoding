import { encode, decode, TrackInfo } from '../src/index';

const trackInfo: TrackInfo = {
	author: 'RickAstleyVEVO',
	source: 'youtube',
	identifier: 'dQw4w9WgXcQ',
	length: 212000n,
	isStream: false,
	title: 'Rick Astley - Never Gonna Give You Up',
	uri: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
	position: 0n,
	flags: 1,
	version: 2,
};

const track: string = 'QAAAjQIAJVJpY2sgQXN0bGV5IC0gTmV2ZXIgR29ubmEgR2l2ZSBZb3UgVXAADlJpY2tBc3RsZXlWRVZPAAAAAAADPCAAC2RRdzR3OVdnWGNRAAEAK2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9ZFF3NHc5V2dYY1EAB3lvdXR1YmUAAAAAAAAAAA==';

test('can encode a full track', () => {
	const encoded = encode(trackInfo);
	expect(encoded).toBe(track);
});

test('can decode a full track', () => {
	const decoded = decode(track);
	expect(decoded).toStrictEqual(trackInfo);
});

const emptyTrack = 'QAAAbgIAEzxubyB0aXRsZSBwcm92aWRlZD4AFDxubyBhdXRob3IgcHJvdmlkZWQ+AAAAAAAAAAAAGDxubyBpZGVudGlmaWVyIHByb3ZpZGVkPgAAABQ8bm8gc291cmNlIHByb3ZpZGVkPgAAAAAAAAAA';
test('can encode an empty track', () => {
	const encoded = encode({});
	expect(encoded).toBe(emptyTrack);
});

test('can decode an empty track', () => {
	const decoded = decode(emptyTrack);
	expect(decoded).toStrictEqual({
		author: '<no author provided>',
		title: '<no title provided>',
		length: 0n,
		position: 0n,
		flags: 1,
		version: 2,
		identifier: '<no identifier provided>',
		isStream: false,
		uri: null,
		source: '<no source provided>',
	});
});

test('can\'t encode a track into version 1', () => {
	expect(() => encode(trackInfo, 1)).toThrowError();
});

test.todo('can decode a version 1 track');

const httpTrackInfo: Partial<TrackInfo> = {
	source: 'http',
	length: 10n,
	title: 'track.mp3',
	isStream: false,
	uri: 'http://somewebsite.green/track.mp3',
	position: 0n,
	flags: 1,
	version: 2,
	probeInfo: {
		name: 'heck',
		parameters: 'man',
		raw: 'heck|man',
	},
};

const httpTrack = 'QAAAggIACXRyYWNrLm1wMwAUPG5vIGF1dGhvciBwcm92aWRlZD4AAAAAAAAACgAYPG5vIGlkZW50aWZpZXIgcHJvdmlkZWQ+AAEAImh0dHA6Ly9zb21ld2Vic2l0ZS5ncmVlbi90cmFjay5tcDMABGh0dHAACGhlY2t8bWFuAAAAAAAAAAA=';

test('can encode HTTP track', () => {
	const encoded = encode(httpTrackInfo);
	expect(encoded).toBe(httpTrack);
});

test('can decode HTTP track', () => {
	const decoded = decode(httpTrack);
	expect(decoded).toStrictEqual({
		...httpTrackInfo,
		author: '<no author provided>',
		identifier: '<no identifier provided>',
	});
});

const googleTrackInfo: TrackInfo = {
	author: 'Unknown artist',
	flags: 1,
	identifier: 'https://r3---sn-a5meknsd.googlevideo.com/videoplayback?expire=1627983375&ei=r7kIYZ3VL6WMlu8P3POd4As&ip=207.244.241.116&id=o-AJOE-LZ7ehoIUj6nIIuTV4-OOtjUX5ixl4GkDob6LlnD&itag=251&source=youtube&requiressl=yes&gcr=us&vprv=1&mime=audio%2Fwebm&ns=yZGglVtye32CP15XFeuaxXgG&gir=yes&clen=4306344&dur=256.561&lmt=1601008603483647&keepalive=yes&fexp=24001373,24007246&c=WEB&txp=2311222&n=oJRElaWErvazeb3Jv&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cgcr%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AOq0QJ8wRAIgVbeH1UEFgbZhevRNPa5lbBTASovBCeCe0zSYL55f2AMCIHDPhArVFksIt1STAD9SbA8D-tofjTdite_tSS9iBjKV&rm=sn-ca0xcpgq-hjpe7s,sn-vgqee77s&req_id=2de401991d67a3ee&redirect_counter=2&cms_redirect=yes&ipbypass=yes&mh=gT&mip=70.177.183.31&mm=29&mn=sn-a5meknsd&ms=rdu&mt=1627961578&mv=m&mvi=3&pl=19&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRgIhANH5eGMukqqVOzKKnU1cEXLKwGq1YBVeXpj5CI2xQUAtAiEAreT-SHz4TWXQeXYeYB6WajT0c3EcV-xwiQKVCgrfGic%3D',
	isStream: false,
	length: 256561n,
	position: 0n,
	probeInfo: {
		name: 'matroska/webm',
		parameters: null,
		raw: 'matroska/webm',
	},
	source: 'http',
	title: 'Unknown title',
	uri: 'https://r3---sn-a5meknsd.googlevideo.com/videoplayback?expire=1627983375&ei=r7kIYZ3VL6WMlu8P3POd4As&ip=207.244.241.116&id=o-AJOE-LZ7ehoIUj6nIIuTV4-OOtjUX5ixl4GkDob6LlnD&itag=251&source=youtube&requiressl=yes&gcr=us&vprv=1&mime=audio%2Fwebm&ns=yZGglVtye32CP15XFeuaxXgG&gir=yes&clen=4306344&dur=256.561&lmt=1601008603483647&keepalive=yes&fexp=24001373,24007246&c=WEB&txp=2311222&n=oJRElaWErvazeb3Jv&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cgcr%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AOq0QJ8wRAIgVbeH1UEFgbZhevRNPa5lbBTASovBCeCe0zSYL55f2AMCIHDPhArVFksIt1STAD9SbA8D-tofjTdite_tSS9iBjKV&rm=sn-ca0xcpgq-hjpe7s,sn-vgqee77s&req_id=2de401991d67a3ee&redirect_counter=2&cms_redirect=yes&ipbypass=yes&mh=gT&mip=70.177.183.31&mm=29&mn=sn-a5meknsd&ms=rdu&mt=1627961578&mv=m&mvi=3&pl=19&lsparams=ipbypass,mh,mip,mm,mn,ms,mv,mvi,pl&lsig=AG3C_xAwRgIhANH5eGMukqqVOzKKnU1cEXLKwGq1YBVeXpj5CI2xQUAtAiEAreT-SHz4TWXQeXYeYB6WajT0c3EcV-xwiQKVCgrfGic%3D',
	version: 2,
};

const googleTrack = 'QAAHwwIADVVua25vd24gdGl0bGUADlVua25vd24gYXJ0aXN0AAAAAAAD6jEDvGh0dHBzOi8vcjMtLS1zbi1hNW1la25zZC5nb29nbGV2aWRlby5jb20vdmlkZW9wbGF5YmFjaz9leHBpcmU9MTYyNzk4MzM3NSZlaT1yN2tJWVozVkw2V01sdThQM1BPZDRBcyZpcD0yMDcuMjQ0LjI0MS4xMTYmaWQ9by1BSk9FLUxaN2Vob0lVajZuSUl1VFY0LU9PdGpVWDVpeGw0R2tEb2I2TGxuRCZpdGFnPTI1MSZzb3VyY2U9eW91dHViZSZyZXF1aXJlc3NsPXllcyZnY3I9dXMmdnBydj0xJm1pbWU9YXVkaW8lMkZ3ZWJtJm5zPXlaR2dsVnR5ZTMyQ1AxNVhGZXVheFhnRyZnaXI9eWVzJmNsZW49NDMwNjM0NCZkdXI9MjU2LjU2MSZsbXQ9MTYwMTAwODYwMzQ4MzY0NyZrZWVwYWxpdmU9eWVzJmZleHA9MjQwMDEzNzMsMjQwMDcyNDYmYz1XRUImdHhwPTIzMTEyMjImbj1vSlJFbGFXRXJ2YXplYjNKdiZzcGFyYW1zPWV4cGlyZSUyQ2VpJTJDaXAlMkNpZCUyQ2l0YWclMkNzb3VyY2UlMkNyZXF1aXJlc3NsJTJDZ2NyJTJDdnBydiUyQ21pbWUlMkNucyUyQ2dpciUyQ2NsZW4lMkNkdXIlMkNsbXQmc2lnPUFPcTBRSjh3UkFJZ1ZiZUgxVUVGZ2JaaGV2Uk5QYTVsYkJUQVNvdkJDZUNlMHpTWUw1NWYyQU1DSUhEUGhBclZGa3NJdDFTVEFEOVNiQThELXRvZmpUZGl0ZV90U1M5aUJqS1Ymcm09c24tY2EweGNwZ3EtaGpwZTdzLHNuLXZncWVlNzdzJnJlcV9pZD0yZGU0MDE5OTFkNjdhM2VlJnJlZGlyZWN0X2NvdW50ZXI9MiZjbXNfcmVkaXJlY3Q9eWVzJmlwYnlwYXNzPXllcyZtaD1nVCZtaXA9NzAuMTc3LjE4My4zMSZtbT0yOSZtbj1zbi1hNW1la25zZCZtcz1yZHUmbXQ9MTYyNzk2MTU3OCZtdj1tJm12aT0zJnBsPTE5JmxzcGFyYW1zPWlwYnlwYXNzLG1oLG1pcCxtbSxtbixtcyxtdixtdmkscGwmbHNpZz1BRzNDX3hBd1JnSWhBTkg1ZUdNdWtxcVZPektLblUxY0VYTEt3R3ExWUJWZVhwajVDSTJ4UVVBdEFpRUFyZVQtU0h6NFRXWFFlWFllWUI2V2FqVDBjM0VjVi14d2lRS1ZDZ3JmR2ljJTNEAAEDvGh0dHBzOi8vcjMtLS1zbi1hNW1la25zZC5nb29nbGV2aWRlby5jb20vdmlkZW9wbGF5YmFjaz9leHBpcmU9MTYyNzk4MzM3NSZlaT1yN2tJWVozVkw2V01sdThQM1BPZDRBcyZpcD0yMDcuMjQ0LjI0MS4xMTYmaWQ9by1BSk9FLUxaN2Vob0lVajZuSUl1VFY0LU9PdGpVWDVpeGw0R2tEb2I2TGxuRCZpdGFnPTI1MSZzb3VyY2U9eW91dHViZSZyZXF1aXJlc3NsPXllcyZnY3I9dXMmdnBydj0xJm1pbWU9YXVkaW8lMkZ3ZWJtJm5zPXlaR2dsVnR5ZTMyQ1AxNVhGZXVheFhnRyZnaXI9eWVzJmNsZW49NDMwNjM0NCZkdXI9MjU2LjU2MSZsbXQ9MTYwMTAwODYwMzQ4MzY0NyZrZWVwYWxpdmU9eWVzJmZleHA9MjQwMDEzNzMsMjQwMDcyNDYmYz1XRUImdHhwPTIzMTEyMjImbj1vSlJFbGFXRXJ2YXplYjNKdiZzcGFyYW1zPWV4cGlyZSUyQ2VpJTJDaXAlMkNpZCUyQ2l0YWclMkNzb3VyY2UlMkNyZXF1aXJlc3NsJTJDZ2NyJTJDdnBydiUyQ21pbWUlMkNucyUyQ2dpciUyQ2NsZW4lMkNkdXIlMkNsbXQmc2lnPUFPcTBRSjh3UkFJZ1ZiZUgxVUVGZ2JaaGV2Uk5QYTVsYkJUQVNvdkJDZUNlMHpTWUw1NWYyQU1DSUhEUGhBclZGa3NJdDFTVEFEOVNiQThELXRvZmpUZGl0ZV90U1M5aUJqS1Ymcm09c24tY2EweGNwZ3EtaGpwZTdzLHNuLXZncWVlNzdzJnJlcV9pZD0yZGU0MDE5OTFkNjdhM2VlJnJlZGlyZWN0X2NvdW50ZXI9MiZjbXNfcmVkaXJlY3Q9eWVzJmlwYnlwYXNzPXllcyZtaD1nVCZtaXA9NzAuMTc3LjE4My4zMSZtbT0yOSZtbj1zbi1hNW1la25zZCZtcz1yZHUmbXQ9MTYyNzk2MTU3OCZtdj1tJm12aT0zJnBsPTE5JmxzcGFyYW1zPWlwYnlwYXNzLG1oLG1pcCxtbSxtbixtcyxtdixtdmkscGwmbHNpZz1BRzNDX3hBd1JnSWhBTkg1ZUdNdWtxcVZPektLblUxY0VYTEt3R3ExWUJWZVhwajVDSTJ4UVVBdEFpRUFyZVQtU0h6NFRXWFFlWFllWUI2V2FqVDBjM0VjVi14d2lRS1ZDZ3JmR2ljJTNEAARodHRwAA1tYXRyb3NrYS93ZWJtAAAAAAAAAAA=';

test('can encode Google track', () => {
	const encoded = encode(googleTrackInfo);
	expect(encoded).toBe(googleTrack);
})

test('can decode Google track', () => {
	const decoded = decode(googleTrack);
	expect(decoded).toStrictEqual(googleTrackInfo);
});

const spotifyInfo = {
  flags: 1,
  version: 2,
  title: "追憶",
  author: "PIKASONIC",
  length: 249000n,
  identifier: "2K3vp2sZJrIrZJ4b4jHACg",
  isStream: false,
  uri: "https://open.spotify.com/track/2K3vp2sZJrIrZJ4b4jHACg",
  source: "spotify",
  position: 0n,
  spotifyInfo: {
    ISRC: "TCJPP2155112",
    thumbnail:
      "https://i.scdn.co/image/ab67616d0000b2735a15fcec9b64c3f87eb4c9d0",
  },
};

const spotifyTrack = 'QAAA0AIABui/veaGtgAJUElLQVNPTklDAAAAAAADzKgAFjJLM3ZwMnNaSnJJclpKNGI0akhBQ2cAAQA1aHR0cHM6Ly9vcGVuLnNwb3RpZnkuY29tL3RyYWNrLzJLM3ZwMnNaSnJJclpKNGI0akhBQ2cAB3Nwb3RpZnkBAAxUQ0pQUDIxNTUxMTIBAEBodHRwczovL2kuc2Nkbi5jby9pbWFnZS9hYjY3NjE2ZDAwMDBiMjczNWExNWZjZWM5YjY0YzNmODdlYjRjOWQwAAAAAAAAAAA=';

test('can decode Spotify track', () => {
	const decoded = decode(spotifyTrack);
	expect(decoded).toStrictEqual(spotifyInfo);
});