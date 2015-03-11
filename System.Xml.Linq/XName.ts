///<reference path="../build/System.d.ts"/>
///<reference path="../build/System.Linq.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Xml.Linq
{
	export class XName
		implements System.IEquatable<XName>
		//,ISerializable
	{
		constructor(
			private _localName: string,
			private _namespace: XNamespace = null)
		{

		}

		get localName(): string
		{
			return this._localName;
		}

		get namespace(): XNamespace
		{
			return this._namespace || XNamespace.none;
		}

		get namespaceName(): string
		{
			return this.namespace.namespaceName;
		}

		static from(xname:any):XName {
			var	xn:XName = typeof xname === 'string'
				? (xname ? new XName(xname) : null)
				: xname;

			if(!(xn==null || xn instanceof XName)) {
				throw new Error("Invalid type: must be of XName or string.");
			}

			return xn;
		}

		equals(other: XName): boolean
		{
			return this._localName === other.localName;
		}
	}
}