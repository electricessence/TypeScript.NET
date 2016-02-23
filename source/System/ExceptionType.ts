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


/**
 * An error in the eval() function has occurred.
 */
export const
Error = 'Error';

/**
 * An error in the eval() function has occurred.
 */
export const
EvalError = 'EvalError';

/**
 * Out of range number value has occurred.
 */
export const
RangeError = 'RangeError';


/**
 * An illegal reference has occurred.
 */
export const
ReferenceError = 'ReferenceError';

/**
 * A syntax error within code inside the eval() function has occurred. All other syntax errors are not caught by try/catch/finally, and will trigger the default browser error message associated with the error. To catch actual syntax errors, you may use the onerror event.
 */
export const
SyntaxError = 'SyntaxError';

/**
 * An error in the expected variable type has occurred.
 */
export const
TypeError = 'TypeError';

/**
 * An error when encoding or decoding the URI has occurred (ie: when calling encodeURI()).
 */
export const
URIError = 'URIError';

