///<reference path="../build/System.d.ts"/>
///<reference path="../build/System.Linq.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Documentation: https://msdn.microsoft.com/en-us/library/system.xml.linq.xnode%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */


module System.Xml.Linq
{
	import IComparer = System.Collections.IComparer;
	import IEqualityComparer = System.Collections.IEqualityComparer;
	import Enumerable = System.Linq.Enumerable;

	class XNodeDocumentOrderComparer implements IComparer<XNode>
	{
		constructor()
		{

		}

		compare(x:XNode, y:XNode):number
		{
			return 0; // TODO
		}
	}

	class XNodeEqualityComparer implements IEqualityComparer<XNode>
	{
		constructor()
		{

		}

		equals(x:XNode, y:XNode):boolean
		{
			return false; // TODO
		}
	}

	function filterElementNodes(source:Enumerable<XNode>, xname?:any):Enumerable<XElement>
	{
		var a:Enumerable<any> = source.where(x=>x instanceof XElement);

		var xn:XName = XName.from(xname);
		// XName provided? filter results...
		return xn ? a.where(x=>x.name.equals(xn)) : a
	}


	export class XNode extends XObject
	{
		constructor()
		{
			super();
		}

		protected var blah: string;

		static get documentOrderComparer():IComparer<XNode>
		{
			return new XNodeDocumentOrderComparer();
		}

		static get equalityComparer():IEqualityComparer<XNode>
		{
			return new XNodeEqualityComparer();
		}

		get previousNode():XNode
		{
			var parent = this.parent;
			return parent ? parent.previousSiblingOf(this) : null;
		}

		get nextNode():XNode
		{
			var parent = this.parent;
			return parent ? parent.nextSiblingOf(this) : null;
		}

		ancestors(xname?:string):Enumerable<XElement>;
		ancestors(xname?:XName):Enumerable<XElement>;
		ancestors(xname?:any):Enumerable<XElement>
		{
			var _ = this, xn:XName = XName.from(xname);

			var a:Enumerable<XElement> = new Enumerable<XElement>(
				() =>
				{
					var current:XNode;
					return new EnumeratorBase<XElement>(
						() => { current = _; },
						yielder => (current = current.parent) && yielder.yieldReturn(<XElement>current)
					);
				});

			// XName provided? filter results...
			return xn ? a.where(x=>x.name.equals(xname)) : a;
		}

		addAfterSelf()
		{
			var indexOfSelf, args, contentToInsert, newContent, i, z;

			args = [];
			newContent = [];

			if(this.parent===null)
			{
				throw "addAfterSelf: no parent element";
			}
			indexOfSelf = this.parent.nodesArray.indexOf(this);
			if(indexOfSelf=== -1)
			{
				throw "Internal Error";
			}
			args = [];
			for(i = 0; i<arguments.length; i += 1)
			{
				args.push(arguments[i]);
			}
			contentToInsert = [];
			addContent(
				this,
				function (c) { contentToInsert.push(c); },
				function () { throw "addAfterSelf: invalid content"; },
				args);
			newContent = this.parent.nodesArray.slice(0, indexOfSelf + 1)
				.concat(contentToInsert)
				.concat(this.parent.nodesArray.slice(indexOfSelf + 1));
			for(z = 0; z<newContent.length; z += 1)
			{
				newContent[z].parent = this.parent;
			}
			this.parent.nodesArray = newContent;
		}

		addBeforeSelf()
		{
			var indexOfSelf, args, contentToInsert, newContent, i, z;

			args = [];
			contentToInsert = [];
			newContent = [];

			if(this.parent===null)
			{
				throw "addBeforeSelf: no parent element";
			}
			indexOfSelf = this.parent.nodesArray.indexOf(this);
			if(indexOfSelf=== -1)
			{
				throw "Internal Error";
			}
			args = [];
			for(i = 0; i<arguments.length; i += 1)
			{
				args.push(arguments[i]);
			}
			contentToInsert = [];
			addContent(
				this,
				function (c) { contentToInsert.push(c); },
				function () { throw "addBeforeSelf: invalid content"; },
				args);
			newContent = this.parent.nodesArray.slice(0, indexOfSelf)
				.concat(contentToInsert)
				.concat(this.parent.nodesArray.slice(indexOfSelf));
			for(z = 0; z<newContent.length; z += 1)
			{
				newContent[z].parent = this.parent;
			}
			this.parent.nodesArray = newContent;
		}

		compareDocumentOrder()
		{
			throw "Not implemented";
		}

		deepEquals(other)
		{
			var atts1, atts2, nodes1, nodes2;

			if(this.nodeType!==other.nodeType)
			{
				return false;
			}
			if(this.nodeType==='Element' && this.name!==other.name)
			{
				return false;
			}
			if(this.nodeType==='Comment' ||
				this.nodeType==='Text' ||
				this.nodeType==='CData' ||
				this.nodeType==='ProcessingInstruction' ||
				this.nodeType==='Entity')
			{
				return this.value===other.value;
			}
			if(this.attributesArray.length!==other.attributesArray.length)
			{
				return false;
			}

			if(this.attributesArray.length!==0)
			{
				atts1 = Enumerable
					.from(this.attributesArray)
					.where(
					function (a)
					{
						return !a.isNamespaceDeclaration;
					})
					.orderBy("k=>k.name");
				atts2 = Enumerable
					.from(other.attributesArray)
					.where(
					function (a)
					{
						return !a.isNamespaceDeclaration;
					})
					.orderBy("k=>k.name");
				// in following lambda, return true if any do NOT match
				if(atts1.zip(
						atts2, function (a, b)
						{
							return {
								att1: a,
								att2: b
							}
						})
						.any(
						function (p)
						{
							if(p.att1.name!==p.att2.name)
							{
								return true;
							}
							if(p.att1.value!==p.att2.value)
							{
								return true;
							}
							return false;
						}))
				{
					return false;
				}
			}
			if(this.nodesArray.length!==other.nodesArray.length)
			{
				return false;
			}
			if(this.nodesArray.length===0 && other.nodesArray.length===0)
			{
				return true;
			}
			nodes1 = Enumerable.from(this.nodesArray);
			nodes2 = Enumerable.from(other.nodesArray);
			if(nodes1
					.zip(
					nodes2, function (a, b)
					{
						return {
							node1: a,
							node2: b
						}
					})
					.any(function (z) { return !z.node1.deepEquals(z.node2); }))
			{
				return false;
			}
			return true;
		}

