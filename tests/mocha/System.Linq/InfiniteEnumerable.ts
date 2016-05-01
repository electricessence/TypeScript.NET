///<reference path="../import.d.ts"/>

import Enumerable from "../../../source/System.Linq/Linq";
var assert = require('../../../node_modules/assert/assert');

var source = Enumerable.toInfinity();

describe('.toInfinity()',()=>{

	describe(".elementAt(x)",()=>{

		it("the index should match the value",()=>{
			for(let i=0;i<10;i++)
				assert.equal(source.elementAt(i),i);
		});

	});

	describe(".singleOrDefault()",()=>{

		it("should be defaulted",()=>{
			assert.equal(source.singleOrDefault(),null);
			assert.equal(source.singleOrDefault(-1),-1);
		});

	});


	describe(".single()",()=>{

		it("should throw",()=>{
			assert.throws(()=>{
				source.single();
			});
		});

	});
});
