/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="IEnumerable.ts"/>
///<reference path="../Array/IArray.ts"/>
import DU = require('../../Disposable/Utility');
import Enumerator = require('./Enumerator');
import using = DU.using;

function forEach<T>(
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

export = forEach;
