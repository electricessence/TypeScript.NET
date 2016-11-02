/*!
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {ICollection} from "./ICollection";
import {ILinkedListNode, ILinkedNode} from "./ILinkedListNode";
import {IEnumerateEach} from "./Enumeration/IEnumerateEach";

export interface ILinkedNodeList<TNode extends ILinkedNode<TNode>>
{
	first:TNode | null;
	last:TNode | null;

	getNodeAt(index:number):TNode | null;
	removeNode(node:TNode):boolean;
}

export interface ILinkedList<T>
extends ILinkedNodeList<ILinkedListNode<T>>,
	ICollection<T>,
	IEnumerateEach<T>
{
	first:ILinkedListNode<T> | null;
	last:ILinkedListNode<T> | null;

	getValueAt(index:number):T | undefined;
	find(entry:T):ILinkedListNode<T> | null;
	findLast(entry:T):ILinkedListNode<T> | null;
	addFirst(entry:T):void;
	addLast(entry:T):void;
	removeFirst():void;
	removeLast():void;
	addAfter(node:ILinkedListNode<T>, entry:T):void;

}

export default ILinkedList;