/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */

import {IDisposable} from "./Disposable/IDisposable";
import {IMap} from "./Collections/Dictionaries/IDictionary";
const NAME:string = 'Exception';

/**
 * Represents errors that occur during application execution.
 */
export class Exception implements Error, IDisposable
{
	/**
	 * A string representation of the error type.
	 * The default is 'Error'.
	 */
	name:string;

	/**
	 * Initializes a new instance of the Exception class with a specified error message and optionally a reference to the inner exception that is the cause of this exception.
	 * @param message
	 * @param innerException
	 * @param beforeSealing This delegate is used to allow actions to occur just before this constructor finishes.  Since some compilers do not allow the use of 'this' before super.
	 */
	constructor(
		public message:string = null,
		innerException:Error = null,
		beforeSealing?:(ex:any)=>void)
	{
		var _ = this;

		_.name = _.getName();
		_.data = {};
		if(innerException)
			_.data['innerException'] = innerException;

		/* Originally intended to use 'get' accessors for properties,
		 * But debuggers don't display these readily yet.
		 * Object.freeze has to be used carefully, but will prevent overriding values.
		 */

		if(beforeSealing) beforeSealing(_);

		// Node has a .stack, let's use it...
		try {
			var stack:string = (<any>new Error()).stack;
			stack = stack && stack.replace(/^Error\n/,'').replace(/(.|\n)+\s+at new.+/,'') || '';
			this.stack = _.toStringWithoutBrackets() + stack;
		} catch(ex) {}

		Object.freeze(_);
	}

	stack:string;

	data:IMap<any>;

	/**
	 * A string representation of the error type.
	 * The default is 'Error'.
	 */
	protected getName():string
	{ return NAME; }

	/**
	 * The string representation of the Exception instance.
	 */
	toString():string
	{
		return `[${this.toStringWithoutBrackets()}]`;
	}

	protected toStringWithoutBrackets():string {
		var _ = this, m = _.message;
		return _.name + (m ? (': ' + m) : '');
	}

	/**
	 * Clears the data object.
	 */
	dispose():void
	{
		var data = this.data;
		for(let k in data)
		{
			if(data.hasOwnProperty(k))
				delete data[k];
		}
	}
}

export default Exception;
