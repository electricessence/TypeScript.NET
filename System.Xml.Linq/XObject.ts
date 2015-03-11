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

		private _lineNumber:number;
		protected _setLineNumber(lineNumber:number):void{
			this._lineNumber = lineNumber;
		}

		get lineNumber(): number  // int
		{
			return this._lineNumber;
		}

		private _linePosition:number;
		protected _setLinePosition(linePosition:number):void{
			this._linePosition = linePosition;
		}

		get linePosition(): number  // int
		{
			return this._linePosition;
		}

		hasLineInfo(): boolean
		{
			return !isNaN(this._lineNumber) && !isNaN(this._linePosition);
		}

		private _baseUri:string;
		protected _setBaseUri(baseUri:string):void{
			this._baseUri = baseUri;
		}

		get baseUri(): string
		{
			return this._baseUri;
		}

		private _nodeType:XmlNodeType;
		protected _setNodeType(nodeType:XmlNodeType):void{
			this._nodeType = nodeType;
		}

		get nodeType(): XmlNodeType
		{
			return this._nodeType;
		}

		get document(): XDocument
		{
			var current:XObject = this;

			while (current)
			{
				if (current.nodeType === XmlNodeType.Document)
				{
					if( !(current instanceof XDocument) )
					{
						console.warn("Document node is not of type XDocument");
					}
					return <XDocument>current;
				}

				current = current.parent;
			}

			return null;
		}


		private _parent:XElement;
		protected _setParent(parent:XElement):void{
			this._parent = parent;
		}

		get parent(): XElement
		{
			return this._parent;
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