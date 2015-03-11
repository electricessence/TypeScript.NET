///<reference path="../build/System.d.ts"/>
///<reference path="../build/System.Linq.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Xml.Linq
{

	import IEnumerable = System.Collections.IEnumerable;
	import Enumerable = System.Linq.Enumerable;

	var empty = Enumerable.empty<XElement>();

	export class XElement extends XContainer {
		constructor() {
			super();
		}

		private _name:XName;
		get name():XName { return this._name; }
		set name(value:XName) { this._name = value; }

		static get emptySequence():IEnumerable<XElement> {
			return empty;
		}
	}
}