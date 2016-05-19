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

var Types_1 = require("../Types");
var DisposableBase_1 = require("../Disposable/DisposableBase");
var ArgumentNullException_1 = require("../Exceptions/ArgumentNullException");
var ArgumentException_1 = require("../Exceptions/ArgumentException");
var Compare_1 = require("../Compare");

var EventDispatcherEntry = function (_DisposableBase_1$Dis) {
    _inherits(EventDispatcherEntry, _DisposableBase_1$Dis);

    function EventDispatcherEntry(type, listener) {
        var params = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
        var finalizer = arguments[3];

        _classCallCheck(this, EventDispatcherEntry);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EventDispatcherEntry).call(this, finalizer));

        _this.type = type;
        _this.listener = listener;
        _this.params = params;
        if (!listener) throw new ArgumentNullException_1.ArgumentNullException('listener');
        if (Types_1.Type.isObject(listener) && !Types_1.Type.hasMemberOfType(listener, "handleEvent", Types_1.Type.FUNCTION)) throw new ArgumentException_1.ArgumentException('listener', "is invalid type.  Must be a function or an object with 'handleEvent'.");
        var _ = _this;
        _.type = type;
        _.listener = listener;
        _.params = params;
        _._disposableObjectName = "EventDispatcherEntry";
        return _this;
    }

    _createClass(EventDispatcherEntry, [{
        key: "_onDispose",
        value: function _onDispose() {
            _get(Object.getPrototypeOf(EventDispatcherEntry.prototype), "_onDispose", this).call(this);
            this.listener = null;
        }
    }, {
        key: "dispatch",
        value: function dispatch(e) {
            var _ = this;
            if (_.wasDisposed) return false;
            var l = _.listener,
                d = l && e.type == _.type;
            if (d) {
                if (Types_1.Type.isFunction(l)) _.listener(e);else l.handleEvent(e);
            }
            return d;
        }
    }, {
        key: "matches",
        value: function matches(type, listener) {
            var _ = this;
            return _.type == type && _.listener == listener;
        }
    }, {
        key: "equals",
        value: function equals(other) {
            var _ = this;
            return _.matches(other.type, other.listener) && Compare_1.areEquivalent(_.params, other.params, false);
        }
    }]);

    return EventDispatcherEntry;
}(DisposableBase_1.DisposableBase);

exports.EventDispatcherEntry = EventDispatcherEntry;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EventDispatcherEntry;
//# sourceMappingURL=EventDispatcherEntry.js.map
