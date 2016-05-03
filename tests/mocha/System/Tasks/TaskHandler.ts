///<reference path="../../import.d.ts"/>

import TaskHandler from "../../../../source/System/Tasks/TaskHandler";
import Functions from "../../../../source/System/Functions";
var assert = require('../../../../node_modules/assert/assert');

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