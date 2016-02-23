"use strict";
function applyMixins(derivedConstructor, baseConstructors) {
    baseConstructors
        .forEach(function (bc) {
        Object.getOwnPropertyNames(bc.prototype).forEach(function (name) {
            derivedConstructor.prototype[name] = bc.prototype[name];
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = applyMixins;
//# sourceMappingURL=applyMixins.js.map