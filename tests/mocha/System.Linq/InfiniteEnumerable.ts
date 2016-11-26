///<reference types="node"/>
import * as assert from "assert";
import "mocha";
import Enumerable from "../../../dist/commonjs/System.Linq/Linq";


const source = Enumerable.toInfinity().asEnumerable();

describe(".doAction(...)",()=>{
	it("should throw when disposed",()=>{
		const a = source.doAction(() => {});
		a.force();
		let n = a.getEnumerator();
		assert.ok(n.moveNext());
		n.end();
		assert.ok(!n.moveNext());
		n = a.getEnumerator();
		assert.ok(n.moveNext());
		a.dispose();
		assert.throws(()=>n.moveNext());
	});
});

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
				.firstOrDefault(-1), -1);
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
				.first(), -1);

		assert.equal(
			source
				.take(-1)
				.firstOrDefault(-1), -1);

		assert.throws(()=>
		{
			const t = source.take(2);
			const e = t.getEnumerator();
			e.moveNext();
			t.dispose();
			e.moveNext();
		});

		assert.doesNotThrow(()=>
		{
			let e = false, f = false;
			assert.ok(
				source
					.where(e=>
					{
						if(!e) throw "Error";
						return true;
					})
					.catchError(error=>
					{
						e = error=="Error";
					})
					.finallyAction(()=>{
						f = true;
					})
					.isEmpty());
			assert.ok(e);
			assert.ok(f);
		});

	});

	// All .take operations should return a finite enumerable.
	// For other conditional take operations, like takeWhile, the isEndless property is indeterminate.
	it("should throw for Infinity", ()=>
	{
		assert.throws(()=>
		{
			source.take(Infinity);
		})
	});

});


describe(".choose()", ()=>
{

	it("should filter non-null", ()=>
	{
		assert.equal(source.choose().first(),0);
		assert.equal(source.choose(s=>s).first(),0);
	});

});

describe(".except()", ()=>
{

	it("should skip values that are excepted", ()=>
	{
		assert.equal(source.except([0,1]).first(),2);
		assert.equal(source.except([1,2]).elementAt(2),4);
		source.except([1,2]).dispose();
	});

});

describe(".pairwise(selector)", ()=>
{

	it("should produce pair selected values", ()=>
	{
		const s = Enumerable.toInfinity().pairwise((a, b) => "" + a + "" + b);
		assert.equal(s.elementAt(0),"01");
		assert.equal(s.elementAt(5),"56");
		s.dispose();
	});

});
