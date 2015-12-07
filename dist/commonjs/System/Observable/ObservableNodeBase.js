/*
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _SubscribableBase2 = require('./SubscribableBase');

var _SubscribableBase3 = _interopRequireDefault(_SubscribableBase2);

var ObservableNodeBase = (function (_SubscribableBase) {
    _inherits(ObservableNodeBase, _SubscribableBase);

    function ObservableNodeBase() {
        _classCallCheck(this, ObservableNodeBase);

        _get(Object.getPrototypeOf(ObservableNodeBase.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(ObservableNodeBase, [{
        key: 'onNext',
        value: function onNext(value) {
            processAction(this._getSubscribers(), function (s) {
                s.onNext && s.onNext(value);
            });
        }
    }, {
        key: 'onError',
        value: function onError(error) {
            processAction(this._getSubscribers(), function (s) {
                s.onError && s.onError(error);
            });
        }
    }, {
        key: 'onCompleted',
        value: function onCompleted() {
            processAction(this._unsubscribeAll(true), function (s) {
                s.onCompleted && s.onCompleted();
            });
        }
    }]);

    return ObservableNodeBase;
})(_SubscribableBase3['default']);

exports['default'] = ObservableNodeBase;

var OBSERVER_ERROR_MESSAGE = 'One or more observers had errors when attempting to pass information.';
function processAction(observers, handler) {
    var observersErrors = null;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = observers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var s = _step.value;

            try {
                handler(s);
            } catch (ex) {
                observersErrors = observersErrors || [];
                observersErrors.push({ observer: s, ex: ex });
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    observers.length = 0;
    if (observersErrors && observersErrors.length) {
        if (console && console.error) console.error(OBSERVER_ERROR_MESSAGE, observersErrors);else throw {
            message: OBSERVER_ERROR_MESSAGE,
            errors: observersErrors
        };
    }
}
module.exports = exports['default'];
//# sourceMappingURL=ObservableNodeBase.js.map
