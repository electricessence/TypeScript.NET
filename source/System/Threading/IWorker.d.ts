/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

export interface IWorker {
	//constructor(url:string);

	onmessage:(message:{data:any})=>void;
	onerror:(error:any)=>void;

	postMessage(obj:any):void;
	terminate():void;
}
