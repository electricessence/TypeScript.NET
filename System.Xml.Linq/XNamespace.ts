///<reference path="../build/System.d.ts"/>
///<reference path="../build/System.Linq.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Documentation: https://msdn.microsoft.com/en-us/library/system.xml.linq.xnamespace%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Xml.Linq
{

	export class XNamespace
		implements System.IEquatable<XNamespace>
	//,ISerializable
	{
		constructor(private _namespaceName: string = "")
		{

		}

		static get none(): XNamespace
		{
			return none;
		}

		get namespaceName(): string
		{
			return this._namespaceName;
		}

		static get xml(): XNamespace
		{
			return xml;
		}

		static get xmlns(): XNamespace
		{
			return xmlns;
		}

		static from(xname: any): XNamespace
		{
			var xn: XNamespace = typeof xname === 'string'
				? (xname ? new XNamespace(xname) : null)
				: xname;

			if (!(xn == null || xn instanceof XNamespace))
			{
				throw new Error('Invalid type: must be of XNamespace or string.');
			}

			return xn;
		}

		equals(other: XNamespace): boolean
		{
			return this == other
				|| this._namespaceName === other.namespaceName
				|| !this._namespaceName && !other.namespaceName;
		}

		toString(): string
		{
			return this._namespaceName || "";
		}

	}

	// Protect these instances.
	var none = new XNamespace();
	var xml = new XNamespace('http://www.w3.org/XML/1998/namespace');
	var xmlns = new XNamespace('http://www.w3.org/2000/xmlns/');

	// Sealed Class:
	Object.freeze(XNamespace);

}