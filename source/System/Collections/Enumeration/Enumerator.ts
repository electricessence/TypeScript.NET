/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

///<reference path="../../Disposable/IDisposable.ts"/>
///<reference path="IEnumerable.ts"/>
///<reference path="IEnumerator.ts"/>
///<reference path="IYield.ts"/>
import Types = require('../../Types');
import DisposableBase = require('../../Disposable/DisposableBase');
import ArrayEnumerator= require('./ArrayEnumerator');
import IndexEnumerator= require('./IndexEnumerator');

'use strict';

// Statics only...  No constructor...
module Enumerator
{
    // Could be array, or IEnumerable...
    export function from<T>(source:IEnumerable<T> | IArray<T>):IEnumerator<T>
    {
        if (source instanceof Array)
            return new ArrayEnumerator<T>(<T[]>source);

        if (typeof source===Types.Object && "length" in source)
        {
            var a = <IArray<T>>source;
            return new IndexEnumerator<T>(
                () =>
                {
                    return {
                        source: <{[index: number]: T}>a,
                        length: a.length,
                        pointer: 0,
                        step: 1
                    }
                }
            );
        }

        if ("getEnumerator" in source)
            return (<any>source).getEnumerator();

        throw new Error("Unknown enumerable.");
    }

    export function forEach<T>(
        e:IEnumerator<T>,
        action:(element:T, index?:number) => any):void
    {
        if (e) {
            var index = 0;
            // Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
            while (e.moveNext()) {
                if (action(e.current, index++)===false)
                    break;
            }
        }
    }
}


export = Enumerator;
