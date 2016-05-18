/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


import {Type} from "../Types";
import {ArgumentException} from "../Exceptions/ArgumentException";
import {SetBase} from "./SetBase";
import {IMap} from "./Dictionaries/IDictionary";
import {ILinkedNodeWithValue} from "./ILinkedListNode";
import {Primitive} from "../Primitive";
import {IEnumerableOrArray} from "./IEnumerableOrArray";

const OTHER = 'other';

export class Set<T extends Primitive>
extends SetBase<T>
{
	protected newUsing(source?:IEnumerableOrArray<T>):Set<T>
	{
		return new Set<T>(source);
	}

	private _registry:IMap<IMap<ILinkedNodeWithValue<T>>>;

	protected _addInternal(item:T):boolean
	{
		var _ = this;
		if(!_.contains(item))
		{
			var type = typeof item;
			if(!Type.isPrimitive(type))
				throw new ArgumentException("item", "A Set can only index primitives.  Complex objects require a HashSet.");

			var r = _._registry;
			var t = r && r[type];
			if(!r) _._registry = r = {};
			if(!t) r[type] = t = {};
			var node:ILinkedNodeWithValue<T> = {value: item};
			_._getSet().addNode(node);
			t[<any>item] = node;
			return true;
		}
		return false;
	}

	protected _clearInternal():number
	{
		wipe(this._registry, 2);
		return super._clearInternal();
	}

	protected _onDispose():void
	{
		super._onDispose();
		this._registry = null;
	}

	protected _getNode(item:T):ILinkedNodeWithValue<T>
	{
		var r = this._registry, t = r && r[typeof item];

		return t && t[<any>item];
	}

	protected _removeInternal(item:T, max:number = Infinity):number
	{
		if(max===0) return 0;

		var r    = this._registry,
		    t    = r && r[typeof item],
		    node = t && t[<any>item];

		if(node)
		{
			delete t[<any>item];
			var s = this._set;
			if(s && s.removeNode(node))
			{
				return 1;
			}
		}

		return 0;
	}

}

function wipe(map:IMap<any>, depth:number = 1):void
{
	if(map && depth)
	{
		for(var key of Object.keys(map))
		{
			var v = map[key];
			delete map[key];
			wipe(v, depth - 1);
		}
	}
}

export default Set;