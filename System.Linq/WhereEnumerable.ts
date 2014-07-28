///<reference path="../build/System.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Linq {

	export class WhereEnumerable<T> extends Enumerable<T> {
		constructor(
			private prevSource:System.Collections.IEnumerable<T>,
			private prevPredicate: (value: T, index?: number) => boolean  // predicate.length always <= 1
			) {
			super(null);
		}

		where(predicate: (value: T, index?: number) => boolean): Enumerable<T> {

			if (predicate.length > 1)
				return super.where(predicate);

			var prevPredicate = this.prevPredicate;
			var composedPredicate = x => prevPredicate(x) && predicate(x);
			return new WhereEnumerable<T>(this.prevSource, composedPredicate);
		}

		select<TResult>(selector: (value: T, index?: number) => TResult): Enumerable<TResult> {

			if (selector.length > 1)
				return super.select<TResult>(selector);

			return new WhereSelectEnumerable(this.prevSource, this.prevPredicate, selector);
		}

		getEnumerator():System.Collections.IEnumerator<T> {
			var predicate = this.prevPredicate;
			var source = this.prevSource;
			var enumerator;

			return new System.Collections.EnumeratorBase<T>(
				() => { enumerator = source.getEnumerator(); },
				yielder => {
					while (enumerator.moveNext())
						if (predicate(enumerator.current))
							return yielder.yieldReturn(enumerator.current);

					return false;
				},
				() => enumerator.dispose()
				);
		}

		_onDispose(): void {
			super._onDispose();
			this.prevPredicate = null;
			this.prevSource = null;
		}
	}

 }