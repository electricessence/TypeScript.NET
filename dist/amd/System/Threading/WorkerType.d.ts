/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import {Action} from "../FunctionTypes";

export declare interface WorkerLike
{
	onmessage:Action<{ data:any }> | null | undefined;
	onerror:Action<any> | null | undefined;

	postMessage(obj:any):void;

	terminate():void;
}

export declare interface WorkerConstructor
{
	new(url:string):WorkerLike;
}
