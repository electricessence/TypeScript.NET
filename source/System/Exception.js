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
    "use strict";
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
            try {
                var stack = (new Error()).stack;
                stack = stack && stack.replace(/^Error\n/, '').replace(/(.|\n)+\s+at new.+/, '') || '';
                this.stack = _.toStringWithoutBrackets() + stack;
            }
            catch (ex) { }
            Object.freeze(_);
        }
        Exception.prototype.getName = function () { return NAME; };
        Exception.prototype.toString = function () {
            return "[" + this.toStringWithoutBrackets() + "]";
        };
        Exception.prototype.toStringWithoutBrackets = function () {
            var _ = this, m = _.message;
            return _.name + (m ? (': ' + m) : '');
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
    exports.Exception = Exception;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Exception;
});
//# sourceMappingURL=Exception.js.map