/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

// Allows for simple type checking that includes types that don't declare themselves as IDisposable but do have a dispose() method.
export interface IDisposable
{
	dispose():void;
}

export default IDisposable;
