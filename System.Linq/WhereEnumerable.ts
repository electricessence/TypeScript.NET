/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */


///<reference path="../System/Collections/Enumeration/IEnumerable"/>
import DisposeUtility = require('../System/Disposable/Utility');
import EnumeratorBase = require('../System/Collections/Enumeration/EnumeratorBase');
import Enumerable= require('./Enumerable');
import WhereSelectEnumerable= require('./WhereSelectEnumerable');
'use strict';


class WhereEnumerable<T> extends Enumerable<T>
{
	constructor(
		private prevSource:IEnumerable<T>,
		private prevPredicate:Predicate<T>  // predicate.length always <= 1
	)
	{
		super(null);
	}

	where(predicate:Predicate<T>):Enumerable<T>
	{

		if(predicate.length>1)
			return super.where(predicate);

		var prevPredicate = this.prevPredicate;
		var composedPredicate = (x:T) => prevPredicate(x) && predicate(x);
		return new WhereEnumerable<T>(this.prevSource, composedPredicate);
	}

	select<TSelect>(selector:Selector<T, TSelect>):Enumerable<TSelect>
	{

		if(selector.length>1)
			return super.select(selector);

		return new WhereSelectEnumerable<T, TSelect>(
			this.prevSource,
			this.prevPredicate,
			selector
		);
	}

	getEnumerator():IEnumerator<T>
	{
		var predicate = this.prevPredicate;
		var source = this.prevSource;
		var enumerator:IEnumerator<T>;

		return new EnumeratorBase<T>(
			() => { enumerator = source.getEnumerator(); },
				yielder =>
			{
				while(enumerator.moveNext()) {
					if(predicate(enumerator.current))
						return yielder.yieldReturn(enumerator.current);
				}

				return false;
			},
			() => { DisposeUtility.dispose(enumerator); }
		);
	}

	protected _onDispose():void
	{
		super._onDispose();
		this.prevPredicate = null;
		this.prevSource = null;
	}
}

export = WhereEnumerable;