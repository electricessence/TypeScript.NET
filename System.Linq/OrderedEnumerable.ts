/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */


///<reference path="../System/Collections/Enumeration/IEnumerable"/>
import System = require('../System/System');
import DisposeUtility = require('../System/Disposable/Utility');
import EnumeratorBase = require('../System/Collections/Enumeration/EnumeratorBase');
import Enumerable = require('Enumerable');
import WhereSelectEnumerable = require('WhereSelectEnumerable');
'use strict';

const
	INT_0:number = 0 | 0,
	INT_NEGATIVE_1 = -1 | 0,
	INT_POSITIVE_1 = +1 | 0;


class OrderedEnumerable<T> extends Enumerable<T>
{

	constructor(
		private source:IEnumerable<T>,
		public keySelector:(value:T) => any,
		public descending:boolean,
		public parent?:OrderedEnumerable<T>)
	{
		super(null);
	}

	createOrderedEnumerable(keySelector:(value:T) => any, descending:boolean):OrderedEnumerable<T>
	{
		return new OrderedEnumerable<T>(this.source, keySelector, descending, this);
	}

	thenBy(keySelector:(value:T) => any):OrderedEnumerable<T>
	{
		return this.createOrderedEnumerable(keySelector, false);
	}

	thenByDescending(keySelector:(value:T) => any):OrderedEnumerable<T>
	{
		return this.createOrderedEnumerable(keySelector, true);
	}

	getEnumerator():EnumeratorBase<T>
	{
		var _ = this;
		var buffer:T[];
		var indexes:number[];
		var index:number = INT_0;

		return new EnumeratorBase<T>(
			() =>
			{
				index = INT_0;
				buffer = [];
				indexes = [];
				Enumerable.forEach(
					_.source, (item, i) =>
					{
						buffer[i] = item;
						indexes[i] = i;
					}
				);
				var sortContext = SortContext.create(_);
				sortContext.generateKeys(buffer);

				indexes.sort((a, b) => sortContext.compare(a, b));
			},
				yielder =>
			{
				return (index<indexes.length)
					? yielder.yieldReturn(buffer[indexes[index++]])
					: false;
			},
			() =>
			{
				if(buffer)
					buffer.length = 0;
				buffer = null;
				if(indexes)
					indexes.length = 0;
				indexes = null;
			}
		);
	}

	protected _onDispose():void
	{
		super._onDispose();
		this.source = null;
		this.keySelector = null;
		this.descending = null;
		this.parent = null;
	}
}

class SortContext<T, TOrderBy>
{

	keys:TOrderBy[];

	constructor(
		public keySelector:(value:T) => TOrderBy,
		public descending:boolean,
		public child:SortContext<T, TOrderBy>)
	{
		this.keys = null;
	}

	static create<T, TOrderBy>(
		orderedEnumerable:OrderedEnumerable<T>,
		currentContext:SortContext<T, TOrderBy> = null):SortContext<T, TOrderBy>
	{
		var context:SortContext<T, TOrderBy>
			= new SortContext<T, TOrderBy>(
			orderedEnumerable.keySelector,
			orderedEnumerable.descending,
			currentContext
		);

		if(orderedEnumerable.parent)
			return SortContext.create(orderedEnumerable.parent, context);

		return context;
	}

	generateKeys(source:IArray<T>):void
	{
		var _ = this;
		var len = source.length | 0;
		var keySelector:(value:T) => TOrderBy = _.keySelector;
		var keys = new Array<TOrderBy>(len);
		for(var i = INT_0; i<len; ++i) {
			keys[i] = keySelector(source[i]);
		}
		_.keys = keys;

		if(_.child)
			_.child.generateKeys(source);
	}

	compare(index1:number, index2:number):number
	{
		var _ = this, keys = _.keys;
		var comparison = System.compare(keys[index1], keys[index2]);

		if(comparison==0) {
			var child = _.child;
			return child
				? child.compare(index1, index2)
				: System.compare(index1, index2);
		}

		return _.descending ? -comparison : comparison;
	}
}

export = OrderedEnumerable;
