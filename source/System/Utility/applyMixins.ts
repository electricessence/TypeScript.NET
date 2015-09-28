/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

function applyMixins(derivedConstructor:any, baseConstructors:any[]):void
{
	baseConstructors
		.forEach(bc =>
		{
			Object.getOwnPropertyNames(bc.prototype).forEach(
					name =>
				{
					derivedConstructor.prototype[name] = bc.prototype[name];
				}
			);
		}
	);
}

export = applyMixins;
