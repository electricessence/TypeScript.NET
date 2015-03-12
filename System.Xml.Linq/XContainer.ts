///<reference path="../build/System.d.ts"/>
///<reference path="../build/System.Linq.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */


module System.Xml.Linq
{
	import LinkedList = System.Collections.LinkedList;

	// Abstract class for maintaining child nodes and content.
	export class XContainer extends XNode
	{
		_content:any;

		// Is supposed to be internal.
		constructor(other?:XContainer)
		{
			super();
			var _ = this;
			if(other)
			{
				var content = other._content;
				if(content!=null)
				{
					if(Types.isString(content))
						_._content = content;
					else
					{
						var n = content;
						do
						{
							n = n.next;
							_._appendNodeSkipNotify(n.CloneNode());
						} while(n!=content);
					}
				}
			}

		}


		/// <summary>
		/// Get the first child node of this node.
		/// </summary>
		get firstNode():XNode
		{
			var last = this.lastNode;
			return last!=null ? last._next : null;
		}


		/// <summary>
		/// Get the last child node of this node.
		/// </summary>
		get lastNode():XNode
		{
			var content = this._content;
			if(!content) return null; // Includes "", 0, null, undefined.

			if(Types.isString(content))
			{
				var t = new XText(content);
				t._parent = this;
				t._next = t; // Loop it.
				content = t;
			}

			return content;
		}

		nodes():Enumerable<XNode>
		{
			var _ = this, n = _.lastNode;
			if(!n) return Enumerable.empty<XNode>();

			return new Enumerable<XNode>(
				()=>
				{
					var started:boolean;
					return new EnumeratorBase<XNode>(
						()=> {
							started = true;
						},
						yielder=>
						{
							n = n._next;

							if(started) {
								if(n._parent!=_ || n==_._content)
									return yielder.yieldBreak();
							} else {
								started = true;
							}

							return yielder.yieldReturn(n);
						}
					)
				});
		}

		_appendNodeSkipNotify(n:XNode)
		{
			var _ = this, content = _._content;
			n._parent = _;
			if(content==null || Types.isString(content))
			{
				n._next = n;
			}
			else
			{
				var x:XNode = content;
				n._next = x._next;
				x._next = n;
			}
			_._content = n;
		}
	}
}