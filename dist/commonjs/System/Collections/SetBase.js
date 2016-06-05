/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LinkedNodeList_1 = require("./LinkedNodeList");
var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
var Enumerator_1 = require("./Enumeration/Enumerator");
var EmptyEnumerator_1 = require("./Enumeration/EmptyEnumerator");
var dispose_1 = require("../Disposable/dispose");
var Compare_1 = require("../Compare");
var CollectionBase_1 = require("./CollectionBase");
var extends_1 = require("../../extends");
var __extends = extends_1.default;
var OTHER = 'other';

var SetBase = function (_CollectionBase_1$Col) {
    _inherits(SetBase, _CollectionBase_1$Col);

    function SetBase(source) {
        _classCallCheck(this, SetBase);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SetBase).call(this, null, Compare_1.areEqual));

        _this._importEntries(source);
        return _this;
    }

    _createClass(SetBase, [{
        key: "_getSet",
        value: function _getSet() {
            var s = this._set;
            if (!s) this._set = s = new LinkedNodeList_1.LinkedNodeList();
            return s;
        }
    }, {
        key: "getCount",
        value: function getCount() {
            return this._set ? this._set.unsafeCount : 0;
        }
    }, {
        key: "exceptWith",
        value: function exceptWith(other) {
            var _ = this;
            if (!other) throw new ArgumentNullException_1.ArgumentNullException(OTHER);
            Enumerator_1.forEach(other, function (v) {
                if (_._removeInternal(v)) _._incrementModified();
            });
            _._signalModification();
        }
    }, {
        key: "intersectWith",
        value: function intersectWith(other) {
            if (!other) throw new ArgumentNullException_1.ArgumentNullException(OTHER);
            var _ = this;
            if (other instanceof SetBase) {
                var s = _._set;
                if (s) s.forEach(function (n) {
                    if (!other.contains(n.value) && _._removeInternal(n.value)) _._incrementModified();
                });
                _._signalModification();
            } else {
                dispose_1.using(_.newUsing(other), function (o) {
                    return _.intersectWith(o);
                });
            }
        }
    }, {
        key: "isProperSubsetOf",
        value: function isProperSubsetOf(other) {
            var _this2 = this;

            if (!other) throw new ArgumentNullException_1.ArgumentNullException(OTHER);
            return other instanceof SetBase ? other.isProperSupersetOf(this) : dispose_1.using(this.newUsing(other), function (o) {
                return o.isProperSupersetOf(_this2);
            });
        }
    }, {
        key: "isProperSupersetOf",
        value: function isProperSupersetOf(other) {
            var _this3 = this;

            if (!other) throw new ArgumentNullException_1.ArgumentNullException(OTHER);
            var result = true,
                count;
            if (other instanceof SetBase) {
                result = this.isSupersetOf(other);
                count = other.getCount();
            } else {
                count = dispose_1.using(this.newUsing(), function (o) {
                    Enumerator_1.forEach(other, function (v) {
                        o.add(v);
                        return result = _this3.contains(v);
                    });
                    return o.getCount();
                });
            }
            return result && this.getCount() > count;
        }
    }, {
        key: "isSubsetOf",
        value: function isSubsetOf(other) {
            var _this4 = this;

            if (!other) throw new ArgumentNullException_1.ArgumentNullException(OTHER);
            return other instanceof SetBase ? other.isSupersetOf(this) : dispose_1.using(this.newUsing(other), function (o) {
                return o.isSupersetOf(_this4);
            });
        }
    }, {
        key: "isSupersetOf",
        value: function isSupersetOf(other) {
            var _this5 = this;

            if (!other) throw new ArgumentNullException_1.ArgumentNullException(OTHER);
            var result = true;
            Enumerator_1.forEach(other, function (v) {
                return result = _this5.contains(v);
            });
            return result;
        }
    }, {
        key: "overlaps",
        value: function overlaps(other) {
            var _this6 = this;

            if (!other) throw new ArgumentNullException_1.ArgumentNullException(OTHER);
            var result = false;
            Enumerator_1.forEach(other, function (v) {
                return !(result = _this6.contains(v));
            });
            return result;
        }
    }, {
        key: "setEquals",
        value: function setEquals(other) {
            if (!other) throw new ArgumentNullException_1.ArgumentNullException(OTHER);
            return this.getCount() == (other instanceof SetBase ? other.getCount() : dispose_1.using(this.newUsing(other), function (o) {
                return o.getCount();
            })) && this.isSubsetOf(other);
        }
    }, {
        key: "symmetricExceptWith",
        value: function symmetricExceptWith(other) {
            if (!other) throw new ArgumentNullException_1.ArgumentNullException(OTHER);
            var _ = this;
            if (other instanceof SetBase) {
                Enumerator_1.forEach(other, function (v) {
                    if (_.contains(v)) {
                        if (_._removeInternal(v)) _._incrementModified();
                    } else {
                        if (_._addInternal(v)) _._incrementModified();
                    }
                });
                _._signalModification();
            } else {
                dispose_1.using(this.newUsing(other), function (o) {
                    return _.symmetricExceptWith(o);
                });
            }
        }
    }, {
        key: "unionWith",
        value: function unionWith(other) {
            this.importEntries(other);
        }
    }, {
        key: "_clearInternal",
        value: function _clearInternal() {
            var s = this._set;
            return s ? s.clear() : 0;
        }
    }, {
        key: "_onDispose",
        value: function _onDispose() {
            _get(Object.getPrototypeOf(SetBase.prototype), "_onDispose", this).call(this);
            this._set = null;
        }
    }, {
        key: "contains",
        value: function contains(item) {
            return !(!this.getCount() || !this._getNode(item));
        }
    }, {
        key: "getEnumerator",
        value: function getEnumerator() {
            var s = this._set;
            return s && this.getCount() ? LinkedNodeList_1.LinkedNodeList.valueEnumeratorFrom(s) : EmptyEnumerator_1.EmptyEnumerator;
        }
    }, {
        key: "forEach",
        value: function forEach(action) {
            var useCopy = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            return useCopy ? _get(Object.getPrototypeOf(SetBase.prototype), "forEach", this).call(this, action, useCopy) : this._set.forEach(function (node, i) {
                return action(node.value, i);
            });
        }
    }, {
        key: "_removeNode",
        value: function _removeNode(node) {
            if (!node) return false;
            return this.remove(node.value) != 0;
        }
    }, {
        key: "removeFirst",
        value: function removeFirst() {
            var s = this._set;
            return this._removeNode(s && s.first);
        }
    }, {
        key: "removeLast",
        value: function removeLast() {
            var s = this._set;
            return this._removeNode(s && s.last);
        }
    }]);

    return SetBase;
}(CollectionBase_1.CollectionBase);

exports.SetBase = SetBase;
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
exports.default = SetBase;
//# sourceMappingURL=SetBase.js.map
