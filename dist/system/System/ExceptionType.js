/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
System.register([], function (exports_1, context_1) {
    "use strict";
    var Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {/*!
             * @author electricessence / https://github.com/electricessence/
             * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
             */
            /*
             * Since the 'Error' type in JavaScript is simply {name:string, message:string},
             * Exception types provide a means for identifying and properly reusing 'name'.
             *
             * This is mostly for reference.
             */
            /**
             * An error in the eval() function has occurred.
             */
            exports_1("Error", Error = 'Error');
            /**
             * An error in the eval() function has occurred.
             */
            exports_1("EvalError", EvalError = 'EvalError');
            /**
             * Out of range number value has occurred.
             */
            exports_1("RangeError", RangeError = 'RangeError');
            /**
             * An illegal reference has occurred.
             */
            exports_1("ReferenceError", ReferenceError = 'ReferenceError');
            /**
             * A syntax error within code inside the eval() function has occurred. All other syntax errors are not caught by try/catch/finally, and will trigger the default browser error message associated with the error. To catch actual syntax errors, you may use the onerror event.
             */
            exports_1("SyntaxError", SyntaxError = 'SyntaxError');
            /**
             * An error in the expected variable type has occurred.
             */
            exports_1("TypeError", TypeError = 'TypeError');
            /**
             * An error when encoding or decoding the URI has occurred (ie: when calling encodeURI()).
             */
            exports_1("URIError", URIError = 'URIError');
        }
    };
});
//# sourceMappingURL=ExceptionType.js.map