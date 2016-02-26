/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    'use strict';
    var NAME = 'Exception';
    var Exception = (function () {
        function Exception(message, innerException, beforeSealing) {
            if (message === void 0) { message = null; }
            if (innerException === void 0) { innerException = null; }
            this.message = message;
            var _ = this;
            _.name = _.getName();
            _.data = {};
            if (innerException)
                _.data['innerException'] = innerException;
            if (beforeSealing)
                beforeSealing(_);
            Object.freeze(_);
        }
        Exception.prototype.getName = function () { return NAME; };
        Exception.prototype.toString = function () {
            var _ = this, m = _.message;
            m = m ? (': ' + m) : '';
            return '[' + _.name + m + ']';
        };
        Exception.prototype.dispose = function () {
            var data = this.data;
            for (var k in data) {
                if (data.hasOwnProperty(k))
                    delete data[k];
            }
        };
        return Exception;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Exception;
});
//# sourceMappingURL=Exception.js.map