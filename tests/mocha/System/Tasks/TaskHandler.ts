///<reference types="node"/>
import * as assert from "assert";
import TaskHandler from "../../../../dist/commonjs/System/Threading/Tasks/TaskHandler";
import Functions from "../../../../dist/commonjs/System/Functions";


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