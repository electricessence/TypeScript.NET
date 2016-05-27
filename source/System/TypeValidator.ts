/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

/**
 * A descriptor is simply a JSON tree that either has an actual value or a type that identifies what the expect type should be at that leaf in the tree.
 *
 * var descriptor = {
 *      a : Object,
 *      b : String,
 *      c : {
 *          d : true ,
 *          e : Array,
 *          f : []
 *      },
 *      g : "literal"
 * }
 */

import {TypeInfo} from "./Types";
import {areEqual} from "./Collections/Array/Compare";
export class TypeValidator extends TypeInfo {

	private _value:any;
	constructor(value:any) {
		super(value,()=>this._value = value);

	}

	contains<TDescriptor>(descriptor:any):this is TDescriptor {

		let value = this._value;

		if(value===descriptor)
			return true;
		
		switch (descriptor) {
			case Function:
				return this.isFunction;
			case Object:
				return this.isObject;
			case Array:
				return this.isArray;
			case String:
				return this.isString;
			case Number:
				return this.isNumber;
			case Boolean:
				return this.isBoolean;
		}
		
		if(this.type != typeof descriptor)
			return false;

		// TODO: Fix later, ignore arrays for now...
		if(this.isArray && Array.isArray(descriptor)) {
			return true;
		}

		if(this.isObject) {
			let targetKeys = Object.keys(value);
			let dKeys = Object.keys(descriptor);

			// Quick check...
			if(dKeys.length>targetKeys.length)
				return false;

			// Quick check #2...
			for(let key of dKeys) {
				if(targetKeys.indexOf(key)==-1)
					return false;
			}

			// Final pass with recursive...
			// Quick check #2...
			for(let key of dKeys) {
				let v = value[key], d = descriptor[key];
				if(areEqual(v,d)) continue;
				let memberType = new TypeValidator(value[key]);
				if(!memberType.contains(descriptor[key]))
					return false;
			}
		}

		return true;
	}
	
}

export default TypeValidator;