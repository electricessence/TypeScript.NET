/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import {Primitive} from "../Primitive";
import {ISerializable} from "../Serialization/ISerializable";
import {IMap} from "../../IMap";

export module UriComponent {
	export interface Formattable
	{
		toUriComponent():string;
	}

	export type Value
		= Primitive|ISerializable|Formattable;

	export interface Map extends IMap<Value|Value[]>
	{

	}
}

export default UriComponent;


