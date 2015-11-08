/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x10, _x11, _x12) { var _again = true; _function: while (_again) { var object = _x10, property = _x11, receiver = _x12; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x10 = parent; _x11 = property; _x12 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _UtilityShallowCopy = require('../Utility/shallowCopy');

var _UtilityShallowCopy2 = _interopRequireDefault(_UtilityShallowCopy);

var _DisposableDisposableBase = require('../Disposable/DisposableBase');

var _DisposableDisposableBase2 = _interopRequireDefault(_DisposableDisposableBase);

var _CollectionsArrayUtility = require('../Collections/Array/Utility');

var AU = _interopRequireWildcard(_CollectionsArrayUtility);

var DISPOSING = 'disposing',
    DISPOSED = 'disposed';

var EventDispatcherEntry = (function (_DisposableBase) {
    _inherits(EventDispatcherEntry, _DisposableBase);

    function EventDispatcherEntry(type, listener) {
        var useCapture = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
        var priority = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

        _classCallCheck(this, EventDispatcherEntry);

        _get(Object.getPrototypeOf(EventDispatcherEntry.prototype), 'constructor', this).call(this);
        this.type = type;
        this.listener = listener;
        this.useCapture = useCapture;
        this.priority = priority;
        var _ = this;
        _.type = type;
        _.listener = listener;
        _.useCapture = useCapture;
        _.priority = priority;
    }

    _createClass(EventDispatcherEntry, [{
        key: 'dispose',
        value: function dispose() {
            this.listener = null;
        }
    }, {
        key: 'matches',
        value: function matches(type, listener) {
            var useCapture = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

            var _ = this;
            return _.type == type && _.listener == listener && _.useCapture == useCapture;
        }
    }, {
        key: 'equals',
        value: function equals(other) {
            var _ = this;
            return _.type == other.type && _.listener == other.listener && _.useCapture == other.useCapture && _.priority == other.priority;
        }
    }, {
        key: 'wasDisposed',
        get: function get() {
            return this.listener == null;
        }
    }]);

    return EventDispatcherEntry;
})(_DisposableDisposableBase2['default']);

exports['default'] = EventDispatcherEntry;

var EventDispatcher = (function (_DisposableBase2) {
    _inherits(EventDispatcher, _DisposableBase2);

    function EventDispatcher() {
        _classCallCheck(this, EventDispatcher);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        _get(Object.getPrototypeOf(EventDispatcher.prototype), 'constructor', this).apply(this, args);
        this._isDisposing = false;
    }

    _createClass(EventDispatcher, [{
        key: 'addEventListener',
        value: function addEventListener(type, listener) {
            var useCapture = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
            var priority = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

            var l = this._listeners;
            if (!l) this._listeners = l = [];
            l.push(new EventDispatcherEntry(type, listener, useCapture, priority));
        }
    }, {
        key: 'registerEventListener',
        value: function registerEventListener(type, listener) {
            var useCapture = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
            var priority = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

            if (!this.hasEventListener(type, listener, useCapture)) this.addEventListener(type, listener, useCapture, priority);
        }
    }, {
        key: 'hasEventListener',
        value: function hasEventListener(type, listener) {
            var useCapture = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

            var l = this._listeners;
            return l && l.some(function (value) {
                return type == value.type && (!listener || listener == value.listener && useCapture == value.useCapture);
            });
        }
    }, {
        key: 'removeEventListener',
        value: function removeEventListener(type, listener) {
            var userCapture = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

            var l = this._listeners;
            if (l) {
                var i = AU.findIndex(l, function (entry) {
                    return entry.matches(type, listener, userCapture);
                });
                if (i != -1) {
                    var e = l[i];
                    l.splice(i, 1);
                    e.dispose();
                }
            }
        }
    }, {
        key: 'dispatchEvent',
        value: function dispatchEvent(e, params) {
            var _this = this;

            var _ = this,
                l = _._listeners;
            if (!l || !l.length) return false;
            var event;
            if (typeof e == "string") {
                event = Object.create(Event);
                if (!params) params = {};
                event.cancelable = !!params.cancelable;
                event.target = _;
                event.type = e;
            } else event = e;
            var type = event.type;
            var entries = [];
            l.forEach(function (e) {
                if (e.type == type) entries.push(e);
            });
            if (!entries.length) return false;
            entries.sort(function (a, b) {
                return b.priority - a.priority;
            });
            entries.forEach(function (entry) {
                var newEvent = Object.create(Event);
                (0, _UtilityShallowCopy2['default'])(event, newEvent);
                newEvent.target = _this;
                entry.listener(newEvent);
            });
            return true;
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            var _ = this;
            if (!_.wasDisposed && !_._isDisposing) {
                _._isDisposing = true;
                _.dispatchEvent(DISPOSING);
                _get(Object.getPrototypeOf(EventDispatcher.prototype), 'dispose', this).call(this);
                _.dispatchEvent(DISPOSED);
                var l = _._listeners;
                if (l) {
                    this._listeners = null;
                    l.forEach(function (e) {
                        return e.dispose();
                    });
                }
            }
        }
    }, {
        key: 'isDisposing',
        get: function get() {
            return this._isDisposing;
        }
    }], [{
        key: 'DISPOSING',
        get: function get() {
            return DISPOSING;
        }
    }, {
        key: 'DISPOSED',
        get: function get() {
            return DISPOSED;
        }
    }]);

    return EventDispatcher;
})(_DisposableDisposableBase2['default']);

module.exports = exports['default'];
//# sourceMappingURL=EventDispatcher.js.map
