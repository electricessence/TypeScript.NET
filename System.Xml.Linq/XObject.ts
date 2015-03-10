///<reference path="../build/System.d.ts"/>
///<reference path="../build/System.Xml.d.ts"/>
///<reference path="../build/System.Linq.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Documentation: https://msdn.microsoft.com/en-us/library/system.xml.xmlnodetype%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

import IXmlLineInfo = System.Xml.IXmlLineInfo;
import XmlNodeType = System.Xml.XmlNodeType;
import EventDispatcher = System.EventDispatcher;

import Enumerable = System.Linq.Enumerable;

module System.Xml.Linq
{


	export class XObject
		extends System.EventDispatcher
		implements System.Xml.IXmlLineInfo
	{
		public static EVENT_CHANGED = "changed";
		public static EVENT_CHANGING = "changing";

		private _annotationsArray: IAnnotation[];
		private _annotationsEnumerable: Enumerable<IAnnotation>;

		constructor()
		{
			super();
			var a = this._annotationsArray = [];
			this._annotationsEnumerable = Enumerable.from<IAnnotation>(a);
		}
	

		get lineNumber(): number  // int
		{

		}

		get linePosition(): number  // int
		{

		} // int

		hasLineInfo(): boolean
		{

		}

		get baseUri(): string
		{
		}

		get nodeType(): XmlNodeType
		{
		}

		get document(): XDocument
		{
			var current:XElement = this;

			while (current)
			{
				if (current.nodeType === XmlNodeType.Document)
				{
					return current;
				}

				current = current.parent;
			}

			return null;
		}

		get parent(): XElement
		{
		}

		removeAnnotations(type?:any):void
		{
			var a = this._annotationsArray;
			if (!type) a.length = 0;
			else
			{
				var i: number = 0 | 0;
				for (var i = a.length - 1; i >= 0; i--)
				{
					if (a[i].Type === type)
					{
						a.splice(i, 1);
					}
				}
			}
		}

		addAnnotation(type: any, object?: any):void
		{
			if (!object)
				object = {}

			this._annotationsArray.push({
				Type: type,
				Object: object
			});
		}

		annotation<T>(type: any): T
		{
			return this._annotationsEnumerable
				.where(a=> a.Type === type)
				.select(a=> a.Object)
				.firstOrDefault();
		}

		annotations<T>(type?: any):Enumerable<T>
		{
			var e = this._annotationsEnumerable;
			if (type)
				e = e.where(a=> a.Type === type);

			return e.select(a=> a.Object);
		}

		

	}
}