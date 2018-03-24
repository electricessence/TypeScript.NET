/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */

// noinspection SpellCheckingInspection
import Scheme, {SchemeValue} from "./Scheme";

// noinspection SpellCheckingInspection
/**
 * https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 *
 * ```
 *    urn:example:mammal:monotreme:echidna
 *    ??? ????????????????????????????????
 *   scheme             path
 * ```
 */
export default interface IUrn
{

	/**
	 * The scheme name for this URI.
	 */
	scheme?:SchemeValue|null;

	/**
	 * The absolute path of the URI.
	 */
	path?:string|null;

}
