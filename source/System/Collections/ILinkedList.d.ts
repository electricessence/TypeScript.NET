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


interface ILinkedNodeList<TNode extends ILinkedNode<TNode>>
{
	first:TNode;
	last:TNode;

	getNodeAt(index:number):TNode;
	removeNode(node:TNode):boolean;
	addNodeBefore(node:TNode, before:TNode):void;
	addNodeAfter(node:TNode, after:TNode):void;

}

interface ILinkedList<T>
extends ILinkedNodeList<ILinkedListNode<T>>,
	ICollection<T>,
	IEnumerateEach<T>
{

	toArray():T[];

	first:ILinkedListNode<T>;
	last:ILinkedListNode<T>;

	getValueAt(index:number):T;
	find(entry:T):ILinkedListNode<T>;
	findLast(entry:T):ILinkedListNode<T>;
	addFirst(entry:T):void;
	addLast(entry:T):void;
	removeFirst():void;
	removeLast():void;
	addAfter(node:ILinkedListNode<T>, entry:T):void;

}
