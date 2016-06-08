/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

declare const require:any;
declare const process:any;

export const
	isCommonJS:boolean
		= !!(require && require.resolve);

export const
	isRequireJS:boolean
		= !!(require && require.toUrl && require.defined);

/*
 * Ensure is in a real Node environment, with a `process.nextTick`.
 * To see through fake Node environments:
 * Mocha test runner - exposes a `process` global without a `nextTick`
 * Browserify - exposes a `process.nexTick` function that uses
 * `setTimeout`. In this case `setImmediate` is preferred because
 * it is faster. Browserify's `process.toString()` yields
 * "[object Object]", while in a real Node environment
 * `process.nextTick()` yields "[object process]".
 */

export const
	isNodeJS:boolean
		= typeof process=="object"
		&& process.toString()==="[object process]"
		&& process.nextTick!= void 0;

declare const exports:any;
Object.freeze(exports);