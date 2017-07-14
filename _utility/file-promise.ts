/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import * as fs from "fs";
import {PromiseBase, TSDNPromise} from "../source/System/Promises/Promise";
import {JsonArray, JsonData, JsonMap} from "../source/JSON";


export module ENCODING
{
	export const UTF8:UTF8 = 'utf8';
}

export type UTF8 = 'utf8';
export type Encoding = UTF8;


export type WriteOptions = {
	encoding?:string;
	mode?:string;
	flag?:string;
};

function readFile(path:string, encoding:string = ENCODING.UTF8):TSDNPromise<string>
{
	return new TSDNPromise<string>((resolve, reject)=>
	{
		fs.readFile(
			path,
			encoding,
			(err, data)=>
			{
				if(err) reject(err);
				else resolve(data);
			});
	});
}

function writeFile(path:string, data:string, options?:WriteOptions):PromiseBase<void>
{
	return TSDNPromise.using<void>((resolve, reject)=>
	{
		fs.writeFile(
			path,
			data,
			options || {},
			err=>
			{
				if(err) reject(err);
				else resolve();
			});
	});
}

export {readFile as read, writeFile as write};

export module json
{

	export function read<T extends JsonMap | JsonArray>(
		path:string,
		encoding?:string):PromiseBase<T>
	export function read(path:string, encoding?:string):PromiseBase<JsonData>
	export function read<T extends JsonMap | JsonArray>(
		path:string,
		encoding:string = ENCODING.UTF8):PromiseBase<T>
	{
		return readFile(path, encoding).then(result=>JSON.parse(result));
	}

	export function write(path:string, data:JsonData, options?:WriteOptions):PromiseBase<void>
	{
		return TSDNPromise
			.using<string>(resolve=>resolve(JSON.stringify(data, null, 2)))
			.thenSynchronous(s=>writeFile(path, s, options));
	}

}