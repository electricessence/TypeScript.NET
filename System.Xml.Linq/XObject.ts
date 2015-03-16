///<reference path="../build/System.d.ts"/>
///<reference path="../build/System.Xml.d.ts"/>
///<reference path="../build/System.Linq.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Documentation: https://msdn.microsoft.com/en-us/library/system.xml.linq.xobject(v=vs.110).aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Xml.Linq
{
	import IXmlLineInfo = System.Xml.IXmlLineInfo;
	import XmlNodeType = System.Xml.XmlNodeType;

	import Enumerable = System.Linq.Enumerable;

	import isNullOrUndefined = System.isNullOrUndefined;

	var EMPTY: string = "";

	class BaseUriAnnotation
	{
		baseUri: string;

		constructor(baseUri: string)
		{
			this.baseUri = baseUri;
		}
	}


	/// <summary>
	/// Instance of this class is used as an annotation on any node
	/// for which we want to store its line information.
	/// Note: on XElement nodes this annotation stores the line info
	///   for the element start tag. The matching end tag line info
	///   if present is stored using the LineInfoEndElementAnnotation
	///   instance annotation.
	/// </summary>
	class LineInfoAnnotation
	{
		constructor(public lineNumber: number, public linePosition: number)
		{

		}
	}

	/// <summary>
	/// Instance of this class is used as an annotation on XElement nodes
	/// if that element is not empty element and we want to store the line info
	/// for its end element tag.
	/// </summary>
	class LineInfoEndElementAnnotation extends LineInfoAnnotation
	{
		constructor(lineNumber: number, linePosition: number)
		{
			super(lineNumber, linePosition);
		}
	}



	var CHANGED = "changed";
	var CHANGING = "changing";

	class XObjectChangeAnnotation extends System.EventDispatcher
	{
		//EventHandler<XObjectChangeEventArgs>;
		changing(sender: any, e: XObjectChangeEventArgs): void
		{
			this._dispatchEventWithArgs(CHANGING, sender, e);
		}
		//EventHandler<XObjectChangeEventArgs>;
		changed(sender: any, e: XObjectChangeEventArgs): void
		{
			this._dispatchEventWithArgs(CHANGED, sender, e);
		}

		constructor()
		{
			super();

		}
	}


	export class XObject
		// extends System.EventDispatcher // Not necessary since events are piped through annotations.
		extends System.DisposableBase // Is necessary to cleanup references..
		implements System.Xml.IXmlLineInfo
	{

		constructor()
		{
			super();
		}

		private _annotations: any;

		protected _firstAnnotationAncestry<T>(aType: any): T
		{
			var o: XObject = this;
			while (o != null)
			{
				var a = o.annotation<T>(aType);
				if (a) return a;
				o = o._parent;
			}
			return null;
		}

		protected _annotationAncestryApply<T>(aType: any, apply: (a: T) => void): boolean
		{
			// Walk upward through the tree and apply to each annotation of specified type.
			var applied: boolean = false;
			var o: XObject = this;
			while (o != null)
			{
				var a = o.annotation<T>(aType);
				if (a)
				{
					apply(a);
					applied = true;
				}
				o = o._parent;
			}
			return applied;
		}


		/// <summary>
		/// Get the BaseUri for this <see cref="XObject"/>.
		/// </summary>
		get baseUri(): string
		{
			var a = this._firstAnnotationAncestry<BaseUriAnnotation>(BaseUriAnnotation);
			return a ? a.baseUri : EMPTY;
		}


		get document(): XDocument
		{
			var n: XObject = this;
			while (n.parent != null) n = <any>n.parent;

			return n && n.nodeType === XmlNodeType.Document ? <XDocument>n : null;
		}

		getNodeType(): XmlNodeType
		{
			return XmlNodeType.None;
		}

		get nodeType(): XmlNodeType
		{
			return this.getNodeType();
		}



		// See line 1060 of System.Xml.Linq/XLinq.cs
		/// <summary>
		/// Adds an object to the annotation list of this <see cref="XObject"/>.
		/// </summary>
		/// <param name="annotation">The annotation to add.</param>
		addAnnotation(annotation: any): void
		{
			if (isNullOrUndefined(annotation))
				throw 'ArgumentNullException("annotation")';

			// Herein lies a method of memory optimization.
			// _annotations is not initialized unless used. 
			// And arrays are not used unless needed.

			var a: any = this._annotations;
			if (isNullOrUndefined(a))
			{
				// Not initialized yet?
				this._annotations =
				annotation instanceof Array
					? [annotation] // Create a wrapping array to ensure the outer collection isn't confused.
					: annotation; // Not an array?  Ok go ahead with a single value.
			}
			else
			{
				if (a instanceof Array)
					a.push(annotation);
				else
					this._annotations = [a, annotation];
			}
		}

		// See lines 1092 and 1142 of System.Xml.Linq/XLinq.cs
		/// <summary>
		/// Returns the first annotation object of the specified type from the list of annotations
		/// of this <see cref="XObject"/>.
		/// </summary>
		/// <param name="type">The type of the annotation to retrieve.</param>
		/// <returns>
		/// The first matching annotation object, or null
		/// if no annotation is the specified type.
		/// </returns>
		annotation<T>(type: any): T
		{
			if (!type) throw 'new ArgumentNullException("type")';
			var a: any = this._annotations;
			if (!isNullOrUndefined(a))
			{
				if (a instanceof Array)
				{
					for (var i = 0; i < a.Length; i++)
					{
						var obj = a[i];
						if (obj instanceof type) return obj;
					}
				}
				else
				{
					if (a instanceof type) return a;
				}

			}
			return null;
		}

		/// <summary>
		/// Returns an enumerable collection of annotations of the specified type
		/// for this <see cref="XObject"/>.
		/// </summary>
		/// <param name="type">The type of the annotations to retrieve.</param>
		/// <returns>An enumerable collection of annotations for this XObject.</returns>
		annotations<T>(type: any): Enumerable<T>
		{
			if (!type) throw 'new ArgumentNullException("type")';
			return this.annotationsIterator<T>(type);
		}

		private annotationsIterator<T>(type: any): Enumerable<T>
		{
			var _ = this;
			return Enumerable.from<any>(
				() =>
				{
					// Stay Lazy, stay consistent.
					var a = _._annotations;
					if (!a) return [];
					// A choice is made here to optimize for robustness versus memory.
					return a instanceof Array ? a.slice(0) : [a];
				})
				.where(a=> a instanceof type);
		}



		removeAnnotations(type: any): number
		{
			if (!type) throw 'new ArgumentNullException("type")';
			var a = this._annotations;

			if (a instanceof Array)
			{
				var count: number = 0 | 0;
				var a2: any = [];

				// splicing can be slow, so better to iterate and regenerate a new array.
				for (var i = 0; i < a.length; i++)
				{
					var r = a[i];
					if (r instanceof type)
						count++;
					else
						a2.push(r);
				}

				if (count) // Values changed?
					this._annotations = a2;
				else
					a = a2; // No? Swap.

				// Erase unused:
				a.length = 0;

				if (!this._annotations.length)
					this._annotations = null;

				return count;
			}
			else
			{
				if (a instanceof type)
				{
					this._annotations = null;
					return 1;
				}
			}

			return 0;
		}

		hasLineInfo(): boolean
		{
			return this.annotation<LineInfoAnnotation>(LineInfoAnnotation) != null;
		}

		get lineNumber(): number  // int
		{
			var a = this.annotation<LineInfoAnnotation>(LineInfoAnnotation);
			return a ? a.lineNumber : 0;
		}

		get linePosition(): number  // int
		{
			var a = this.annotation<LineInfoAnnotation>(LineInfoAnnotation);
			return a ? a.linePosition : 0;
		}


		get _hasBaseUri(): boolean
		{
			return this.annotation<BaseUriAnnotation>(BaseUriAnnotation) != null;
		}

		// Internal
		_parent: XContainer;
		get parent(): XElement
		{
			return System.instanceAsType<XElement>(this._parent, XElement);
		}


		_setBaseUri(baseUri: string): void
		{
			this.addAnnotation(new BaseUriAnnotation(baseUri));
		}

		_setLineInfo(lineNumber: number, linePosition: number): void
		{
			this.addAnnotation(new LineInfoAnnotation(lineNumber, linePosition));
		}

		// If there are no change listeners in the ancestry tree, then skipping is allowed.
		_skipNotify(): boolean
		{
			return this._firstAnnotationAncestry<XObjectChangeAnnotation>(XObjectChangeAnnotation)
				? false
				: true;
		}


		// Handles bubbling of events all the way up...
		_notifyChanging(sender: any, e: XObjectChangeEventArgs): boolean
		{
			return this._annotationAncestryApply<XObjectChangeAnnotation>(
				XObjectChangeAnnotation,
				(a: XObjectChangeAnnotation)
					=> a.changing(sender, e));
		}

		// Handles bubbling of events all the way up...
		_notifyChanged(sender: any, e: XObjectChangeEventArgs): boolean
		{
			return this._annotationAncestryApply<XObjectChangeAnnotation>(
				XObjectChangeAnnotation,
				(a: XObjectChangeAnnotation)
					=> a.changed(sender, e));
		}

		// Handles bubbling of events all the way up...
		_notifyChange(sender: any, e: XObjectChangeEventArgs, closure:()=>void): void
		{
			var _ = this;
			var notify: boolean = _._notifyChanging(sender, e);
			closure();
			if (notify) _._notifyChanged(sender, e);
		}


		// Piping the events to the annotations is a means of bubbling.
		private _changing: EventHelper;
		get changing(): EventHelper
		{
			var _ = this, e = _._changing;
			if (!e)
			{
				_._changing = e = new EventHelper(
					CHANGING,
					(listener: EventListener) =>
					{
						if (!listener) return;
						var a: XObjectChangeAnnotation = _.annotation<XObjectChangeAnnotation>(XObjectChangeAnnotation);
						if (!a) _.addAnnotation(a = new XObjectChangeAnnotation());
						a.addEventListener(CHANGING, listener);
					},
					(listener: EventListener) =>
					{
						if (!listener) return;
						var a: XObjectChangeAnnotation = _.annotation<XObjectChangeAnnotation>(XObjectChangeAnnotation);
						if (a) a.removeEventListener(CHANGING, listener);
					});
			}
			return e;
		}


		// Piping the events to the annotations is a means of bubbling.
		private _changed: EventHelper;
		get changed(): EventHelper
		{
			var _ = this, e = _._changed;
			if (!e)
			{
				_._changed = e = new EventHelper(
					CHANGED,
					(listener: EventListener) =>
					{
						if (!listener) return;
						var a: XObjectChangeAnnotation = _.annotation<XObjectChangeAnnotation>(XObjectChangeAnnotation);
						if (!a) _.addAnnotation(a = new XObjectChangeAnnotation());
						a.addEventListener(CHANGED, listener);
					},
					(listener: EventListener) =>
					{
						if (!listener) return;
						var a: XObjectChangeAnnotation = _.annotation<XObjectChangeAnnotation>(XObjectChangeAnnotation);
						if (a) a.removeEventListener(CHANGED, listener);
					});
			}
			return e;
		}
		

		protected _onDispose(): void
		{
			var _ = this;

			System.dispose(_._changing, _._changed);
			_._changing = _._changed = null;
			
			System.disposeDeep(_._annotations);
			_._annotations = null;

			_._parent = null;

		}

		//  /// <summary>
		//	/// Walks the tree starting with "this" node and returns first annotation of type <see cref="SaveOptions"/>
		//	///   found in the ancestors.
		//	/// </summary>
		//	/// <returns>The effective <see cref="SaveOptions"/> for this <see cref="XObject"/></returns>
		//	/*internal*/ SaveOptions GetSaveOptionsFromAnnotations()
		//{
		//		var o: XObject = this;
		//		while (true)
		//		{
		//			while (o != null && o.annotations == null)
		//			{
		//				o = o.parent;
		//			}
		//			if (o == null)
		//			{
		//				return SaveOptions.None;
		//			}
		//			var saveOptions: object = o.Annotation(typeof (SaveOptions));
		//			if (saveOptions != null)
		//			{
		//				return <SaveOptions>saveOptions;
		//			}
		//			o = o.parent;
		//		}
		//	}

	}
}

