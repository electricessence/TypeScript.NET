/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";
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
exports.awaiter = awaiter;
(function (awaiter) {
    function factory(UserPromise) {
        return function (thisArg, _arguments, P, generator) {
            awaiter(thisArg, _arguments, P || UserPromise, generator);
        };
    }
    awaiter.factory = factory;
})(awaiter = exports.awaiter || (exports.awaiter = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = awaiter;
//# sourceMappingURL=awaiter.js.map