/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {EnumeratorBase} from "./EnumeratorBase";
import __extendsImport from "../../../extends";
const __extends = __extendsImport;

export class IndexEnumerator<T> extends EnumeratorBase<T>
{

	constructor(
		sourceFactory:() => { source: { [index: number]: T }; pointer?: number; length: number; step?: number })
	{

		var source:{ source: { [index: number]: T }; pointer?: number; length: number; step?: number };
		super(
			() =>
			{
				source = sourceFactory();
				if(source && source.source)
				{
					var len = source.length;
					if(len<0) // Null is allowed but will exit immediately.
						throw new Error("length must be zero or greater");

					if(!isFinite(len))
						throw new Error("length must finite number");

					if(len && source.step===0)
						throw new Error("Invalid IndexEnumerator step value (0).");
					var pointer = source.pointer;
					if(!pointer)
						pointer = 0;
					else if(pointer!=Math.floor(pointer))
						throw new Error("Invalid IndexEnumerator pointer value (" + pointer + ") has decimal.");
					source.pointer = pointer;

					var step = source.step;
					if(!step)
						step = 1;
					else if(step!=Math.floor(step))
						throw new Error("Invalid IndexEnumerator step value (" + step + ") has decimal.");
					source.step = step;
				}
			},

			(yielder)=>
			{
				var len = (source && source.source) ? source.length : 0;
				if(!len || isNaN(len))
					return yielder.yieldBreak();
				var current = source.pointer;
				source.pointer += source.step;
				return (current<len && current>=0)
					? yielder.yieldReturn(source.source[current])
					: yielder.yieldBreak();
			},

			() =>
			{
				if(source)
				{
					source.source = null;
				}
			}
		);
		this._isEndless = false;
	}
}

export default IndexEnumerator;