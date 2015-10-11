///<reference path="ISerializable.d.ts"/>
/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import Types = require('../Types');
import InvalidOperationException = require('../Exceptions/InvalidOperationException');


const EMPTY = '', TRUE = 'true', FALSE = 'false';

type Primitive = string|boolean|number;

export function toString(
	value:Primitive|ISerializable,
	defaultForUnknown?:string):string
{

	var v = <any>value;
	switch(typeof v)
	{
		case Types.NULL:
			return Types.NULL;
		case Types.UNDEFINED:
			return Types.UNDEFINED;
		case Types.STRING:
			return v;
		case Types.BOOLEAN:
			return v ? TRUE : FALSE;
		case Types.NUMBER:
			return EMPTY + v;
		default:

			if('serialize' in v && typeof v.serialze==Types.FUNCTION)
				return v.serialize();
			else if(arguments.length>1)
				return defaultForUnknown;

			var ex = new InvalidOperationException('Attempting to serialize unidentifiable type.');
			ex.data['value'] = v;
			throw ex;

	}

}

export function toPrimitive(
	value:string,
	caseInsensitive?:boolean,
	unknownHandler?:(v:string)=>string):Primitive
{


	if(value)
	{
		if(caseInsensitive) value = value.toLowerCase();

		switch(value)
		{
			case Types.NULL:
				return null;
			case Types.UNDEFINED:
				return undefined;
			case TRUE:
				return true;
			case FALSE:
				return false;
			default:

				var cleaned = value.replace(/^\s+|,|\s+$/g,EMPTY);
				if(cleaned) {

					if(/^\d+$/g.test(cleaned)) {
						var int = parseInt(cleaned);
						if(!isNaN(int)) return int;
					} else {
						var number = parseFloat(value);
						if(!isNaN(number)) return number;
					}

				}

				// TODO: Handle Dates...  Possibly JSON?

				// Instead of throwing we allow for handling...
				if(unknownHandler) value = unknownHandler(value);

				break;
		}

	}

	return value;

}
