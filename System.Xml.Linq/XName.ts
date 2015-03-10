///<reference path="../build/System.d.ts"/>
///<reference path="../build/System.Linq.d.ts"/>

/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module System.Xml.Linq
{
	export class XName {
		constructor(name:string) {

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
	}
}