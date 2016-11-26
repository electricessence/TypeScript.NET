///<reference types="node"/>
import * as assert from "assert";
import * as ArrayProcedure from "../../../../../dist/commonjs/System/Collections/Array/Procedure";


const
	minA     = -10,
	maxA     = 2000,
	minB     = -Infinity,
	maxB     = Infinity,
	a        = [5, minA, -1, maxA, -2, NaN, 20],
	b        = [5, 2000, maxB, -1, NaN, -10, minB, -2, 20],
	sum      = 5 + minA + (-1) + maxA + (-2) + 20,
	average  = sum/6, // Not including NaN
	product  = 5*minA*(-1)*maxA*(-2)*20,
	quotient = 5/minA/(-1)/maxA/(-2)/20;


function procedureShouldBe(
	source:number[],
	value:number,
	p:(array:number[], ignoreNaN?:boolean)=>number)
{
	it('should be NaN', ()=>
	{
		assert.ok(isNaN(p(source)));
	});
	it('should be ' + value, ()=>
	{
		assert.equal(p(source, true), value);
	});
}

describe(".sum(source)", ()=>
{
	procedureShouldBe(a, sum, ArrayProcedure.sum);
	it('should be 0', ()=>
	{
		assert.equal(ArrayProcedure.sum([]), 0);
	});
});

describe(".average(source)", ()=>
{
	procedureShouldBe(a, average, ArrayProcedure.average);
	it('should be NaN', ()=>
	{
		assert.ok(isNaN(ArrayProcedure.average([])));
	});

});


describe(".product(source)", ()=>
{
	procedureShouldBe(a, product, ArrayProcedure.product);
	it('should be NaN', ()=>
	{
		assert.ok(isNaN(ArrayProcedure.product([])));
		assert.ok(isNaN(ArrayProcedure.product([NaN], true)));
	});

});

describe(".quotient(source)", ()=>
{
	procedureShouldBe(a, quotient, ArrayProcedure.quotient);
	it('should be NaN', ()=>
	{
		assert.ok(isNaN(ArrayProcedure.quotient([])));
		assert.ok(isNaN(ArrayProcedure.quotient([1])));
		assert.ok(isNaN(ArrayProcedure.quotient([3,2,1,0])));
		assert.ok(isNaN(ArrayProcedure.quotient([NaN], true)));
		assert.ok(isNaN(ArrayProcedure.quotient([NaN,NaN,NaN])));
	});

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

	it("should be NaN",()=>{
		assert.ok(isNaN(ArrayProcedure.min(<any>null)));
		assert.ok(isNaN(ArrayProcedure.min([NaN],true)));
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

	it("should be NaN",()=>{
		assert.ok(isNaN(ArrayProcedure.max(<any>null)));
		assert.ok(isNaN(ArrayProcedure.max([NaN],true)));
	});
});
