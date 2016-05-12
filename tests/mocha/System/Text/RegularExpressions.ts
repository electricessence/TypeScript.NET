///<reference path="../../import.d.ts"/>

const assert = require('../../../../node_modules/assert/assert');

import Regex from "../../../../source/System/Text/RegularExpressions";

const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const regex = new Regex("(?<first>[A-E]+)",["i"]);

describe("Regex",()=>{

	describe(".match(input)",()=>{

		it("should match correctly",()=>{

			var m = regex.match(str);
			assert.equal(m.value,"ABCDE");
			assert.equal(m.namedGroups["first"].value,"ABCDE");
		});

	});

	describe(".matches(input)",()=>{

		it("should capture all instances",()=>{

			var m = regex.matches(str);
			assert.equal(m.length,2);
			assert.equal(m[0].value,"ABCDE");
			assert.equal(m[0].namedGroups["first"].value,"ABCDE");
			assert.equal(m[1].value,"abcde");
			assert.equal(m[1].namedGroups["first"].value,"abcde");
		});

	});

});
