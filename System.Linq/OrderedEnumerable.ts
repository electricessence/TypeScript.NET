///<reference path="../build/System.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Linq {

	export class OrderedEnumerable<T> extends Enumerable<T>
	{

		constructor(
			private source:System.Collections.IEnumerable<T>,
			public keySelector:(value:T)=>any,
			public descending:boolean,
			public parent:OrderedEnumerable<T>) {
			super(null);
		}

		createOrderedEnumerable(keySelector:(value:T)=>any, descending:boolean):OrderedEnumerable<T> {
			return new OrderedEnumerable<T>(this.source, keySelector, descending, this);
		}

		thenBy(keySelector:(value:T)=>any): OrderedEnumerable<T> {
			return this.createOrderedEnumerable(keySelector, false);
		}
		thenByDescending(keySelector:(value:T)=>any): OrderedEnumerable<T> {
			return this.createOrderedEnumerable(keySelector, true);
		}
		getEnumerator():System.Collections.EnumeratorBase<T> {
			var _ = this;
			var buffer:T[];
			var indexes:number[];
			var index = 0;

			return new System.Collections.EnumeratorBase<T>(
				() => {
					buffer = [];
					indexes = [];
					Enumerable.forEach(_.source, (item, index) => {
						buffer.push(item);
						indexes.push(index);
					});
					var sortContext = SortContext.create(_);
					sortContext.generateKeys(buffer);

					indexes.sort((a, b) => sortContext.compare(a, b));
				},
				yielder => {
					return (index < indexes.length)
						? yielder.yieldReturn(buffer[indexes[index++]])
						: false;
				},
				() => {
					if (buffer)
						buffer.length = 0;
					buffer = null;
					if (indexes)
						indexes.length = 0;
					indexes = null;
				}
				);
		}
		_onDispose(): void {
			super._onDispose();
			this.source = null;
			this.keySelector = null;
			this.descending = null;
			this.parent = null;
		}
	}

	class SortContext<T,TOrderBy> {

		keys: TOrderBy[];

		constructor(
			public keySelector: (value: T) => TOrderBy,
			public descending:boolean,
			public child: SortContext<T, TOrderBy>) {
			this.keys = null;
		}

		static create<T, TOrderBy>(orderedEnumerable: OrderedEnumerable<T>, currentContext: SortContext<T, TOrderBy> = null): SortContext<T, TOrderBy> {
			var context: SortContext<T, TOrderBy> = new SortContext<T, TOrderBy>(orderedEnumerable.keySelector, orderedEnumerable.descending, currentContext);
			if (orderedEnumerable.parent)
				return SortContext.create(orderedEnumerable.parent, context);
			return context;
		}

		generateKeys(source:T[]): void {
			var _ = this;
			var len = source.length;
			var keySelector: (value: T) => TOrderBy = _.keySelector;
			var keys = new Array<TOrderBy>(len);
			for (var i = 0; i < len; ++i)
				keys[i] = keySelector(source[i]);
			_.keys = keys;

			if (_.child)
				_.child.generateKeys(source);
		}

		compare(index1:number, index2:number):number {
			var _ = this, keys = _.keys;
			var comparison = System.compare(keys[index1], keys[index2]);

			if (comparison == 0) {
				var child = _.child;
				return child
					? child.compare(index1, index2)
					: System.compare(index1, index2);
			}

			return _.descending ? -comparison : comparison;
		}
	}

} 