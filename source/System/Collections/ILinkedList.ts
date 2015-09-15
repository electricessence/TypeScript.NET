/*
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */


///<reference path="Enumeration/IEnumerable.ts"/>
///<reference path="Enumeration/IEnumerator.ts"/>
///<reference path="Enumeration/IEnumerateEach.ts"/>
///<reference path="ICollection.ts"/>
///<reference path="ILinkedListNode.ts"/>


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