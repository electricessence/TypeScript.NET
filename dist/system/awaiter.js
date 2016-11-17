/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function awaiter(thisArg, _arguments, P, generator) {
        if (!P)
            throw "Must provide Promise constructor.  Try injecting Promise using awaiter.factory(PromiseConstructorLike).";
        return new P(function (resolve, reject) {
            var g = generator = generator.apply(thisArg, _arguments);
            step(g.next());
            function fulfilled(value) {
                try {
                    step(g.next(value));
                }
                catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(g["throw"](value));
                }
                catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected);
            }
        });
    }
    exports_1("awaiter", awaiter);
    return {
        setters: [],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             */
            (function (awaiter) {
                function factory(Promise) {
                    return function (thisArg, _arguments, P, generator) {
                        awaiter(thisArg, _arguments, P || Promise, generator);
                    };
                }
                awaiter.factory = factory;
            })(awaiter = awaiter || (awaiter = {}));
            exports_1("awaiter", awaiter);
        }
    };
});
//# sourceMappingURL=awaiter.js.map