/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
///<reference path="Collections/Dictionaries/IDictionary.d.ts"/>
///<reference path="Disposable/IDisposable.d.ts"/>
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var NAME = 'Exception';

var Exception = (function () {
    function Exception(message, innerException, beforeSealing) {
        if (message === undefined) message = null;
        if (innerException === undefined) innerException = null;

        _classCallCheck(this, Exception);

        this.message = message;
        var _ = this;
        _.name = _.getName();
        _.data = {};
        if (innerException) _.data['innerException'] = innerException;
        beforeSealing(_);
        Object.freeze(_);
    }

    _createClass(Exception, [{
        key: 'getName',
        value: function getName() {
            return NAME;
        }
    }, {
        key: 'toString',
        value: function toString() {
            var _ = this,
                m = _.message;
            m = m ? ': ' + m : '';
            return '[' + _.name + m + ']';
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            var data = this.data;
            for (var k in data) {
                if (data.hasOwnProperty(k)) delete data[k];
            }
        }
    }]);

    return Exception;
})();

exports['default'] = Exception;
module.exports = exports['default'];
//# sourceMappingURL=Exception.js.map
