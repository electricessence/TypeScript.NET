///<reference path="../build/System.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Linq {


	class WhereSelectEnumerable<T> extends Enumerable<T> {
		constructor(
			public source,
			public predicate, // predicate.length always <= 1 or null
			public selector // selector.length always <= 1
			) { }

		where(predicate) {
			predicate = Utils.createLambda(predicate);

			return (predicate.length <= 1)
				? new WhereEnumerable(this, predicate)
				: Enumerable.prototype.where.call(this, predicate);
		}

		select(selector) {
			selector = Utils.createLambda(selector);

			if (selector.length <= 1) {
				var prevSelector = this.prevSelector;
				var composedSelector = function (x) { return selector(prevSelector(x)); }
            return new WhereSelectEnumerable(this.prevSource, this.prevPredicate, composedSelector);
			}
			else {
				// if selector use index, can't compose
				return Enumerable.prototype.select.call(this, selector);
			}
		}

		getEnumerator = () => {
			var predicate = this.prevPredicate;
			var selector = this.prevSelector;
			var source = this.prevSource;
			var enumerator;

			return new EnumeratorBase<T>(
				() => { enumerator = source.getEnumerator(); },
				() => {
					while (enumerator.moveNext()) {
						if (predicate == null || predicate(enumerator.current)) {
							return (<any>this).yieldReturn(selector(enumerator.current));
						}
					}
					return false;
				},
				() => { Utils.dispose(enumerator); });
		}
	}
}