///<reference types="assert"/>
import assert = require("assert");
import TaskHandler from "../../../../dist/commonjs/System/Threading/Tasks/TaskHandler";
import Functions from "../../../../dist/commonjs/System/Functions";


describe('new',()=>{
	it("should throw",()=>{
		assert.throws(()=>{
			new TaskHandler(null);
		});
		assert.doesNotThrow(()=>{
			(new TaskHandler(Functions.Blank)).dispose();
		});

	});
});