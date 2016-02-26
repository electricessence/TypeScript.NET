/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SubscribableBase_1 = require('./SubscribableBase');

var ObservableNodeBase = function (_SubscribableBase_1$d) {
    _inherits(ObservableNodeBase, _SubscribableBase_1$d);

    function ObservableNodeBase() {
        _classCallCheck(this, ObservableNodeBase);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ObservableNodeBase).apply(this, arguments));
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
}(SubscribableBase_1.default);

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ObservableNodeBase;
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
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
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
//# sourceMappingURL=ObservableNodeBase.js.map
