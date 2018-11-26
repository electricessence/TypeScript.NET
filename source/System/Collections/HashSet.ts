/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {Type} from "../Types";
import SetBase from "./SetBase";
import IMap from "../../IMap";
import {ILinkedNodeWithValue} from "./ILinkedListNode";
import {EqualityComparison, HashSelector} from "../FunctionTypes";
import ArgumentNullException from "../Exceptions/ArgumentNullException";
import FiniteEnumerableOrArrayLike from "./FiniteEnumerableOrArrayLike";
import __extendsImport from "../../extends";
import {areEqual} from "../Compare";
import LinkedNodeList from "./LinkedNodeList";
import ObjectPool from "../Disposable/ObjectPool";
// noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;


const VOID0:undefined = void 0;

const bucketPool = new ObjectPool<any>(
	100,
	() => new LinkedNodeList<any>()
);

const EMPTY = "";
function selfHash(item:any):string
{
	return item + EMPTY;
}

export class HashSet<T>
	extends SetBase<T>
{
	private readonly _hashGenerator:HashSelector<T>;
	private readonly _comparer:EqualityComparison<T>;

	constructor(hashGenerator?:HashSelector<T>, comparer?:EqualityComparison<T>)
	constructor(
		source:FiniteEnumerableOrArrayLike<T> | undefined,
		keyGenerator?:HashSelector<T> | EqualityComparison<T>,
		comparer?:EqualityComparison<T>)
	constructor(source:any, keyGenerator:any = selfHash, comparer:EqualityComparison<T> = areEqual)
	{
		super();
		if(Type.isFunction(source))
		{
			this._hashGenerator = source;
			this._comparer = keyGenerator || comparer;
		}
		else
		{
			if(!keyGenerator)
				throw new ArgumentNullException("keyGenerator");
			this._hashGenerator = keyGenerator;
			this._comparer = comparer;
			this._importEntries(source);
		}
		if(!this._comparer)
			throw new ArgumentNullException("comparer");
	}

	protected newUsing(source?:FiniteEnumerableOrArrayLike<T>):HashSet<T>
	{
		return new HashSet<T>(source, this._hashGenerator, this._comparer);
	}

	private _registry:IMap<IMap<LinkedNodeList<ILinkedNodeWithValue<ILinkedNodeWithValue<T>>>>> | undefined;

	protected _addInternal(item:T):boolean
	{
		const _ = this;
		const type = typeof item;
		const key = _._hashGenerator(item);
		let r = _._registry, t = r && r[type], list = t && t[key];
		const comparer = this._comparer;
		const listNode = list && list.find(e => comparer(e.value.value, item));

		if(!listNode)
		{
			if(!r)
			{
				//noinspection JSUnusedAssignment
				_._registry = r = {};
			}

			if(!t)
			{
				//noinspection JSUnusedAssignment
				r[type] = t = {};
			}

			if(!list)
			{
				t[key] = list = bucketPool.take();
			}

			const node:ILinkedNodeWithValue<T> = {value: item};
			_._getSet().addNode(node); // add to the full list

			list!.addNode({value: node}); // Add to the hash bucket (listNode).
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
		this._clearInternal(); // returns reusable buckets to pool.
		this._registry = <any>null;
		(<any>this)._hashGenerator = VOID0;
	}

	protected _getNode(item:T):ILinkedNodeWithValue<T> | undefined
	{
		const r = this._registry,
		      t = r && r[typeof item],
		      list = t && t[this._hashGenerator(item)];

		if(!list) return VOID0;

		const comparer = this._comparer;
		const node = list.find(e => comparer(e.value.value, item));
		return node && node.value || undefined;
	}

	protected _removeInternal(item:T, max:number = Infinity):number
	{
		if(max===0) return 0;

		const r        = this._registry,
		      t        = r && r[typeof item],
		      list     = t && t[<any>item],
		      comparer = this._comparer,
		      node     = list && list.find(e => comparer(e.value.value, item));

		if(node)
		{
			const listNode = node.value;
			list!.removeNode(node);
			if(!list!.first) {
				delete t![<any>item];
				bucketPool.add(list);
			}
			const s = this._set;
			if(s && s.removeNode(listNode))
				return 1;
		}

		return 0;
	}

}

function wipe(map:IMap<any> | undefined, depth:number = 1):void
{
	if(map && depth)
	{
		for(let key of Object.keys(map))
		{
			let v = map[key];
			delete map[key];
			if(v instanceof LinkedNodeList)
				bucketPool.add(v);
			else
				wipe(v, depth - 1);
		}
	}
}

export default HashSet;