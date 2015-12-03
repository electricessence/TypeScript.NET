/*
 * @author electricessence / https://github.com/electricessence/
 * .NET Reference: http://referencesource.microsoft.com/#mscorlib/system/text/StringBuilder.cs
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Types = require('../Types');

var _Types2 = _interopRequireDefault(_Types);

var VOID0 = void 0;

var StringBuilder = (function () {
    function StringBuilder() {
        _classCallCheck(this, StringBuilder);

        var _ = this;
        _._latest = null;
        _._partArray = [];

        for (var _len = arguments.length, initial = Array(_len), _key = 0; _key < _len; _key++) {
            initial[_key] = arguments[_key];
        }

        _.appendThese(initial);
    }

    _createClass(StringBuilder, [{
        key: "appendSingle",
        value: function appendSingle(item) {
            if (item !== null && item !== VOID0) {
                var _ = this;
                _._latest = null;
                switch (typeof item) {
                    case _Types2["default"].OBJECT:
                    case _Types2["default"].FUNCTION:
                        item = item.toString();
                        break;
                }
                _._partArray.push(item);
            }
        }
    }, {
        key: "appendThese",
        value: function appendThese(items) {
            var _ = this;
            items.forEach(function (s) {
                return _.appendSingle(s);
            });
            return _;
        }
    }, {
        key: "append",
        value: function append() {
            for (var _len2 = arguments.length, items = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                items[_key2] = arguments[_key2];
            }

            this.appendThese(items);
            return this;
        }
    }, {
        key: "appendLine",
        value: function appendLine() {
            for (var _len3 = arguments.length, items = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                items[_key3] = arguments[_key3];
            }

            this.appendLines(items);
            return this;
        }
    }, {
        key: "appendLines",
        value: function appendLines(items) {
            var _ = this;
            items.forEach(function (i) {
                if (i !== null && i !== VOID0) {
                    _.appendSingle(i);
                    _._partArray.push("\r\n");
                }
            });
            return _;
        }
    }, {
        key: "toString",
        value: function toString() {
            var latest = this._latest;
            if (!latest === null) this._latest = latest = this._partArray.join();
            return latest;
        }
    }, {
        key: "join",
        value: function join(delimiter) {
            return this._partArray.join(delimiter);
        }
    }, {
        key: "clear",
        value: function clear() {
            this._partArray.length = 0;
            this._latest = null;
        }
    }, {
        key: "dispose",
        value: function dispose() {
            this.clear();
        }
    }, {
        key: "isEmpty",
        get: function get() {
            return this._partArray.length === 0;
        }
    }]);

    return StringBuilder;
})();

exports["default"] = StringBuilder;
module.exports = exports["default"];
//# sourceMappingURL=StringBuilder.js.map
