///<reference path="../System.ts"/>
///<reference path="../Text/Text.ts"/>

/*
* @author electricessence / https://github.com/electricessence/
* Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
* Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
*/

module System.Collections
{
	export interface ILinkedListNode<T>
	{
		list: System.Collections.LinkedList<T>;

		previous: ILinkedListNode<T>;
		next: ILinkedListNode<T>;
		value: T;
	}

	var INT_0: number = 0 | 0;
	var INT_1: number = 1 | 0;

	class Node<T>
	{
		constructor(
			public value: T,
			public prev: Node<T>,
			public next?: Node<T>) { }

		external: ILinkedListNode<T>;

	}

	export class LinkedList<T> implements ICollection<T>, IEnumerateEach<T>
	{
		constructor(source?: IEnumerable<T>);
		constructor(source?: IArray<T>);
		constructor(source:any)
		{
			// TODO
		}

		// #region Internals.
		private _first: Node<T>;
		private _last: Node<T>;
		private _count: number = INT_0;

		private _addFirst(entry: T): Node<T>
		{
			var _ = this, first = _._first;
			var next = new Node(entry, null, first);
			if (first)
				first.prev = next;
			else
				_._first = _._last = next;

			_._count = _._count + INT_1;

			return next;
		}

		private _addLast(entry: T): Node<T>
		{
			var _ = this, last = _._last;
			var next = new Node(entry, last);
			if (last)
				last.next = next;
			else
				_._first = _._last = next;

			_._count = _._count + INT_1;

			return next;
		}

		private _findFirst(entry: T): Node<T>
		{
			var equals = System.areEqual,
				next = this._first;
			while (next)
			{
				if (equals(entry, next.value))
					return next;
				next = next.next;
			}
			return null;
		}

		private _findLast(entry: T): Node<T>
		{
			var equals = System.areEqual,
				prev = this._last;
			while (prev)
			{
				if (equals(entry, prev.value))
					return prev;
				prev = prev.prev;
			}
			return null;
		}
		
		// #endregion


		// #region IEnumerateEach<T>
		forEach(action: System.Predicate<T>): void;
		forEach(action: System.Action<T>): void;
		forEach(action: (element: T, index?: number) => any): void
		{
			var next = this._first, index: number = INT_0;
			while (next && action(next.value, index++) !== false)
			{
				next = next.next;
			}
		}
		// #endregion

		// #region IEnumerable<T>
		getEnumerator(): IEnumerator<T>
		{
			var _ = this, current: Node<T>;
			return new EnumeratorBase<T>(
				() => { current = new Node(null, null, _._first); }, // Initialize anchor...
				yielder =>
					(current = current.next)
						? yielder.yieldReturn(current.value)
						: yielder.yieldBreak()
			);
		}
		// #endregion

		// #region ICollection<T>
		get count(): number
		{
			return this._count;
		}

		get isReadOnly(): boolean
		{
			return false;
		}

		add(entry: T): void
		{
			this._addLast(entry);
		}


		clear(): number
		{
			var _ = this;
			_._first = null;
			_._last = null;
			var count = _._count;
			_._count = 0;
			return count;
		}

		
		contains(entry: T): boolean
		{
			var found: boolean = false, equals = System.areEqual;
			this.forEach(e => !(found = equals(entry, e)));
			return found;
		}

		copyTo(array: T[], index: number = 0): void
		{
			this.forEach((entry, i) =>
			{
				array[index + i] = entry;
			});
		}

		removeOnce(entry: T): boolean
		{
			var _ = this;
			var node: Node<T> = _._findFirst(entry);
			if(node)
			{
				var prev = node.prev, next = node.next;
				if (prev) prev.next = next;
				else _._first = next;
				if (next) next.prev = prev;
				else _._last = prev;
			}

			return node!=null;

		}

		remove(entry: T): number
		{
			var _ = this, count:number = INT_0;
			while (_.removeOnce(entry))
			{
				++count;
			}
			return count;

		}
		// #endregion

		find(entry: T): ILinkedListNode<T>
		{
			var result = this._findFirst(entry);

			return result
				? new LinkedListNode<T>(this, result)
				: null;
		}

		findLast(entry: T): ILinkedListNode<T>
		{
			var result = this._findLast(entry);

			return result
				? new LinkedListNode<T>(this, result)
				: null;
		}

		addLast(entry: T): ILinkedListNode<T>
		{
			return new LinkedListNode<T>(this, this._addLast(entry));
		}

		addFirst(entry: T): ILinkedListNode<T>
		{
			return new LinkedListNode<T>(this, this._addFirst(entry));
		}

		removeFirst(): void
		{
			var _ = this, first = _._first;
			if (first)
			{
				var next = first.next;
				_._first = next;
				if (next)
					next.prev = null;
			}
		}

		removeLast(): void
		{
			var _ = this, last = _._last;
			if (last)
			{
				var prev = last.prev;
				_._last = prev;
				if(prev)
					prev.next = null;
			}
		}

		// Returns true if sucessful and false if not found (already removed).
		removeNode(node: ILinkedListNode<T>): boolean
		{
			if (!node)
				throw new Error("ArgumentNullException: 'node' cannot be null.");

			if (node.list != this)
				throw new Error("InvalidOperationException: provided node does not belong to this list.");

			var n: Node<T> = (<any>node)._node;
			if (!n)
				throw new Error("InvalidOperationException: provided node is not valid.");
			
			var prev = n.prev, next = n.next, a:boolean = false, b:boolean = false;


			if (prev) prev.next = next;
			else if (this._first == n) this._first = next;
			else a = true;

			if (next) next.prev = prev;
			else if (this._last == n) this._last = prev;
			else b = true;

			if (a !== b)
			{
				throw new Error(System.Text.format(
					"Exception: provided node is has no {0} reference but is not the {1} node!", a ? "previous" : "next", a ? "first" : "last"));
			}

			return !a && !b;

		}

		// TODO:
		// addAfter(node, node)
		// addAfter(node,T)
		// addBefore(node,node)
		// addBefore(node,T)
		//

	}

	// Use an internal node class to prevent mucking up the LinkedList.
	class LinkedListNode<T> //implements ILinkedListNode<T>
	{
		constructor(
			private _list: System.Collections.LinkedList<T>,
			private _node: Node<T>)
		{
		}

		get list(): LinkedList<T>
		{
			return this._list;
		}

		get previous(): ILinkedListNode<T>
		{
			var external: ILinkedListNode<T> = null;
			var prev: Node<T> = this._node.prev;
			if (prev && !(external = prev.external))
				prev.external = external = new LinkedListNode<T>(this._list, prev);

			return external;
		}
		get next(): ILinkedListNode<T>
		{
			var external: ILinkedListNode<T> = null;
			var next: Node<T> = this._node.next;
			if (next && !(external = next.external))
				next.external = external = new LinkedListNode<T>(this._list, next);

			return external;
		}
		get value(): T
		{
			return this._node.value;
		}
		set value(v: T)
		{
			this._node.value = v;
		}

	}



} 