/*!
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ObservableBase_1 = require("./ObservableBase");

var ObservableNodeBase = function (_ObservableBase_1$def) {
    _inherits(ObservableNodeBase, _ObservableBase_1$def);

    function ObservableNodeBase() {
        _classCallCheck(this, ObservableNodeBase);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ObservableNodeBase).apply(this, arguments));
    }

    _createClass(ObservableNodeBase, [{
        key: "onNext",
        value: function onNext(value) {
            this._onNext(value);
        }
    }, {
        key: "onError",
        value: function onError(error) {
            this._onError(error);
        }
    }, {
        key: "onCompleted",
        value: function onCompleted() {
            this._onCompleted();
        }
    }]);

    return ObservableNodeBase;
}(ObservableBase_1.default);

exports.ObservableNodeBase = ObservableNodeBase;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ObservableNodeBase;
//# sourceMappingURL=ObservableNodeBase.js.map
