///<reference path="../../../import"/>

import * as ArrayProcedure from '../../../../../source/System/Collections/Array/Procedure';
var assert = require('../../../../../node_modules/assert/assert');


const
minA    = -10, maxA = 2000, minB = -Infinity, maxB = Infinity,
a       = [5, minA, -1, maxA, -2, NaN, 20],
b       = [5, 2000, maxB, -1, NaN, -10, minB, -2, 20],
sum     = 5 + minA + (-1) + maxA + (-2) + 20,
average = sum/6, // Not including NaN
product = 5*minA*(-1)*maxA*(-2)*20;


function procedureShouldBe(
	source:number[],
	value:number,
	p:(array:number[], ignoreNaN:boolean)=>number)
{
	it('should be NaN', ()=>
	{
		assert.ok(isNaN(p(source, false)));
	});
	it('should be ' + value, ()=>
	{
		assert.equal(p(source, true), value);
	});
}

describe(".sum(source)", ()=>
{
	procedureShouldBe(a, sum, ArrayProcedure.sum);
});

describe(".average(source)", ()=>
{
	procedureShouldBe(a, average, ArrayProcedure.average);
});


describe(".product(source)", ()=>
{
	procedureShouldBe(a, product, ArrayProcedure.product);
});


describe(".min(source)", ()=>
{
	describe("a", ()=>
	{
		procedureShouldBe(a, minA, ArrayProcedure.min);
	});

	describe("b", ()=>
	{
		procedureShouldBe(b, minB, ArrayProcedure.min);
	});
});

describe(".max(source)", ()=>
{
	describe("a", ()=>
	{
		procedureShouldBe(a, maxA, ArrayProcedure.max);
	});

	describe("b", ()=>
	{
		procedureShouldBe(b, maxB, ArrayProcedure.max);
	});
});
