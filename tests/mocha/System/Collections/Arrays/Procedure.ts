///<reference types="node"/>
import * as assert from "assert";
import {sum} from "../../../../../build/umd/dist/Collections/Array/Procedure/sum";
import {average} from "../../../../../build/umd/dist/Collections/Array/Procedure/average";
import {product} from "../../../../../build/umd/dist/Collections/Array/Procedure/product";
import {quotient} from "../../../../../build/umd/dist/Collections/Array/Procedure/quotient";
import {max, min} from "../../../../../build/umd/dist/Collections/Array/Procedure/minmax";

const
	minA     = -10,
	maxA     = 2000,
	minB     = -Infinity,
	maxB     = Infinity,
	a        = [5, minA, -1, maxA, -2, NaN, 20],
	b        = [5, 2000, maxB, -1, NaN, -10, minB, -2, 20];
const
	sumResult      = 5 + minA + (-1) + maxA + (-2) + 20,
	averageResult  = sumResult/6, // Not including NaN
	productResult  = 5*minA*(-1)*maxA*(-2)*20,
	quotientResult = 5/minA/(-1)/maxA/(-2)/20;


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
	procedureShouldBe(a, sumResult, sum);
	it('should be 0', ()=>
	{
		assert.equal(sum([]), 0);
	});
});

describe(".average(source)", ()=>
{
	procedureShouldBe(a, averageResult, average);
	it('should be NaN', ()=>
	{
		assert.ok(isNaN(average([])));
	});

});


describe(".product(source)", ()=>
{
	procedureShouldBe(a, productResult, product);
	it('should be NaN', ()=>
	{
		assert.ok(isNaN(product([])));
		assert.ok(isNaN(product([NaN], true)));
	});

});

describe(".quotient(source)", ()=>
{
	procedureShouldBe(a, quotientResult, quotient);
	it('should be NaN', ()=>
	{
		assert.ok(isNaN(quotient([])));
		assert.ok(isNaN(quotient([1])));
		assert.ok(isNaN(quotient([3,2,1,0])));
		assert.ok(isNaN(quotient([NaN], true)));
		assert.ok(isNaN(quotient([NaN,NaN,NaN])));
	});

});


describe(".min(source)", ()=>
{
	describe("a", ()=>
	{
		procedureShouldBe(a, minA, min);
	});

	describe("b", ()=>
	{
		procedureShouldBe(b, minB, min);
	});

	it("should be NaN",()=>{
		assert.ok(isNaN(min(<any>null)));
		assert.ok(isNaN(min([NaN],true)));
	});

});

describe(".max(source)", ()=>
{
	describe("a", ()=>
	{
		procedureShouldBe(a, maxA, max);
	});

	describe("b", ()=>
	{
		procedureShouldBe(b, maxB, max);
	});

	it("should be NaN",()=>{
		assert.ok(isNaN(max(<any>null)));
		assert.ok(isNaN(max([NaN],true)));
	});
});
