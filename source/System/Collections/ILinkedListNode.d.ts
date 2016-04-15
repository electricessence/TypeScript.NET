/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="ILinkedList.d.ts"/>


interface ILinkedNode<TNode extends ILinkedNode<any>>
{
	previous?:TNode;
	next?:TNode;
}

interface INodeWithValue<TValue>
{
	value:TValue;
}

interface ILinkedNodeWithValue<T>
extends ILinkedNode<ILinkedListNode<T>>, INodeWithValue<T> {

}

// Use an interface in order to prevent external construction of LinkedListNode
interface ILinkedListNode<T>
extends ILinkedNodeWithValue<T>
{
	previous:ILinkedListNode<T>;
	next:ILinkedListNode<T>;

	list: ILinkedList<T>;

	addBefore(entry:T): void;
	addAfter(entry:T): void;

	remove(): void;

	addNodeBefore(before:ILinkedListNode<T>): void;
	addNodeAfter(after:ILinkedListNode<T>): void;

}
