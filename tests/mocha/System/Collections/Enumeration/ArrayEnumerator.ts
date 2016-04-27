///<reference path="../../../import.d.ts"/>

import ArrayEnumerator from "../../../../../source/System/Collections/Enumeration/ArrayEnumerator";
var assert = require('../../../../../node_modules/assert/assert');


it("should allow empty arrays", ()=>
{
	assert.doesNotThrow(()=>
	{
		var i = new ArrayEnumerator([]);
		i.moveNext();
	});

	assert.doesNotThrow(()=>
	{
		var i = new ArrayEnumerator(null);
		i.moveNext();
	});

});
