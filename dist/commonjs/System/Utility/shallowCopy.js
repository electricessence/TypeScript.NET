/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

function shallowCopy(source) {
    var target = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

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
