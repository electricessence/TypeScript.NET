/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import StringKeyDictionary= require('./StringKeyDictionary');
import ArrayUtility = require('../Array/Utility');
import ArgumentOutOfRangeException = require('../../Exceptions/ArgumentOutOfRangeException')

class OrderedStringKeyDictionary<TValue>
extends StringKeyDictionary<TValue> implements IOrderedDictionary<string, TValue>
{

	// noinspection JSMismatchedCollectionQueryUpdate
	private _order:string[] = []; // Maintains indexes.

	constructor() {
		super();
	}

	indexOfKey(key:string):number {
		return this._order.indexOf(key, 0);
	}

	getValueByIndex(index:number):TValue {
		return this.getValue(this._order[index]);
	}

	// adding keepIndex allows for clearing a value while still retaining it's index.
	setValue(key:string, value:TValue, keepIndex?:boolean):boolean {
		var _ = this, exists = _.indexOfKey(key)!= -1;
		if(!exists && (value!==undefined || keepIndex))
			_._order.push(key);
		else if(exists && value===undefined && !keepIndex)
			ArrayUtility.remove(_._order, key);

		return super.setValue(key, value);
	}

	setByIndex(index:number, value:TValue):boolean {
		var _ = this, order = _._order;
		if(index<0 || index>=order.length)
			throw new ArgumentOutOfRangeException('index',index);

		return _.setValue(order[index], value);
	}

	// importValues([x,y,z]);
	importValues(values:TValue[]):boolean {
		var _ = this;
		return _.handleUpdate(
			() => {
				var changed:boolean = false;
				for(var i = 0; i<values.length; i++) {
					if(_.setByIndex(i, values[i]))
						changed = true;
				}
				return changed;
			}
		);

	}

	// setValues(x,y,z);
	setValues(...values:TValue[]):boolean {
		return this.importValues(values);
	}

	removeByIndex(index:number):boolean {
		return this.setByIndex(index, undefined);
	}

	get keys():string[] {
		var _ = this;
		return _._order.filter(key=> _.containsKey(key));
	}

}

export = OrderedStringKeyDictionary;
