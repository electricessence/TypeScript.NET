///<reference path="../build/System.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Linq {

	export class OrderedEnumerable<T> extends Enumerable<T>
	{

		constructor(public source, public keySelector, public descending, public parent) {
			super(null);
		}

		create(keySelector, descending) {
			return new OrderedEnumerable(this.source, keySelector, descending, this);
		}

		thenBy(keySelector) {
			return this.create(keySelector, false);
		}
		thenByDescending(keySelector) {
			return this.create(keySelector, true);
		}
		getEnumerator():System.Collections.EnumeratorBase<T> {
			var self = this;
			var buffer;
			var indexes;
			var index = 0;

			return new System.Collections.EnumeratorBase<T>(
				() => {
					buffer = [];
					indexes = [];
					self.source.forEach(function (item, index) {
						buffer.push(item);
						indexes.push(index);
					});
					var sortContext = SortContext.create(self, null);
					sortContext.GenerateKeys(buffer);

					indexes.sort(function (a, b) { return sortContext.compare(a, b); });
				},
				yielder => {
					return (index < indexes.length)
						? yielder.yieldReturn(buffer[indexes[index++]])
						: false;
				},
				Functions.Blank
				);
		}
	}

	class SortContext {

		keys;

		constructor(
			public keySelector,
			public descending,
			public child) {
			this.keys = null;
		}

		static create(orderedEnumerable, currentContext) {
			var context = new SortContext(orderedEnumerable.keySelector, orderedEnumerable.descending, currentContext);
			if (orderedEnumerable.parent != null) return SortContext.create(orderedEnumerable.parent, context);
			return context;
		}

		generateKeys(source) {
			var len = source.length;
			var keySelector = this.keySelector;
			var keys = new Array(len);
			for (var i = 0; i < len; i++) keys[i] = keySelector(source[i]);
			this.keys = keys;

			if (this.child != null) this.child.GenerateKeys(source);
		}

		compare(index1, index2) {
			var comparison = System.compare(this.keys[index1], this.keys[index2]);

			if (comparison == 0) {
				if (this.child != null) return this.child.compare(index1, index2);
				return System.compare(index1, index2);
			}

			return (this.descending) ? -comparison : comparison;
		}
	}

} 