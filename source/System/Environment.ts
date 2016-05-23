/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

declare var require:any;

export function isCommonJS():boolean{
	return !!(require && require.resolve)
}

export function isRequireJS():boolean{
	return !!(require && require.toUrl && require.defined)
}
