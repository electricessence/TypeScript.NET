/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../Collections/Dictionaries/IDictionary.d.ts"/>
///<reference path="../Serialization/ISerializable.d.ts"/>
///<reference path="../Primitive.d.ts"/>

interface IUriComponentFormattable {
	toUriComponent():string;
}

declare type UriComponentValue
	= Primitive|ISerializable|IUriComponentFormattable;

interface IUriComponentMap
extends IMap<UriComponentValue|UriComponentValue[]> {

}

declare type QueryParamArray
	= IArray<StringKeyValuePair<UriComponentValue|UriComponentValue[]>>;

declare type QueryParamEnumerable
	= IEnumerable<StringKeyValuePair<UriComponentValue|UriComponentValue[]>>;

declare type QueryParamEnumerableOrArray
	= IEnumerableOrArray<StringKeyValuePair<UriComponentValue|UriComponentValue[]>>;

declare type QueryParamsConvertible
	= string | IUriComponentMap | QueryParamEnumerableOrArray;
