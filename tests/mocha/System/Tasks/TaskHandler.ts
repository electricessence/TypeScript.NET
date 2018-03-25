///<reference types="node"/>
import * as assert from "assert";
import TaskHandler from "../../../../build/umd/dist/Threading/Tasks/TaskHandler";
import Functions from "../../../../build/umd/dist/Functions";


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