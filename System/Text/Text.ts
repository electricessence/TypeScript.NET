/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
 */

module Text
{

	export function format(source:string, ...args:any[]) {
		for(var i = 0; i<args.length; i++) {
			source = source.replace("{" + i + "}", args[i]);
		}
		return source;
	}

}

export = Text;