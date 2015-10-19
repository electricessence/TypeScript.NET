/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = shallowCopy;

function shallowCopy(source) {
    var target = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (target) {
        for (var k in source) {
            target[k] = source[k];
        }
    }
    return target;
}

module.exports = exports["default"];
//# sourceMappingURL=shallowCopy.js.map
