"use strict";
function shallowCopy(source, target) {
    if (target === void 0) { target = {}; }
    if (target) {
        for (var k in source) {
            target[k] = source[k];
        }
    }
    return target;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = shallowCopy;
//# sourceMappingURL=shallowCopy.js.map