/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './ArrayEnumerable'], function (require, exports, ArrayEnumerable) {
    'use strict';
    var Grouping = (function (_super) {
        __extends(Grouping, _super);
        function Grouping(_groupKey, elements) {
            _super.call(this, elements);
            this._groupKey = _groupKey;
        }
        Object.defineProperty(Grouping.prototype, "key", {
            get: function () {
                return this._groupKey;
            },
            enumerable: true,
            configurable: true
        });
        return Grouping;
    })(ArrayEnumerable);
    return Grouping;
});
//# sourceMappingURL=Grouping.js.map