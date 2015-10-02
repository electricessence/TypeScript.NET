/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based upon: https://msdn.microsoft.com/en-us/library/System.Exception%28v=vs.110%29.aspx
 */

///<reference path="Collections/Dictionaries/IDictionary.d.ts"/>
///<reference path="Disposable/IDisposable.d.ts"/>


const NAME:string = 'Exception';

/**
 * Represents errors that occur during application execution.
 */
class Exception implements Error, IDisposable
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
	 */
	constructor(
		public message:string = null,
		innerException:Exception = null)
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

		Object.freeze(_);
	}

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
		var _ = this, m = _.message;
		m = m ? (': ' + m) : '';

		return '['+_.name+ m +']';
	}

	/**
	 * Clears the data object.
	 */
	dispose():void
	{
		var data = this.data;
		for(var k in data)
			delete data[k];
	}
}

export = Exception;
