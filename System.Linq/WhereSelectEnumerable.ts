///<reference path="../build/System.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Linq {


	export class WhereSelectEnumerable<T, TSelect> extends Enumerable<TSelect> {
		constructor(
			private prevSource: System.Collections.IEnumerable<T>,
			private prevPredicate: (value: T, index?: number) => boolean,  // predicate.length always <= 1
			private prevSelector: (value: T, index?: number) => TSelect // selector.length always <= 1
			) {
			super(null);
		}

		where(predicate: (value: TSelect, index?: number) => boolean): Enumerable<TSelect> {
			if (predicate.length > 1)
				return super.where(predicate);
			
			return new WhereEnumerable<TSelect>(this, predicate);
		}

		select<TResult>(selector: (value: TSelect, index?: number) => TResult): Enumerable<TResult> {

			if (selector.length > 1)
				// if selector use index, can't compose
				return super.select(selector);

			var prevSelector = this.prevSelector;
			var composedSelector = x => selector(prevSelector(x));
			return new WhereSelectEnumerable(this.prevSource, this.prevPredicate, composedSelector);
		}

		getEnumerator(): System.Collections.IEnumerator<TSelect> {
			var predicate = this.prevPredicate;
			var selector = this.prevSelector;
			var source = this.prevSource;
			var enumerator;

			return new System.Collections.EnumeratorBase<TSelect>(
				() => { enumerator = source.getEnumerator(); },
				yielder => {
					while (enumerator.moveNext()) {
						if (predicate == null || predicate(enumerator.current)) {
							return yielder.yieldReturn(selector(enumerator.current));
						}
					}
					return false;
				},
				() => enumerator.dispose()
				);
		}

		_onDispose(): void {
			super._onDispose();
			this.prevPredicate = null;
			this.prevSource = null;
			this.prevSelector = null;
		}
	}
}