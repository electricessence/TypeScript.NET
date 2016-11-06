///<reference types="node"/>
import * as assert from "assert";
import "mocha";
import ArrayEnumerator from "../../../../../dist/commonjs/System/Collections/Enumeration/ArrayEnumerator";

describe("new & .moveNext()",()=>{
	it("should allow empty arrays", ()=>
	{
		assert.doesNotThrow(()=>
		{
			var i = new ArrayEnumerator([]);
			i.moveNext();
		});

		assert.doesNotThrow(()=>
		{
			var i = new ArrayEnumerator(<any>null);
			i.moveNext();
		});

	});
});

