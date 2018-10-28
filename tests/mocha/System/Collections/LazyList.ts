/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
///<reference types="node"/>
import * as assert from "assert";
import "mocha";
import LazyList from "../../../../dist/commonjs/System/Collections/LazyList";
import {Enumerable} from "../../../../dist/commonjs/System.Linq/Linq";

const LENGTH = 10;

describe('.get(i)', ()=>
{
	let source = new LazyList(Enumerable.range(0,LENGTH));
	it("should reject negative indexes",()=>
	{
		assert.throws(() => source.get(0.5));
	});

	it("should reject non-integers",()=>
	{
		assert.throws(() => source.get(0.5));
	});

	it("should be able to access all entries",()=>{
		for(let i = 0;i<LENGTH;i++)
		{
			assert.equal(i,source.get(i));
		}
	});

	it("should reject out of bounds indexes",()=>
	{
		assert.throws(()=>source.get(10));
	});
});

describe('.count', ()=>
{
	it("should match enumerable count",()=>
	{
		let source1 = new LazyList(Enumerable.range(0,LENGTH));
		let source2 = new LazyList(Enumerable.range(0,LENGTH));

		assert.equal(source1.count, source2.linq.count());
	});

	it("should match enumerable count with same (1)",()=>
	{
		let source = new LazyList(Enumerable.range(0,LENGTH));
		assert.equal(source.count, source.linq.count());
	});

	it("should match enumerable count with same (2)",()=>
	{
		let source = new LazyList(Enumerable.range(0,LENGTH));
		assert.equal(source.linq.count(), source.count);
	});
});
