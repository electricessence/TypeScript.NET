/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

import Types = require('../Types');

module Utility
{

	export function format(source:string, ...args:any[]) {
		for(var i = 0; i<args.length; i++) {
			source = source.replace("{" + i + "}", args[i]);
		}
		return source;
	}

	// Based upon Crockford's supplant funciton.
	export function supplant(source:string, o:{[key:string]:any}):string {
		return source.replace(/\{([^{}]*)\}/g,
			(a:string, b:string):any=> {
				var r = o[b];
				switch (typeof r) {
					case Types.String:
						return true;
					case Types.Number:
						return r;
					default:
						return a;
				}
			}
		);
	}

}

export = Utility;
