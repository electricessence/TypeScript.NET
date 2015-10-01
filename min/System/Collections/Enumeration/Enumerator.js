/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
///<reference path="../../Disposable/IDisposable.d.ts"/>
///<reference path="IEnumerable.d.ts"/>
///<reference path="IEnumerator.d.ts"/>
///<reference path="IYield.d.ts"/>
var Types = require('../../Types');
var ArrayEnumerator = require('./ArrayEnumerator');
var IndexEnumerator = require('./IndexEnumerator');
'use strict';
var Enumerator;
(function (Enumerator) {
    var EmptyEnumerator = (function () {
        function EmptyEnumerator() {
        }
        Object.defineProperty(EmptyEnumerator.prototype, "current", {
            get: function () {
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        EmptyEnumerator.prototype.moveNext = function () {
            return false;
        };
        EmptyEnumerator.prototype.reset = function () { };
        EmptyEnumerator.prototype.dispose = function () { };
        return EmptyEnumerator;
    })();
    var Empty = new EmptyEnumerator();
    function from(source) {
        if (!source)
            return Empty;
        if (source instanceof Array)
            return new ArrayEnumerator(source);
        if (typeof source === Types.Object) {
            if ("length" in source) {
                var a = source;
                return new IndexEnumerator(function () {
                    return {
                        source: a,
                        length: a.length,
                        pointer: 0,
                        step: 1
                    };
                });
            }
            if ("getEnumerator" in source)
                return source.getEnumerator();
        }
        throw new Error("Unknown enumerable.");
    }
    Enumerator.from = from;
    function forEach(e, action) {
        if (e) {
            var index = 0;
            while (e.moveNext()) {
                if (action(e.current, index++) === false)
                    break;
            }
        }
    }
    Enumerator.forEach = forEach;
})(Enumerator || (Enumerator = {}));
module.exports = Enumerator;
