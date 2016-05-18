/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "../Types", "../Exceptions/ArgumentException", "./SetBase"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Types_1 = require("../Types");
    var ArgumentException_1 = require("../Exceptions/ArgumentException");
    var SetBase_1 = require("./SetBase");
    var OTHER = 'other';
    var Set = (function (_super) {
        __extends(Set, _super);
        function Set() {
            _super.apply(this, arguments);
        }
        Set.prototype.newUsing = function (source) {
            return new Set(source);
        };
        Set.prototype._addInternal = function (item) {
            var _ = this;
            if (!_.contains(item)) {
                var type = typeof item;
                if (!Types_1.Type.isPrimitive(type))
                    throw new ArgumentException_1.ArgumentException("item", "A Set can only index primitives.  Complex objects require a HashSet.");
                var r = _._registry;
                var t = r && r[type];
                if (!r)
                    _._registry = r = {};
                if (!t)
                    r[type] = t = {};
                var node = { value: item };
                _._getSet().addNode(node);
                t[item] = node;
                return true;
            }
            return false;
        };
        Set.prototype._clearInternal = function () {
            wipe(this._registry, 2);
            return _super.prototype._clearInternal.call(this);
        };
        Set.prototype._onDispose = function () {
            _super.prototype._onDispose.call(this);
            this._registry = null;
        };
        Set.prototype._getNode = function (item) {
            var r = this._registry, t = r && r[typeof item];
            return t && t[item];
        };
        Set.prototype._removeInternal = function (item, max) {
            if (max === void 0) { max = Infinity; }
            if (max === 0)
                return 0;
            var r = this._registry, t = r && r[typeof item], node = t && t[item];
            if (node) {
                delete t[item];
                var s = this._set;
                if (s && s.removeNode(node)) {
                    return 1;
                }
            }
            return 0;
        };
        return Set;
    }(SetBase_1.SetBase));
    exports.Set = Set;
    function wipe(map, depth) {
        if (depth === void 0) { depth = 1; }
        if (map && depth) {
            for (var _i = 0, _a = Object.keys(map); _i < _a.length; _i++) {
                var key = _a[_i];
                var v = map[key];
                delete map[key];
                wipe(v, depth - 1);
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Set;
});
//# sourceMappingURL=Set.js.map