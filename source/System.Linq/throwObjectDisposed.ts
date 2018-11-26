/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import ObjectDisposedException from "../System/Disposable/ObjectDisposedException";

const ENUMERABLE = "Enumerable";

export default function(disposed:true, objectName?:string):true
//noinspection JSUnusedLocalSymbols
export default function(disposed:false, objectName?:string):never
//noinspection JSUnusedLocalSymbols
export default function(disposed:boolean, objectName?:string):true | never
//noinspection JSUnusedLocalSymbols
export default function(disposed:boolean, objectName:string = ENUMERABLE):true | never {
	if(disposed) throw new ObjectDisposedException(objectName);
	return true;
}