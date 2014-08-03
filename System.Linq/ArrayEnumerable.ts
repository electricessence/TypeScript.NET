///<reference path="../build/System.d.ts"/>
///<reference path="Enumerable.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Linq {

	export class ArrayEnumerable<T> extends Enumerable<T> {

		private _source: T[]

		constructor(source: T[]) {
			var _ = this;
			_._source = source;
			super(() => {
				_.assertIsNotDisposed();
				return new System.Collections.ArrayEnumerator<T>(() => {
					_.assertIsNotDisposed("The underlying ArrayEnumerable was disposed.");

					return _._source; // Could possibly be null, but ArrayEnumerable if not disposed simply treats null as empty array.
				});
			});
		}

		_onDispose(): void {
			super._onDispose
				this._source = null;
		}

		get source(): T[] { return this._source; }

		toArray(): T[] {
			return this.source ? this.source.slice() : [];
		}

		asEnumerable(): ArrayEnumerable<T> {
			return new ArrayEnumerable<T>(this._source);
		}

		// Optimize forEach so that subsequent usage is optimized.
		forEach(action: (element: T, index?: number) => boolean): void;
		forEach(action: (element: T, index?: number) => void): void;
		forEach(action: (element: T, index?: number) => any): void {

			var _ = this;
			_.assertIsNotDisposed();

			var source = _._source;
			if (source) {

				// Return value of action can be anything, but if it is (===) false then the forEach will discontinue.
				for (var i = 0; i < source.length; ++i) {
					// _.assertIsNotDisposed(); // Assertion here is unncessary since we already have a reference to the source array.
					if (action(source[i], i) === false)
						break;
				}
			}
		}

		// These methods should ALWAYS check for array length before attempting anything.

		any(predicate?: (value: T, index?: number) => boolean): boolean {
			var _ = this;
			_.assertIsNotDisposed();

			var source:T[] = _._source, len: number = source ? source.length : 0;
			return len && (!predicate || super.any(predicate));
		}

		count(predicate?: (value: T, index?: number) => boolean): number {
			var _ = this;
			_.assertIsNotDisposed();

			var source: T[] = _._source, len: number = source ? source.length : 0;
			return len && (predicate ? super.count(predicate) : len);
		}

		elementAt(index: number): T {
			var _ = this;
			_.assertIsNotDisposed();

			var source: T[] = this._source;
			return (index < source.length && index >= 0)
				? source[index]
				: super.elementAt(index);
		}

		elementAtOrDefault(index: number, defaultValue: T = null): T {
			var _ = this;
			_.assertIsNotDisposed();

			var source: T[] = this._source;
			return (index < source.length && index >= 0)
				? source[index]
				: defaultValue;
		}

		first(predicate?: (value: T, index?: number) => boolean): T {
			var _ = this;
			_.assertIsNotDisposed();

			var source:T[] = this._source;
			return (source && source.length && !predicate)
				? source[0]
				: super.first(predicate);
		}

		firstOrDefault(predicate: (value: T, index?: number) => boolean, defaultValue: T= null): T {
			var _ = this;
			_.assertIsNotDisposed();

			var source: T[] = this._source;
			return (source && source.length)
				? (predicate ? super.firstOrDefault(predicate, defaultValue) : source[0])
				: defaultValue;
		}

		last(predicate?: (value: T, index?: number) => boolean): T {
			var _ = this;
			_.assertIsNotDisposed();

			var source: T[] = this._source, len: number = source.length;
			return (len && !predicate)
				? source[len - 1]
				: super.last(predicate);
		}

		lastOrDefault(predicate: (value: T, index?: number) => boolean, defaultValue: T= null): T {
			var _ = this;
			_.assertIsNotDisposed();

			var source: T[] = this._source, len: number = source.length;
			return len
				? (predicate ? super.firstOrDefault(predicate, defaultValue) : source[len - 1])
				: defaultValue;
		}

		skip(count: number): Enumerable<T> {

			var _ = this;

			return (!count || count < 0) // Out of bounds? Simply return a unfiltered enumerable.
				? _.asEnumerable()
				: new Enumerable<T>(
					() => new System.Collections.ArrayEnumerator<T>(
						() => _._source, count));
		}

		takeExceptLast(count: number = 1): Enumerable<T> {
			var _ = this, len = _._source ? _._source.length : 0;
			return _.take(len - count);
		}

		takeFromLast(count: number): Enumerable<T> {
			var _ = this, len = _._source ? _._source.length : 0;
			return _.skip(len - count);
		}

		reverse():Enumerable<T> {
			var _ = this;

			return new Enumerable<T>(
				() => new System.Collections.ArrayEnumerator<T>(
					() => _._source, _._source ? (_._source.length - 1) : 0, -1));
		}

		memoize(): ArrayEnumerable<T> {
			return new ArrayEnumerable<T>(this._source);
		}

		/*sequenceEqual(second, compareSelector) {
			if ((second instanceof ArrayEnumerable || second instanceof Array)
				&& compareSelector == null
				&& Enumerable.from(second).count() != this.count()) {
				return false;
			}

			return Enumerable.prototype.sequenceEqual.apply(this, arguments);
		}

		toJoinedString(separator, selector) {
			var source = this._source;
			if (selector != null || !(source instanceof Array)) {
				return Enumerable.prototype.toJoinedString.apply(this, arguments);
			}

			if (separator == null) separator = "";
			return source.join(separator);
		}*/

	}
}