///<reference path="../import.d.ts"/>

import Enumerable from "../../../source/System.Linq/Linq";
var assert = require('../../../node_modules/assert/assert');


var source = Enumerable.toInfinity();

describe(".elementAt(x)", ()=>
{

	it("the index should match the value", ()=>
	{
		for(let i = 0; i<10; i++)
		{
			assert.equal(source.elementAt(i), i);
		}
	});

});

describe(".singleOrDefault()", ()=>
{

	it("should be defaulted", ()=>
	{
		assert.equal(source.singleOrDefault(), null);
		assert.equal(source.singleOrDefault(-1), -1);
	});

});


describe(".single()", ()=>
{

	it("should throw", ()=>
	{
		assert.throws(()=>
		{
			source.single();
		});
	});

});


describe(".skip(count)", ()=>
{
	it("should return empty if Infinity", ()=>
	{
		assert.equal(
			source
				.skip(Infinity)
				.firstOrDefault(-1),-1);
	});

});


describe(".take(count)", ()=>
{
	it("should return empty if zero less", ()=>
	{
		assert.equal(
			source
				.take(0)
				.defaultIfEmpty(-1)
				.first(),-1);

		assert.equal(
			source
				.take(-1)
				.firstOrDefault(-1),-1);

	});

	// All .take operations should return a finite enumerable.
	// For other conditional take operations, like takeWhile, the isEndless property is indeterminate.
	it("should throw for Infinity",()=>{
		assert.throws(()=>{
			source.take(Infinity);
		})
	});

});
