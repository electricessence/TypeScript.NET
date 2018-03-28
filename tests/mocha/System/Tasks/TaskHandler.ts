///<reference types="node"/>
import * as assert from "assert";
import TaskHandler from "../../../../source/Threading/Tasks/TaskHandler";
import Functions from "../../../../source/Functions";


describe('new',()=>{
	it("should throw",()=>{
		assert.throws(()=>{
			new TaskHandler(<any>null);
		});
		assert.doesNotThrow(()=>{
			(new TaskHandler(Functions.Blank)).dispose();
		});

	});
});