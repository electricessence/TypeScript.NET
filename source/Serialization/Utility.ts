/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import TypeOfValue from "../Reflection/TypeOfValue";
import InvalidOperationException from "../Exceptions/InvalidOperationException";
import ISerializable from "./ISerializable";
import Primitive from "../Primitive";
import hasMemberOfType from "../Reflection/hasMemberOfType";


const EMPTY = '', TRUE = 'true', FALSE = 'false';

export function toString(
	value:Primitive|ISerializable|undefined|null,
	defaultForUnknown?:string):string
{

	let v = <any>value;
	switch(typeof v)
	{
		case TypeOfValue.String:
			return v;
		case TypeOfValue.Boolean:
			return v ? TRUE : FALSE;
		case TypeOfValue.Number:
			return EMPTY + v;
		default:

			if(v==null)
				return v;

			if(isSerializable(v))
				return v.serialize();
			else if(defaultForUnknown)
				return defaultForUnknown;

			const ex = new InvalidOperationException('Attempting to serialize unidentifiable type.');
			ex.data['value'] = v;
			throw ex;

	}

}

export function isSerializable(instance:any):instance is ISerializable
{
	return hasMemberOfType<ISerializable>(instance, 'serialize', TypeOfValue.Function);
}

export function toPrimitive(
	value:string,
	caseInsensitive?:boolean,
	unknownHandler?:(v:string)=>string):Primitive|null|undefined
{


	if(value)
	{
		if(caseInsensitive) value = value.toLowerCase();

		switch(value)
		{
			case 'null':
				return null;
			case TypeOfValue.Undefined:
				return void(0);
			case TRUE:
				return true;
			case FALSE:
				return false;
			default:

				const cleaned = value.replace(/^\s+|,|\s+$/g, EMPTY);
				if(cleaned)
				{

					if(/^\d+$/g.test(cleaned))
					{
						const int = parseInt(cleaned);
						if(!isNaN(int)) return int;
					}
					else
					{
						const number = parseFloat(value);
						if(!isNaN(number)) return number;
					}

				}

				// Handle Dates...  Possibly JSON?

				// Instead of throwing we allow for handling...
				if(unknownHandler) value = unknownHandler(value);

				break;
		}

	}

	return value;

}
