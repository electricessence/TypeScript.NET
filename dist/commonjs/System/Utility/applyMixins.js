/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = applyMixins;

function applyMixins(derivedConstructor, baseConstructors) {
    baseConstructors.forEach(function (bc) {
        Object.getOwnPropertyNames(bc.prototype).forEach(function (name) {
            derivedConstructor.prototype[name] = bc.prototype[name];
        });
    });
}

module.exports = exports["default"];
//# sourceMappingURL=applyMixins.js.map
