/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = forEach;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _DisposableUtility = require('../../Disposable/Utility');

var _CollectionsEnumerationEnumerator = require('../../Collections/Enumeration/Enumerator');

var Enumerator = _interopRequireWildcard(_CollectionsEnumerationEnumerator);

function forEach(enumerable, action) {
    if (enumerable) {
        (0, _DisposableUtility.using)(Enumerator.from(enumerable), function (e) {
            Enumerator.forEach(e, action);
        });
    }
}

module.exports = exports['default'];
//# sourceMappingURL=forEach.js.map
