"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = awaiter;
//# sourceMappingURL=awaiter.js.map