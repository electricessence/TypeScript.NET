/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */


///<reference path="../System/Collections/Enumeration/IEnumerable"/>
import DisposeUtility = require('../System/Disposable/Utility');
import EnumeratorBase = require('../System/Collections/Enumeration/EnumeratorBase');
import Enumerable= require('./Enumerable');
import WhereEnumerable= require('./WhereEnumerable');
'use strict';


class WhereSelectEnumerable<TSource, T> extends Enumerable<T>
{
	constructor(
		private prevSource:IEnumerable<TSource>,
		private prevPredicate:Predicate<TSource>,  // predicate.length always <= 1
		private prevSelector:Selector<TSource, T> // selector.length always <= 1
	)
	{
		super(null);
	}

	where(predicate:(value:T, index?:number) => boolean):Enumerable<T>
	{
		if(predicate.length>1)
			return super.where(predicate);

		return new WhereEnumerable<T>(this, predicate);
	}

	select<TSelect>(selector:Selector<T, TSelect>):Enumerable<TSelect>
	{

		if(selector.length>1)
		// if selector use index, can't compose
			return super.select(selector);

		var _ = this;
		var prevSelector = _.prevSelector;
		var composedSelector = (x:TSource) => selector(prevSelector(x));
		return new WhereSelectEnumerable(_.prevSource, _.prevPredicate, composedSelector);
	}

	getEnumerator():IEnumerator<T>
	{
		var _ = this,
			predicate = _.prevPredicate,
			source = _.prevSource,
			selector:Selector<TSource, T> = _.prevSelector, // Type definition needed for correct inference.
			enumerator:IEnumerator<TSource>;

		return new EnumeratorBase<T>(
			() => { enumerator = source.getEnumerator(); },

			(yielder)=>
			{
				while(enumerator.moveNext())
				{
					var c = enumerator.current;
					if(predicate==null || predicate(c))
					{
						return yielder.yieldReturn(selector(c));
					}
				}
				return false;
			},

			() => { DisposeUtility.dispose(enumerator); }
		);
	}

	protected _onDispose():void
	{
		var _ = this;
		super._onDispose();
		_.prevPredicate = null;
		_.prevSource = null;
		_.prevSelector = null;
	}
}


export = WhereSelectEnumerable;