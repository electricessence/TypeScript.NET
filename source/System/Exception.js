(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    /*
     * @author electricessence / https://github.com/electricessence/
     * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
     * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
     */
    ///<reference path="Collections/Dictionaries/IDictionary.d.ts"/>
    ///<reference path="Disposable/IDisposable.d.ts"/>
    'use strict'; // For compatibility with (let, const, function, class);
    var NAME = 'Exception';
    /**
     * Represents errors that occur during application execution.
     */
    var Exception = (function () {
        /**
         * Initializes a new instance of the Exception class with a specified error message and optionally a reference to the inner exception that is the cause of this exception.
         * @param message
         * @param innerException
         * @param beforeSealing This delegate is used to allow actions to occur just before this constructor finishes.  Since some compilers do not allow the use of 'this' before super.
         */
        function Exception(message, innerException, beforeSealing) {
            if (message === void 0) { message = null; }
            if (innerException === void 0) { innerException = null; }
            this.message = message;
            var _ = this;
            _.name = _.getName();
            _.data = {};
            if (innerException)
                _.data['innerException'] = innerException;
            /* Originally intended to use 'get' accessors for properties,
             * But debuggers don't display these readily yet.
             * Object.freeze has to be used carefully, but will prevent overriding values.
             */
            if (beforeSealing)
                beforeSealing(_);
            Object.freeze(_);
        }
        /**
         * A string representation of the error type.
         * The default is 'Error'.
         */
        Exception.prototype.getName = function () { return NAME; };
        /**
         * The string representation of the Exception instance.
         */
        Exception.prototype.toString = function () {
            var _ = this, m = _.message;
            m = m ? (': ' + m) : '';
            return '[' + _.name + m + ']';
        };
        /**
         * Clears the data object.
         */
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