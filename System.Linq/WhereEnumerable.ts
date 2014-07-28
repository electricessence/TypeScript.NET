///<reference path="../build/System.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Linq {

	class WhereEnumerable<T> extends Enumerable<T> {
		constructor(public prevSource, public prevPredicate) {
			// predicate.length always <= 1
		}
		where(predicate) {
			predicate = Utils.createLambda(predicate);

			if (predicate.length <= 1) {
				var prevPredicate = this.prevPredicate;
				var composedPredicate = function (x) { return prevPredicate(x) && predicate(x); }
            return new WhereEnumerable(this.prevSource, composedPredicate);
			}
			else {
				// if predicate use index, can't compose
				return Enumerable.prototype.where.call(this, predicate);
			}
		}

		select(selector) {
			selector = Utils.createLambda(selector);

			return (selector.length <= 1)
				? new WhereSelectEnumerable(this.prevSource, this.prevPredicate, selector)
				: Enumerable.prototype.select.call(this, selector);
		}

		getEnumerator() {
			var predicate = this.prevPredicate;
			var source = this.prevSource;
			var enumerator;

			return new EnumeratorBase<T>(
				() => { enumerator = source.getEnumerator(); },
				() => {
					while (enumerator.moveNext()) {
						if (predicate(enumerator.current)) {
							return (<any>this).yieldReturn(enumerator.current);
						}
					}
					return false;
				},
				() => { Utils.dispose(enumerator); });
		}
	}

 }