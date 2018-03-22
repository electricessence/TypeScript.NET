/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

/*
 * Since the 'Error' type in JavaScript is simply {name:string, message:string},
 * Exception types provide a means for identifying and properly reusing 'name'.
 *
 * This is mostly for reference.
 */

declare const enum ExceptionType
{


	/**
	 * An error in the eval() function has occurred.
	 */
	Error          = 'Error',

	/**
	 * An error in the eval() function has occurred.
	 */
	EvalError      = 'EvalError',

	/**
	 * Out of range number value has occurred.
	 */
	RangeError     = 'RangeError',

	/**
	 * An illegal reference has occurred.
	 */
	ReferenceError = 'ReferenceError',

	/**
	 * A syntax error within code inside the eval() function has occurred. All other syntax errors are not caught by try/catch/finally, and will trigger the default browser error message associated with the error. To catch actual syntax errors, you may use the onerror event.
	 */
	SyntaxError    = 'SyntaxError',

	/**
	 * An error in the expected variable type has occurred.
	 */
	TypeError      = 'TypeError',

	/**
	 * An error when encoding or decoding the URI has occurred (ie: when calling encodeURI()).
	 */
	URIError       = 'URIError'

}

