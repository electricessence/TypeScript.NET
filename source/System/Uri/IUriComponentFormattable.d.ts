///<reference path="../Collections/Dictionaries/IDictionary.d.ts"/>
///<reference path="..\Serialization\ISerializable.d.ts"/>
/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

interface IUriComponentFormattable {
	toUriComponent():string;
}

interface IUriComponentMap extends IMap<string|number|boolean|ISerializable|IUriComponentFormattable> {

}