		isAfter()
		{
			throw "Not implemented";
		}

		isBefore()
		{
			throw "Not implemented";
		}

		remove()
		{
			if(!this.parent)
				throw "InvalidOperationException: The parent is null.";

			this.parent.removeChild(this);
		}

		//replaceWith(node:XNode);
		replaceWith(nodes:XNode[])
		{
			var _ = this, parent:any = _.parent;
			if(!parent)
				throw "InvalidOperationException: The parent is null.";

			//if(!nodes instanceof Array)
			//{
			//	nodes = new Array<XNode>(arguments.length);
			//	for (var i = 0; i < arguments.length; i++) {
			//		nodes[i] = arguments[i];
			//	}
			//}

			if(nodes && nodes.length)
			{
				var listNode:System.Collections.ILinkedListNode<XNode> = parent._nodes.find(_);

				if(listNode)
				{
					// Adding after in reverse order will ensure the right order without having to change references.
					for(var i = nodes.length - 1; i>=0; i--)
					{
						listNode.addAfter(nodes[i]);
					}
				}
			}


			// TODO: Possilbe efficiency improvments..
			_.remove();

		}



		nodesBeforeSelf():Enumerable<XNode>
		{
			var _ = this, parent:any = _.parent;
			if(!parent)
				throw "InvalidOperationException: The parent is null.";

			return new Enumerable<XNode>(
				() =>
				{

					var started:boolean;
					var current:System.Collections.ILinkedListNode<XNode>;
					// TODO: find a way to flag if the collection changed and invalidate the enumeration.
					// Probably a good way is to use the "CHANGED" event.

					return new EnumeratorBase<XNode>(
						() => {
							// Force internal access...
							started = false;
							if(!_.parent)
								throw "InvalidOperationException: The parent is null.";
							if(_.parent!=parent)
								throw "InvalidOperationException: The node has changed parents.";
							current = parent._nodes.first; // Avoid exposing the list.
						},
						yielder =>
						{
							if(!started)
								started = true;
							else if(current)
								current = current.next;

							return current && current.value!=_ && yielder.yieldReturn(current.value)
						}

					)
				});

		}


		nodesBeforeSelfInReverseDocumentOrder():Enumerable<XNode>
		{
			var _ = this, parent:any = _.parent;
			if(!parent)
				throw "InvalidOperationException: The parent is null.";

			return new Enumerable<XNode>(
				() =>
				{

					var current:System.Collections.ILinkedListNode<XNode>;
					// TODO: find a way to flag if the collection changed and invalidate the enumeration.
					// Probably a good way is to use the "CHANGED" event.

					return new EnumeratorBase<XNode>(
						() => {
							if(!_.parent)
								throw "InvalidOperationException: The parent is null.";
							if(_.parent!=parent)
								throw "InvalidOperationException: The node has changed parents.";
							// Force internal access...
							current = parent._nodes.find(_); // Avoid exposing the list.
						},
						yielder => (current = current.previous) && yielder.yieldReturn(current.value)
					);
				});
		}



		nodesAfterSelf():Enumerable<XNode>
		{
			var _ = this, parent:any = _.parent;
			if(!parent)
				throw "InvalidOperationException: The parent is null.";

			return new Enumerable<XNode>(
				() =>
				{

					var current:System.Collections.ILinkedListNode<XNode>;
					// TODO: find a way to flag if the collection changed and invalidate the enumeration.
					// Probably a good way is to use the "CHANGED" event.

					return new EnumeratorBase<XNode>(
						() => {
							if(!_.parent)
								throw "InvalidOperationException: The parent is null.";
							if(_.parent!=parent)
								throw "InvalidOperationException: The node has changed parents.";
							// Force internal access...
							current = parent._nodes.find(_); // Avoid exposing the list.
						},
						yielder => (current = current.next) && yielder.yieldReturn(current.value)
					);
				});
		}

		elementsBeforeSelfReverseDocumentOrder(xname?:string):Enumerable<XElement>;
		elementsBeforeSelfReverseDocumentOrder(xname?:XName):Enumerable<XElement>;
		elementsBeforeSelfReverseDocumentOrder(xname?:any):Enumerable<XElement>
		{
			return filterElementNodes(this.nodesBeforeSelfInReverseDocumentOrder(), xname);
		}

		elementsBeforeSelf(xname?:string):Enumerable<XElement>;
		elementsBeforeSelf(xname?:XName):Enumerable<XElement>;
		elementsBeforeSelf(xname?:any):Enumerable<XElement>
		{
			return filterElementNodes(this.nodesBeforeSelf(), xname);

		}

		elementsAfterSelf(xname?:string):Enumerable<XElement>;
		elementsAfterSelf(xname?:XName):Enumerable<XElement>;
		elementsAfterSelf(xname?:any):Enumerable<XElement>
		{
			return filterElementNodes(this.nodesAfterSelf(), xname);
		}

	}
}


