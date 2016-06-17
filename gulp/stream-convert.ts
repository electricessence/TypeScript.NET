///<reference path="../typings/node/node" />

import {Promise, PromiseBase} from "../source/System/Promises/Promise";

import ReadableStream = NodeJS.ReadableStream;
import WritableStream = NodeJS.WritableStream;
import ReadWriteStream = NodeJS.ReadWriteStream;

export type StreamPart = string|Buffer;
const _DATA = 'data', _END = 'end', _ERROR = 'error', _CLOSE = 'close';
export module StreamEvents
{
	export const DATA = _DATA;
	export const END = _END;
	export const ERROR = _ERROR;
	export const CLOSE = _CLOSE;
}
Object.freeze(StreamEvents);

export function toArray<T>(stream:ReadableStream):Promise<T[]>
{
	return new Promise<T[]>((resolve, reject)=>
	{
		// stream is already ended
		if(!stream.readable) return resolve([]);

		var result:T[] = [];

		stream.on(_DATA, onData);
		stream.on(_END, onEnd);
		stream.on(_ERROR, onEnd);
		stream.on(_CLOSE, onClose);

		function onData(doc:T):void
		{
			result.push(doc);
		}

		function onEnd(err:any):void
		{
			if(err) reject(err);
			else resolve(result);
			cleanup();
		}

		function onClose()
		{
			resolve(result);
			cleanup();
		}

		function cleanup()
		{
			result = null;
			stream.removeListener(_DATA, onData);
			stream.removeListener(_END, onEnd);
			stream.removeListener(_ERROR, onEnd);
			stream.removeListener(_CLOSE, onClose);
		}
	})
}


export function toPromise<T>(stream:ReadableStream|ReadWriteStream):Promise<T>
export function toPromise(stream:WritableStream):Promise<void>
export function toPromise(stream:any):PromiseBase<any>
{
	if(stream.readable) return fromReadable(stream);
	if(stream.writable) return fromWritable(stream);
	return Promise.resolve();
}

function fromReadable<T>(stream:ReadableStream):Promise<T[]>
{
	var promise = toArray<T>(stream);

	// Ensure stream is in flowing mode
	if(stream.resume) stream.resume();

	return promise;
}

function fromWritable(stream:WritableStream):Promise<void>
{
	return new Promise<void>((resolve, reject)=>
	{
		stream.once('finish', resolve);
		stream.once('error', reject);
	})
}
