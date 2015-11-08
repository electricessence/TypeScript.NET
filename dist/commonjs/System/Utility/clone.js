/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = clone;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Types = require('../Types');

var _Types2 = _interopRequireDefault(_Types);

function clone(source) {
    var depth = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    if (depth < 0) return source;
    if (!_Types2['default'].isObject(source)) return source;
    var result;
    if (Array.isArray(source)) {
        result = source.slice();
        if (depth > 0) {
            for (var i = 0; i < result.length; i++) {
                result[i] = clone(result[i], depth - 1);
            }
        }
    } else {
        result = {};
        if (depth > 0) for (var k in source) {
            result[k] = clone(source[k], depth - 1);
        }
    }
    return result;
}

module.exports = exports['default'];
//# sourceMappingURL=clone.js.map
