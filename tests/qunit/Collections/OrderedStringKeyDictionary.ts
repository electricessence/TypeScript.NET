import * as ICollectionTests from "./ICollection";
import OrderedStringKeyDictionary from "../../../dist/amd/System/Collections/Dictionaries/OrderedStringKeyDictionary";
import {IKeyValuePair} from "../../../dist/amd/System/KeyValuePair";


export default function run()
{

	ICollectionTests.Collection<IKeyValuePair<string,number>>(
		'OrderedStringKeyDictionary'+'number>',
		new OrderedStringKeyDictionary<number>(),
		[
			{key:'A',value:1},
			{key:'B',value:2},
			{key:'C',value:3},
			{key:'D',value:4},
			{key:'E',value:5},
			{key:'F',value:6}
		]);
}
