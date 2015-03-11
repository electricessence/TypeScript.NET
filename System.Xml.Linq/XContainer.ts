///<reference path="../build/System.d.ts"/>
///<reference path="../build/System.Linq.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */


module System.Xml.Linq
{
	import LinkedList = System.Collections.LinkedList;

	export class XContainer extends XNode
	{
		constructor()
		{
			super();

			this._nodes = new LinkedList<XNode>();
		}

		private _nodes:LinkedList<XNode>;

		get firstNode():XNode {
			return this._nodes.firstValue;
		}

		get lastNode():XNode {
			return this._nodes.lastValue;
		}

		previousSiblingOf(node:XNode):XNode {
			var prev:XNode = null;
			var n = this._nodes.find(node);
			if(n) {
				var np = n.previous;
				if(np) prev = np.value;
			}
			else
				console.warn("Value not found in list.");
			return prev;
		}

		nextSiblingOf(node:XNode):XNode {
			var next:XNode = null;
			var n = this._nodes.find(node);
			if(n) {
				var nn = n.next;
				if(nn) next = nn.value;
			}
			else
				console.warn("Value not found in list.");
			return next;
		}

		removeChild(node:XNode):void {
			this._nodes.remove(node);
		}

		insertChildBefore(child:XNode, toInsert:XNode):void {
			var n = this._nodes.find(child);
			if(!n)
				console.warn("Value not found in list.");

			n.addBefore(toInsert);
		}

		insertChildAfter(child:XNode, toInsert:XNode):void {
			var n = this._nodes.find(child);
			if(!n)
				console.warn("Value not found in list.");

			n.addAfter(toInsert);
		}

	}
}