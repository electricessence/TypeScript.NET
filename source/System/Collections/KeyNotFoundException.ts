/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/system.collections.generic.KeyNotFoundException(v=vs.110).aspx
 */


import {SystemException, Error} from "../Exceptions/SystemException";

const NAME:string = 'KeyNotFoundException ';

export {Error};

export class KeyNotFoundException extends SystemException
{
	protected getName():string
	{
		return NAME;
	}

}

export default KeyNotFoundException;