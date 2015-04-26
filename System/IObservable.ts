/*
* @author electricessence / https://github.com/electricessence/
* Based upon .NET source.
* Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
*/

module System
{

	import LinkedList = System.Collections.LinkedList;

	// http://referencesource.microsoft.com/#mscorlib/system/iobservable.cs
	// https://msdn.microsoft.com/en-us/library/dd990377.aspx
	export interface IObservable<T> // <out T>
	{
		subscribe(observer: IObserver<T>): IDisposable;
	}

	class Subscription<T> implements IDisposableAware
	{
		constructor(
			private _observable: ObservableBase<T>,
			public observer: IObserver<T>)
		{
			if (!_observable || !observer)
				throw 'Observable and observer cannot be null.';
		}

		/*
			In the case where we could possibly have the following happen:

			var u = observable.subscribe(observer);

			...

			u.dispose(); // Should only be allowed to unsubscribe once and then it's useless.

			// Resubscribing creates a new instance.
			var x = observable.subscribe(observer);

			u.dispose(); // Calling this again should do nothing and 'x' should still work.
		*/

		get wasDisposed(): boolean
		{
			return !this._observable || !this.observer;
		}

		dispose(): void
		{
			var observer = this.observer;
			var observable = this._observable;

			if (observer && observable)
			{
				// Release the references.  Will prevent potential unwanted recursion.
				this.observer = null;
				this._observable = null;

				observable.unsubscribe(observer);
			}
		}
	}


	// Can be used as a base class, mixin, or simply reference on how to implement the pattern.
	export class ObservableBase<T> implements IObservable<T>, IObserver<T>
	{

		private _subcribers: LinkedList<Subscription<T>> = new LinkedList<Subscription<T>>();

		private _findEntryNode(observer: IObserver<T>): System.Collections.ILinkedListNode<Subscription<T>>
		{
			var node = this._subcribers.first;
			while (node)
			{
				if (node.value.observer == observer)
				{
					break;
				}
				else
				{
					node = node.next;
				}
			}

			return node;
		}

		// It is possible that the same observer could call subscribe more than once and therefore we need to retain a single instance of the unsubsciber.
		subscribe(observer: IObserver<T>): IDisposable
		{
			var n = this._findEntryNode(observer);
			if (n) // Ensure only one instance of the existing subscription exists.
				return n.value;

			var s = new Subscription(this, observer);
			this._subcribers.add(s);

			return s;
		}

		unsubscribe(observer: IObserver<T>): void
		{
			var n = this._findEntryNode(observer);
			if (n)
			{
				var s = n.value;
				n.remove();
				s.dispose(); // Prevent further usage of a dead subscription.
			}
		}

		onNext(value: T): void
		{
			this._subcribers.forEach(s=> s.observer.onNext(value));
		}
        onError(error: Error): void
		{
			this._subcribers.forEach(s=> s.observer.onError(error));
		}

		// TODO: Probably better to scrap the list...
        onCompleted(): void
		{
			var node: System.Collections.ILinkedListNode<Subscription<T>>,
				prevNode: System.Collections.ILinkedListNode<Subscription<T>>;

			while (node = this._subcribers.first)
			{
				if (node == prevNode)
					throw 'Entry disposal not removing node from list.';
				var entry = node.value;
				var observer = entry.observer;
				entry.dispose(); // Should remove the node.

				prevNode = node;

				observer.onCompleted();
			}
		}
	}

}