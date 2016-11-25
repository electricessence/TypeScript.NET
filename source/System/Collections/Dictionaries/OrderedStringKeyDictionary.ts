/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import {StringKeyDictionary} from "./StringKeyDictionary";
import {ArgumentOutOfRangeException} from "../../Exceptions/ArgumentOutOfRangeException";
import {IOrderedDictionary} from "./IDictionary";
import {remove} from "../Array/Utility";
import __extendsImport from "../../../extends";
// noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;

const VOID0:undefined = void 0;

export class OrderedStringKeyDictionary<TValue>
extends StringKeyDictionary<TValue> implements IOrderedDictionary<string, TValue>
{

	// noinspection JSMismatchedCollectionQueryUpdate
	private _order:string[] = []; // Maintains indexes.

	constructor()
	{
		super();
	}

	indexOfKey(key:string):number
	{
		const o = this._order;
		return o.length ? o.indexOf(key, 0) : -1;
	}

	getValueByIndex(index:number):TValue|undefined
	{
		const o = this._order;
		return index<o.length ? this.getValue(o[index]) : VOID0;
	}

	// adding keepIndex allows for clearing a value while still retaining it's index.
	setValue(key:string, value:TValue|undefined, keepIndex?:boolean):boolean
	{
		// TODO: This may be inefficient and could be improved.
		const _ = this;
		let exists = _.indexOfKey(key)!= -1;
		if(!exists && (value!==VOID0 || keepIndex))
			_._order.push(key);
		else if(exists && value===VOID0 && !keepIndex)
			remove(_._order, key);

		return super.setValue(key, value);
	}

	setByIndex(index:number, value:TValue|undefined):boolean
	{
		const _ = this;
		const order = _._order;
		if(index<0)
			throw new ArgumentOutOfRangeException('index', index, 'Is less than zero.');
		if(index>=order.length)
			throw new ArgumentOutOfRangeException('index', index, 'Is greater than the count.');
		return _.setValue(order[index], value);
	}

	// importValues([x,y,z]);
	importValues(values:TValue[]):boolean
	{
		const _ = this;
		return _.handleUpdate(
			() =>
			{
				let changed:boolean = false;
				for(let i = 0; i<values.length; i++)
				{
					if(_.setByIndex(i, values[i]))
						changed = true;
				}
				return changed;
			}
		);

	}

	// setValues(x,y,z);
	setValues(...values:TValue[]):boolean
	{
		return this.importValues(values);
	}

	removeByIndex(index:number):boolean
	{
		return this.setByIndex(index, VOID0);
	}

	protected getKeys():string[]
	{
		const _ = this;
		const o = _._order;
		return o.length && o.filter(key=> _.containsKey(key)) || [];
	}

}

export default OrderedStringKeyDictionary;
