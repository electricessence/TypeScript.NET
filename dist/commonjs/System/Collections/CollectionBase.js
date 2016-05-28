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

var Enumerator_1 = require("./Enumeration/Enumerator");
var Compare_1 = require("../Compare");
var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
var InvalidOperationException_1 = require("../Exceptions/InvalidOperationException");
var DisposableBase_1 = require("../Disposable/DisposableBase");
var Types_1 = require("../Types");
var NAME = "CollectionBase",
    CMDC = "Cannot modify a disposed collection.",
    CMRO = "Cannot modify a read-only collection.",
    RESOLVE = "resolve",
    LINQ_PATH = "../../System.Linq/Linq";

var CollectionBase = function (_DisposableBase_1$Dis) {
    _inherits(CollectionBase, _DisposableBase_1$Dis);

    function CollectionBase(source) {
        var _equalityComparer = arguments.length <= 1 || arguments[1] === undefined ? Compare_1.areEqual : arguments[1];

        _classCallCheck(this, CollectionBase);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CollectionBase).call(this));

        _this._equalityComparer = _equalityComparer;
        var _ = _this;
        _._disposableObjectName = NAME;
        _._importEntries(source);
        _._updateRecursion = 0;
        _._modifiedCount = 0;
        _._version = 0;
        return _this;
    }

    _createClass(CollectionBase, [{
        key: "getIsReadOnly",
        value: function getIsReadOnly() {
            return false;
        }
    }, {
        key: "assertModifiable",
        value: function assertModifiable() {
            this.throwIfDisposed(CMDC);
            if (this.getIsReadOnly()) throw new InvalidOperationException_1.InvalidOperationException(CMRO);
        }
    }, {
        key: "assertVersion",
        value: function assertVersion(version) {
            if (version != this._version) throw new InvalidOperationException_1.InvalidOperationException("Collection was modified.");
        }
    }, {
        key: "_onModified",
        value: function _onModified() {}
    }, {
        key: "_signalModification",
        value: function _signalModification(increment) {
            var _ = this;
            if (increment) _._modifiedCount++;
            if (_._modifiedCount && !this._updateRecursion) {
                _._modifiedCount = 0;
                _._version++;
                try {
                    _._onModified();
                } catch (ex) {
                    console.error(ex);
                }
                return true;
            }
            return false;
        }
    }, {
        key: "_incrementModified",
        value: function _incrementModified() {
            this._modifiedCount++;
        }
    }, {
        key: "handleUpdate",
        value: function handleUpdate(closure) {
            if (!closure) return false;
            var _ = this;
            _.assertModifiable();
            _._updateRecursion++;
            var updated = false;
            try {
                if (updated = closure()) _._modifiedCount++;
            } finally {
                _._updateRecursion--;
            }
            _._signalModification();
            return updated;
        }
    }, {
        key: "add",
        value: function add(entry) {
            var _ = this;
            _.assertModifiable();
            _._updateRecursion++;
            try {
                if (_._addInternal(entry)) _._modifiedCount++;
            } finally {
                _._updateRecursion--;
            }
            _._signalModification();
        }
    }, {
        key: "remove",
        value: function remove(entry) {
            var max = arguments.length <= 1 || arguments[1] === undefined ? Infinity : arguments[1];

            var _ = this;
            _.assertModifiable();
            _._updateRecursion++;
            var n;
            try {
                if (n = _._removeInternal(entry, max)) _._modifiedCount++;
            } finally {
                _._updateRecursion--;
            }
            _._signalModification();
            return n;
        }
    }, {
        key: "clear",
        value: function clear() {
            var _ = this;
            _.assertModifiable();
            _._updateRecursion++;
            var n;
            try {
                if (n = _._clearInternal()) _._modifiedCount++;
            } finally {
                _._updateRecursion--;
            }
            _._signalModification();
            return n;
        }
    }, {
        key: "_onDispose",
        value: function _onDispose() {
            _get(Object.getPrototypeOf(CollectionBase.prototype), "_onDispose", this).call(this);
            this._clearInternal();
            this._version = 0;
            this._updateRecursion = 0;
            this._modifiedCount = 0;
            var l = this._linq;
            this._linq = null;
            if (l) l.dispose();
        }
    }, {
        key: "_importEntries",
        value: function _importEntries(entries) {
            var _this2 = this;

            var added = 0;
            if (entries) {
                if (Array.isArray(entries)) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var e = _step.value;

                            if (this._addInternal(e)) added++;
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
                } else {
                    Enumerator_1.forEach(entries, function (e) {
                        if (_this2._addInternal(e)) added++;
                    });
                }
            }
            return added;
        }
    }, {
        key: "importEntries",
        value: function importEntries(entries) {
            var _ = this;
            _.assertModifiable();
            _._updateRecursion++;
            var n;
            try {
                if (n = _._importEntries(entries)) _._modifiedCount++;
            } finally {
                _._updateRecursion--;
            }
            _._signalModification();
            return n;
        }
    }, {
        key: "contains",
        value: function contains(entry) {
            if (!this.getCount()) return false;
            var found = false,
                equals = this._equalityComparer;
            this.forEach(function (e) {
                return !(found = equals(entry, e));
            });
            return found;
        }
    }, {
        key: "forEach",
        value: function forEach(action, useCopy) {
            if (useCopy) {
                var a = this.toArray();
                try {
                    return Enumerator_1.forEach(a, action);
                } finally {
                    a.length = 0;
                }
            } else {
                return Enumerator_1.forEach(this.getEnumerator(), action);
            }
        }
    }, {
        key: "copyTo",
        value: function copyTo(target) {
            var index = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            if (!target) throw new ArgumentNullException_1.ArgumentNullException('target');
            var count = this.getCount(),
                newLength = count + index;
            if (target.length < newLength) target.length = newLength;
            var e = this.getEnumerator();
            while (e.moveNext()) {
                target[index++] = e.current;
            }
            return target;
        }
    }, {
        key: "toArray",
        value: function toArray() {
            var count = this.getCount();
            return this.copyTo(count > 65536 ? new Array(count) : []);
        }
    }, {
        key: "count",
        get: function get() {
            return this.getCount();
        }
    }, {
        key: "isReadOnly",
        get: function get() {
            return this.getIsReadOnly();
        }
    }, {
        key: "isUpdating",
        get: function get() {
            return this._updateRecursion != 0;
        }
    }, {
        key: "linq",
        get: function get() {
            if (Types_1.Type.hasMember(require, RESOLVE) && require.length == 1) {
                var e = this._linq;
                if (!e) this._linq = e = require(LINQ_PATH).default.from(this);
                return e;
            } else {
                throw ".linq currently only supported within CommonJS.\nImport System.Linq/Linq and use Enumerable.from(e) instead.";
            }
        }
    }]);

    return CollectionBase;
}(DisposableBase_1.DisposableBase);

exports.CollectionBase = CollectionBase;
//# sourceMappingURL=CollectionBase.js.map
