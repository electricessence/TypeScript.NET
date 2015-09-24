/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

///<reference path="IEnumerable.ts"/>
///<reference path="../Array/IArray.ts"/>
import DU = require('../../Disposable/Utility');
import Enumerator = require('./Enumerator');


module Enumerable
{
    export function forEach<T>(
        enumerable:IEnumerable<T> | IArray<T>,
        action:(element:T, index?:number) => any):void
    {
        if (enumerable) {

            DU.using(
                Enumerator.from(enumerable), e=>
                {
                    Enumerator.forEach(e, action);
                }
            );
        }
    }

}

export = Enumerable;
