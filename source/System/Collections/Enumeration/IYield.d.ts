/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


export interface IYield<T> {
	current: T;
	yieldReturn(value:T): boolean;
	yieldBreak(): boolean;
}

export default IYield;
