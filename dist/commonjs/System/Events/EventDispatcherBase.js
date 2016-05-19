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

var AU = require("../Collections/Array/Utility");
var shallowCopy_1 = require("../Utility/shallowCopy");
var DisposableBase_1 = require("../Disposable/DisposableBase");
var dispose_1 = require("../Disposable/dispose");
var EventDispatcherEntry_1 = require("./EventDispatcherEntry");
var DISPOSING = 'disposing',
    DISPOSED = 'disposed';
function entryFinalizer() {
    var p = this.params;
    p.dispatcher.removeEntry(this);
    p.dispatcher = null;
}

var EventDispatcherBase = function (_DisposableBase_1$Dis) {
    _inherits(EventDispatcherBase, _DisposableBase_1$Dis);

    function EventDispatcherBase() {
        var _Object$getPrototypeO;

        _classCallCheck(this, EventDispatcherBase);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(EventDispatcherBase)).call.apply(_Object$getPrototypeO, [this].concat(args)));

        _this._isDisposing = false;
        return _this;
    }

    _createClass(EventDispatcherBase, [{
        key: "addEventListener",
        value: function addEventListener(type, listener) {
            var priority = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

            var e = this._entries;
            if (!e) this._entries = e = [];
            e.push(new EventDispatcherEntry_1.EventDispatcherEntry(type, listener, {
                priority: priority || 0,
                dispatcher: this
            }, entryFinalizer));
        }
    }, {
        key: "removeEntry",
        value: function removeEntry(entry) {
            return !!this._entries && AU.remove(this._entries, entry) != 0;
        }
    }, {
        key: "registerEventListener",
        value: function registerEventListener(type, listener) {
            var priority = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

            if (!this.hasEventListener(type, listener)) this.addEventListener(type, listener, priority);
        }
    }, {
        key: "hasEventListener",
        value: function hasEventListener(type, listener) {
            var e = this._entries;
            return e && e.some(function (value) {
                return type == value.type && (!listener || listener == value.listener);
            });
        }
    }, {
        key: "removeEventListener",
        value: function removeEventListener(type, listener) {
            dispose_1.dispose.these(this._entries.filter(function (entry) {
                return entry.matches(type, listener);
            }));
        }
    }, {
        key: "dispatchEvent",
        value: function dispatchEvent(e, params) {
            var _this2 = this;

            var _ = this,
                l = _._entries;
            if (!l || !l.length) return false;
            var event;
            if (typeof e == "string") {
                event = Event && Object.create(Event) || {};
                if (!params) params = {};
                if (params['cancellable']) event.cancellable = true;
                event.target = _;
                event.type = e;
            } else event = e;
            var type = event.type;
            var entries = l.filter(function (e) {
                return e.type == type;
            });
            if (!entries.length) return false;
            entries.sort(function (a, b) {
                return b.params.priority - a.params.priority;
            });
            entries.forEach(function (entry) {
                var newEvent = Object.create(Event);
                shallowCopy_1.shallowCopy(event, newEvent);
                newEvent.target = _this2;
                entry.dispatch(newEvent);
            });
            return true;
        }
    }, {
        key: "dispose",
        value: function dispose() {
            var _ = this;
            if (!_.wasDisposed && !_._isDisposing) {
                _._isDisposing = true;
                _.dispatchEvent(DISPOSING);
                _get(Object.getPrototypeOf(EventDispatcherBase.prototype), "dispose", this).call(this);
                _.dispatchEvent(DISPOSED);
                var l = _._entries;
                if (l) {
                    this._entries = null;
                    l.forEach(function (e) {
                        return e.dispose();
                    });
                }
            }
        }
    }, {
        key: "isDisposing",
        get: function get() {
            return this._isDisposing;
        }
    }], [{
        key: "DISPOSING",
        get: function get() {
            return DISPOSING;
        }
    }, {
        key: "DISPOSED",
        get: function get() {
            return DISPOSED;
        }
    }]);

    return EventDispatcherBase;
}(DisposableBase_1.DisposableBase);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EventDispatcherBase;
//# sourceMappingURL=EventDispatcherBase.js.map
