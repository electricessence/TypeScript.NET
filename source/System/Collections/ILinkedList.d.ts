/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="Enumeration/IEnumerable.d.ts"/>
///<reference path="Enumeration/IEnumerator.d.ts"/>
///<reference path="Enumeration/IEnumerateEach.d.ts"/>
///<reference path="ICollection.d.ts"/>
///<reference path="ILinkedListNode.d.ts"/>


interface ILinkedList<T>
extends ICollection<T>, IEnumerateEach<T>
{

	toArray():T[];

	first:ILinkedListNode<T>;
	last:ILinkedListNode<T>;

	getValueAt(index:number):T;
	getNodeAt(index:number):ILinkedListNode<T>;
	find(entry:T):ILinkedListNode<T>;
	findLast(entry:T):ILinkedListNode<T>;
	addFirst(entry:T):void;
	addLast(entry:T):void;
	removeFirst():void;
	removeLast():void;
	removeNode(node:ILinkedListNode<T>):boolean;
	addAfter(node:ILinkedListNode<T>, entry:T):void;
	addNodeBefore(node:ILinkedListNode<T>, before:ILinkedListNode<T>):void;
	addNodeAfter(node:ILinkedListNode<T>, after:ILinkedListNode<T>):void;

}
