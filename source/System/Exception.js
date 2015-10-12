/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */
define(["require", "exports"], function (require, exports) {
    ///<reference path="Collections/Dictionaries/IDictionary.d.ts"/>
    ///<reference path="Disposable/IDisposable.d.ts"/>
    var NAME = 'Exception';
    var Exception = (function () {
        function Exception(message, innerException) {
            if (message === void 0) { message = null; }
            if (innerException === void 0) { innerException = null; }
            this.message = message;
            var _ = this;
            _.name = _.getName();
            _.data = {};
            if (innerException)
                _.data['innerException'] = innerException;
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
            for (var k in data)
                if (data.hasOwnProperty(k))
                    delete data[k];
        };
        return Exception;
    })();
    return Exception;
});
//# sourceMappingURL=Exception.js.map