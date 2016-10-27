///<reference types="assert"/>
import assert = require("assert");
import ArrayEnumerator from "../../../../../dist/commonjs/System/Collections/Enumeration/ArrayEnumerator";

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
