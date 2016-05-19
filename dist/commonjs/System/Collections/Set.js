/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Types_1 = require("../Types");
var ArgumentException_1 = require("../Exceptions/ArgumentException");
var SetBase_1 = require("./SetBase");
var OTHER = 'other';

var Set = function (_SetBase_1$SetBase) {
    _inherits(Set, _SetBase_1$SetBase);

    function Set() {
        _classCallCheck(this, Set);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Set).apply(this, arguments));
    }

    _createClass(Set, [{
        key: "newUsing",
        value: function newUsing(source) {
            return new Set(source);
        }
    }, {
        key: "_addInternal",
        value: function _addInternal(item) {
            var _ = this;
            if (!_.contains(item)) {
                var type = typeof item === "undefined" ? "undefined" : _typeof(item);
                if (!Types_1.Type.isPrimitive(type)) throw new ArgumentException_1.ArgumentException("item", "A Set can only index primitives.  Complex objects require a HashSet.");
                var r = _._registry;
                var t = r && r[type];
                if (!r) _._registry = r = {};
                if (!t) r[type] = t = {};
                var node = { value: item };
                _._getSet().addNode(node);
                t[item] = node;
                return true;
            }
            return false;
        }
    }, {
        key: "_clearInternal",
        value: function _clearInternal() {
            wipe(this._registry, 2);
            return _get(Object.getPrototypeOf(Set.prototype), "_clearInternal", this).call(this);
        }
    }, {
        key: "_onDispose",
        value: function _onDispose() {
            _get(Object.getPrototypeOf(Set.prototype), "_onDispose", this).call(this);
            this._registry = null;
        }
    }, {
        key: "_getNode",
        value: function _getNode(item) {
            var r = this._registry,
                t = r && r[typeof item === "undefined" ? "undefined" : _typeof(item)];
            return t && t[item];
        }
    }, {
        key: "_removeInternal",
        value: function _removeInternal(item) {
            var max = arguments.length <= 1 || arguments[1] === undefined ? Infinity : arguments[1];

            if (max === 0) return 0;
            var r = this._registry,
                t = r && r[typeof item === "undefined" ? "undefined" : _typeof(item)],
                node = t && t[item];
            if (node) {
                delete t[item];
                var s = this._set;
                if (s && s.removeNode(node)) {
                    return 1;
                }
            }
            return 0;
        }
    }]);

    return Set;
}(SetBase_1.SetBase);

exports.Set = Set;
function wipe(map) {
    var depth = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

    if (map && depth) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Object.keys(map)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;

                var v = map[key];
                delete map[key];
                wipe(v, depth - 1);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Set;
//# sourceMappingURL=Set.js.map
