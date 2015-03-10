///<reference path="../build/System.d.ts"/>
///<reference path="../build/System.Xml.d.ts"/>
///<reference path="../build/System.Linq.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Xml.Linq
{

	"use strict";

	// #region Imports
	import Predicate = System.Predicate;
	import Selector = System.Selector;
	import Action = System.Action;

	import ArrayUtility = System.Collections.ArrayUtility;

	import IEnumerator = System.Collections.IEnumerator;
	import EnumeratorBase = System.Collections.EnumeratorBase;

	import IEnumerable = System.Collections.IEnumerable;
	import IArray = System.Collections.IArray;

	import IMap = System.Collections.IMap;
	import Dictionary = System.Collections.Dictionary;
	import Queue = System.Collections.Queue;

	import using = System.using;

	import enumeratorFrom = System.Collections.Enumerator.from;
	import enumeratorForEach = System.Collections.Enumerator.forEach;
	import Types = System.Types;

	import Enumerable = System.Linq.Enumerable;
	import XmlNodeType = System.Xml.XmlNodeType;

	// #endregion

	function mayHaveAncestor(e:any):boolean {
		switch(e.nodeType) {
			case XmlNodeType.Element:
			case XmlNodeType.Comment:
			case XmlNodeType.ProcessingInstruction:
			case XmlNodeType.Text:
			case XmlNodeType.CDATA:
			case XmlNodeType.Entity:
				return true;
			default:
				return false;
		}
	}


	export class XEnumerable<T> extends System.Linq.Enumerable<T> {

		protected source:Enumerable<T>;

		constructor(source:Enumerable<T>)
		{
			super(<any>source);
			this.source = source;
		}

		static asXEnumerable(source:Enumerable<T>):XEnumerable<T> {
			return new XEnumerable<T>(source);
		}

		ancestors(xname:string):Enumerable<XElement>;
		ancestors(xname:XName):Enumerable<XElement>;
		ancestors(xname:any):Enumerable<XElement>
		{

			var	xn:XName = XName.from(xname);
			var source:Enumerable<T> = this.source || this;
			return XEnumerable.asXEnumerable(
				source.selectMany(
					(e)=> mayHaveAncestor(e)
						? e.ancestors(xn)
						: Enumerable.empty<XElement>()
				));
		}

		ancestorsAndSelf(xname:string):Enumerable<XElement>;
		ancestorsAndSelf(xname:XName):Enumerable<XElement>;
		ancestorsAndSelf(xname:any):Enumerable<XElement>
		{

			var	xn:XName = XName.from(xname);
			var source:Enumerable<T> = this.source || this;
			return XEnumerable.asXEnumerable(
				source.selectMany(
				(e)=> e.nodeType === XmlNodeType.Element
					? e.ancestorsAndSelf(xn)
					: Enumerable.empty()
				));
		}

		attributes(xname:string):Enumerable<XAttribute>;
		attributes(xname:XName):Enumerable<XAttribute>;
		attributes(xname:any):Enumerable<XAttribute>
		{
			var	xn:XName = XName.from(xname);
			var source:Enumerable<T> = this.source || this;
			return XEnumerable.asXEnumerable(
				source.selectMany(
				(e)=> e.nodeType === XmlNodeType.Element
					? e.attributes(xn)
					: Enumerable.empty()
			));
		}





	descendantNodes():Enumerable<XNode> {
		var source:Enumerable<T> = this.source || this;
	return XEnumerable.asXEnumerable(source
		.selectMany(
		function (e) {
			if (e.nodeType &&
				(e.nodeType === 'Element' ||
				e.nodeType === 'Comment' ||
				e.nodeType === 'ProcessingInstruction' ||
				e.nodeType === 'Text' ||
				e.nodeType === 'CDATA' ||
				e.nodeType === 'Entity')) {
				return e.descendantNodes();
			}
			return Enumerable.empty();
		}));
	}

	descendantNodesAndSelf() {

		var source:Enumerable<T> = this.source || this;
		return XEnumerable.asXEnumerable(source
		.selectMany(
		function (e) {
			if (e.nodeType &&
				(e.nodeType === 'Element' ||
				e.nodeType === 'Comment' ||
				e.nodeType === 'ProcessingInstruction' ||
				e.nodeType === 'Text' ||
				e.nodeType === 'CDATA' ||
				e.nodeType === 'Entity')) {
				return e.descendantNodesAndSelf();
			}
			return Enumerable.empty();
		}));
}

	descendants(xname) {
	var source, result;

	if (xname && typeof xname === 'string') {
		xname = new Ltxml.XName(xname);
	}
	source = this.source ? this.source : this;  //ignore jslint
	result = source
		.selectMany(
		function (e) {
			if (e.nodeType && e.nodeType === 'Element') {
				return e.descendants(xname);
			}
			return Enumerable.empty();
		})
		.asXEnumerable();
	return result;
}

	descendantsAndSelf(xname) {
	var source, result;

	if (xname && typeof xname === 'string') {
		xname = new Ltxml.XName(xname);
	}
	source = this.source ? this.source : this;  //ignore jslint
	result = source
		.selectMany(
		function (e) {
			if (e.nodeType && e.nodeType === 'Element') {
				return e.descendantsAndSelf(xname);
			}
			return Enumerable.empty();
		})
		.asXEnumerable();
	return result;
}

	elements(xname) {
	var source, result;

	if (xname && typeof xname === 'string') {
		xname = new Ltxml.XName(xname);
	}
	source = this.source ? this.source : this;  //ignore jslint
	result = source
		.selectMany(
		function (e) {
			if (e.nodeType &&
				(e.nodeType === 'Element' || e.nodeType === 'Document')) {
				return e.elements(xname);
			}
			return Enumerable.empty();
		})
		.asXEnumerable();
	return result;
}

	InDocumentOrder() {
	throw "Not implemented";
}

	nodes() {
	var source, result;

	source = this.source ? this.source : this;  //ignore jslint
	result = source
		.selectMany(
		function (e) {
			if (e.nodeType &&
				(e.nodeType === 'Element' ||
				e.nodeType === 'Document')) {
				return e.nodes();
			}
			return Enumerable.empty();
		})
		.asXEnumerable();
	return result;
}

	remove(xname) {
	var source, toRemove, i;

	if (xname && typeof xname === 'string') {
		xname = new Ltxml.XName(xname);
	}
	source = this.source ? this.source : this;  //ignore jslint
	toRemove = source.toArray();
	for (i = 0; i < toRemove.length; i += 1) {
		if (xname === undefined) {
			toRemove[i].remove();
		}
		else {
			if (toRemove[i].name && toRemove[i].name === xname) {
				toRemove[i].remove();
			}
		}
	}
}

}

