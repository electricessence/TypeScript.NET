///<reference path="../../import.d.ts"/>

import {padRight, padLeft} from "../../../../source/System/Text/Padding";
var assert = require('../../../../node_modules/assert/assert');

describe('.padLeft()', ()=>
{
	it("should pad to the left", ()=>
	{
		assert.equal(padLeft("X", 3, "Y"), "YYX");
		assert.equal(padLeft("X", 3), "  X");
		assert.equal(padLeft(1, 3, 0), "001");
		assert.equal(padLeft(1, 3), "001");
		assert.equal(padLeft(1, 3, 2), "221");
	});
});

describe('.padRight()', ()=>
{
	it("should pad to the right", ()=>
	{
		assert.equal(padRight("X", 3, "Y"), "XYY");
		assert.equal(padRight("X", 3), "X  ");
		assert.equal(padRight(1, 3, 0), "100");
		assert.equal(padRight(1, 3), "100");
		assert.equal(padRight(1, 3, 2), "122");
	});
});
