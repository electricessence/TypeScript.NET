/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../Primitive.d.ts"/>
import LinkedNodeList from "./LinkedNodeList";
import ArgumentNullException from "../Exceptions/ArgumentNullException";
import forEach from "./Enumeration/forEach";
import {using} from "../Disposable/Utility";
// import Type from "../Types";

const OTHER = 'other';

export default class Set<T extends Primitive> implements ISet<T>, IDisposable
{
	constructor(source?:IEnumerable<T>|IArray<T>)
	{
		this._registry = {};
		this._set = new LinkedNodeList<ILinkedNodeWithValue<T>>();
		this._count = 0;
		if(source) this.unionWith(source);
	}

	private _registry:IMap<IMap<ILinkedNodeWithValue<T>>>;
	private _set:LinkedNodeList<ILinkedNodeWithValue<T>>;

	private _count:number;
	get count():number
	{
		return this._count;
	}

	//noinspection JSMethodCanBeStatic
	get isReadOnly():boolean { return true; }

	exceptWith(other:IEnumerable<T>|IArray<T>):void
	{
		if(!other) throw new ArgumentNullException(OTHER);

		forEach(other, v=>
		{
			this.remove(v);
		});
	}

	intersectWith(other:IEnumerable<T>|IArray<T>):void
	{
		if(!other) throw new ArgumentNullException(OTHER);

		if(other instanceof Set)
		{
			let s = this._set;
			s.forEach(n=>
			{
				if(!other.contains(n.value) && s.removeNode(n))
				{
					--this._count;
				}
			});
		}
		else
		{
			using(new Set(other), o=>this.intersectWith(o));
		}
	}

	isProperSubsetOf(other:IEnumerable<T>|IArray<T>):boolean
	{
		if(!other) throw new ArgumentNullException(OTHER);

		return other instanceof Set
			? other.isProperSupersetOf(this)
			: using(new Set(other), o=> o.isProperSupersetOf(this));
	}

	isProperSupersetOf(other:IEnumerable<T>|IArray<T>):boolean
	{
		if(!other) throw new ArgumentNullException(OTHER);

		var result = true, count:number;
		if(other instanceof Set)
		{
			result = this.isSubsetOf(other);
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

	isSubsetOf(other:IEnumerable<T>|IArray<T>):boolean
	{
		if(!other) throw new ArgumentNullException(OTHER);

		return other instanceof Set
			? other.isSupersetOf(this)
			: using(new Set(other), o=> o.isSupersetOf(this));
	}

	isSupersetOf(other:IEnumerable<T>|IArray<T>):boolean
	{
		if(!other) throw new ArgumentNullException(OTHER);

		var result = true;
		forEach(other, v=>
		{
			return result = this.contains(v);
		});
		return result;
	}

	overlaps(other:IEnumerable<T>|IArray<T>):boolean
	{
		if(!other) throw new ArgumentNullException(OTHER);

		var result = false;
		forEach(other, v=>
		{
			return !(result = this.contains(v));
		});
		return result;
	}

	setEquals(other:IEnumerable<T>|IArray<T>):boolean
	{
		if(!other) throw new ArgumentNullException(OTHER);

		return this._count==(
				other instanceof Set
					? other._count
					: using(new Set(other), o=> o._count))
			&& this.isSubsetOf(other);
	}

	symmetricExceptWith(other:IEnumerable<T>|IArray<T>):void
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

	unionWith(other:IEnumerable<T>|IArray<T>):void
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
			var t = this._registry[type];
			var node:ILinkedNodeWithValue<T> = {
				value: item,
				previous: null,
				next: null
			};
			this._set.addNode(node);
			t[<any>item] = node;
			++this._count;
		}
	}

	clear():number
	{
		this._count = 0;
		wipe(this._registry,2);
		return this._set.clear();
	}

	dispose():void
	{
		this.clear();
	}

	private _getNode(item:T):ILinkedNodeWithValue<T>
	{
		var t = this._registry[typeof item];

		return t && t[<any>item];
	}

	contains(item:T):boolean
	{
		return !!this._getNode(item);
	}

	copyTo(array:T[], index:number = 0):T[]
	{
		if(!array) throw new ArgumentNullException('array');

		var minLength = index + this._count;
		if(array.length<minLength) array.length = minLength;
		return LinkedNodeList.copyValues(this._set, array, index);
	}

	toArray():T[]
	{
		return this._set.map(n=>n.value);
	}

	remove(item:T):number
	{
		var node = this._getNode(item);
		if(node && this._set.removeNode(node))
		{
			--this._count;
			return 1;
		}
		return 0;
	}

	getEnumerator():IEnumerator<T>
	{
		return LinkedNodeList.valueEnumeratorFrom<T>(this._set);
	}

}

function wipe(map:IMap<any>, depth:number = 1):void
{
	if(depth)
	{
		for(var key of Object.keys(map))
		{
			var v = map[key];
			delete map[key];
			wipe(v, depth - 1);
		}
	}
}