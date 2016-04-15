/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../Primitive.d.ts"/>
///<reference path="ISet.d.ts"/>
///<reference path="IEnumerableOrArray.d.ts"/>
import Type from "../Types";
import LinkedNodeList from "./LinkedNodeList";
import ArgumentException from "../Exceptions/ArgumentException";
import ArgumentNullException from "../Exceptions/ArgumentNullException";
import forEach from "./Enumeration/forEach";
import {empty as emptyEnumerator} from "./Enumeration/Enumerator";
import {using} from "../Disposable/Utility";

const OTHER = 'other';

export default class Set<T extends Primitive> implements ISet<T>, IDisposable
{
	constructor(source?:IEnumerableOrArray<T>)
	{
		this._count = 0;
		if(source) this.unionWith(source);
	}

	private _registry:IMap<IMap<ILinkedNodeWithValue<T>>>;
	private _set:LinkedNodeList<ILinkedNodeWithValue<T>>;

	private _getSet():LinkedNodeList<ILinkedNodeWithValue<T>>
	{
		var s = this._set;
		if(!s) this._set = s = new LinkedNodeList<ILinkedNodeWithValue<T>>();
		return s;
	}

	private _count:number;
	get count():number
	{
		return this._count;
	}

	//noinspection JSMethodCanBeStatic
	get isReadOnly():boolean { return true; }

	exceptWith(other:IEnumerableOrArray<T>):void
	{
		if(!other) throw new ArgumentNullException(OTHER);

		forEach(other, v=>
		{
			this.remove(v);
		});
	}

	intersectWith(other:IEnumerableOrArray<T>):void
	{
		if(!other) throw new ArgumentNullException(OTHER);

		if(other instanceof Set)
		{
			let s = this._set;
			if(s) s.forEach(n=>
			{
				if(!other.contains(n.value))
					this.remove(n.value);
			});
		}
		else
		{
			using(new Set(other), o=>this.intersectWith(o));
		}
	}

	isProperSubsetOf(other:IEnumerableOrArray<T>):boolean
	{
		if(!other) throw new ArgumentNullException(OTHER);

		return other instanceof Set
			? other.isProperSupersetOf(this)
			: using(new Set(other), o=> o.isProperSupersetOf(this));
	}

	isProperSupersetOf(other:IEnumerableOrArray<T>):boolean
	{
		if(!other) throw new ArgumentNullException(OTHER);

		var result = true, count:number;
		if(other instanceof Set)
		{
			result = this.isSupersetOf(other);
			count = other._count;
		}
		else
		{
			using(new Set<T>(), o=>
			{
				forEach(other, v=>
				{
					o.add(v); // We have to add to another set in order to filter out duplicates.
					return result = this.contains(v);
				});
				count = o._count;
			});
		}

		return result && this._count>count;
	}

	isSubsetOf(other:IEnumerableOrArray<T>):boolean
	{
		if(!other) throw new ArgumentNullException(OTHER);

		return other instanceof Set
			? other.isSupersetOf(this)
			: using(new Set(other), o=> o.isSupersetOf(this));
	}

	isSupersetOf(other:IEnumerableOrArray<T>):boolean
	{
		if(!other) throw new ArgumentNullException(OTHER);

		var result = true;
		forEach(other, v=>
		{
			return result = this.contains(v);
		});
		return result;
	}

	overlaps(other:IEnumerableOrArray<T>):boolean
	{
		if(!other) throw new ArgumentNullException(OTHER);

		var result = false;
		forEach(other, v=>
		{
			return !(result = this.contains(v));
		});
		return result;
	}

	setEquals(other:IEnumerableOrArray<T>):boolean
	{
		if(!other) throw new ArgumentNullException(OTHER);

		return this._count==(
				other instanceof Set
					? other._count
					: using(new Set(other), o=> o._count))
			&& this.isSubsetOf(other);
	}

	symmetricExceptWith(other:IEnumerableOrArray<T>):void
	{
		if(!other) throw new ArgumentNullException(OTHER);

		if(other instanceof Set)
		{
			forEach(other, v=>
			{
				if(this.contains(v))
					this.remove(v);
				else
					this.add(v);
			});
		}
		else
		{
			using(new Set(other), o=>this.symmetricExceptWith(o));
		}
	}

	unionWith(other:IEnumerableOrArray<T>):void
	{
		forEach(other, v=>
		{
			this.add(v);
		});
	}

	add(item:T):void
	{
		if(!this.contains(item))
		{
			var type = typeof item;
			if(!Type.isPrimitive(type))
				throw new ArgumentException("item", "A Set can only index primitives.  Complex objects require a HashSet.");

			var r = this._registry;
			var t = r && r[type];
			if(!r) this._registry = r = {};
			if(!t) r[type] = t = {};
			var node:ILinkedNodeWithValue<T> = {value: item};
			this._getSet().addNode(node);
			t[<any>item] = node;
			++this._count;
		}
	}

	clear():number
	{
		var _ = this;
		_._count = 0;
		wipe(_._registry, 2);
		var s = _._set;
		return s ? s.clear() : 0;
	}

	dispose():void
	{
		this.clear();
		this._set = null;
		this._registry = null;
	}

	private _getNode(item:T):ILinkedNodeWithValue<T>
	{
		var r = this._registry, t = r && r[typeof item];

		return t && t[<any>item];
	}

	contains(item:T):boolean
	{
		return !!this._getNode(item);
	}

	copyTo(array:T[], index:number = 0):T[]
	{
		if(!array) throw new ArgumentNullException('array');

		var s = this._set, c = this._count;
		if(!s || !c) return array;

		var minLength = index + c;
		if(array.length<minLength) array.length = minLength;
		return LinkedNodeList.copyValues(s, array, index);
	}

	toArray():T[]
	{
		var s = this._set;
		return s ? s.map(n=>n.value) : [];
	}

	remove(item:T):number
	{
		var r = this._registry, t = r && r[typeof item],
		    node                  = t && t[<any>item];

		if(node)
		{
			delete t[<any>item];
			var s = this._set;
			if(s && s.removeNode(node))
			{
				--this._count;
				return 1;
			}
		}
		return 0;
	}

	getEnumerator():IEnumerator<T>
	{
		var s = this._set;
		return s && this._count
			? LinkedNodeList.valueEnumeratorFrom<T>(s)
			: emptyEnumerator;
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