/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

export declare interface WorkerLike
{
	onmessage:(message:{data:any})=>void;
	onerror:(error:any)=>void;

	postMessage(obj:any):void;
	terminate():void;
}

export declare interface WorkerConstructor
{
	new (url:string):WorkerLike;
}
