///<reference path="..\..\source\System\Collections\Dictionaries\IDictionary.d.ts"/>
import ICollectionTests = require('./ICollection');
import OrderedStringKeyDictionary = require('../../source/System/Collections/Dictionaries/OrderedStringKeyDictionary');

function run()
{

	ICollectionTests.Collection<IKeyValuePair<string,number>>(
		'OrderedStringKeyDictionary<number>',
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

export = run;
