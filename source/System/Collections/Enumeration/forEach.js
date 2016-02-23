/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", '../../Disposable/Utility', '../../Collections/Enumeration/Enumerator'], factory);
    }
})(function (require, exports) {
    "use strict";
    var Utility_1 = require('../../Disposable/Utility');
    var Enumerator = require('../../Collections/Enumeration/Enumerator');
    function forEach(enumerable, action) {
        if (enumerable) {
            Utility_1.using(Enumerator.from(enumerable), function (e) {
                Enumerator.forEach(e, action);
            });
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = forEach;
});
//# sourceMappingURL=forEach.js.map