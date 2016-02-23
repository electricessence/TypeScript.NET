/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="IEnumerable.d.ts"/>
///<reference path="../Array/IArray.d.ts"/>
import {using} from '../../Disposable/Utility';
import * as Enumerator from '../../Collections/Enumeration/Enumerator';

export default function forEach<T>(
    enumerable:IEnumerable<T> | IArray<T>,
    action:(element:T, index?:number) => any):void
{
    if (enumerable) {
        using(Enumerator.from(enumerable), e=>
        {
            Enumerator.forEach(e, action);
        });
    }
}

