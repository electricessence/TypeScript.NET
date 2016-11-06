///<reference types="node"/>
import * as assert from "assert";
import "mocha";
import IndexEnumerator from "../../../../../dist/commonjs/System/Collections/Enumeration/IndexEnumerator";

const a:{ [index:number]:number } = {0: 0, 1: 1, 2: 2, 3: 3, 4: 4};

describe("new & .moveNext()", ()=>
{
	it("should ignore null sources", ()=>
	{

		assert.doesNotThrow(()=>
		{
			var i = new IndexEnumerator(()=>
			{
				return {
					source: <any>null,
					pointer: 1,
					length: 3,
					step: 0
				}
			});
			i.moveNext();
		});

		assert.doesNotThrow(()=>
		{
			var i = new IndexEnumerator(()=>
			{
				return {
					source: <any>null,
					length: 3,
				}
			});
			i.dispose();
		});

	});


	it("should throw for invalid step", ()=>
	{

		assert.throws(()=>
		{
			var i = new IndexEnumerator(()=>
			{
				return {
					source: a,
					pointer: 1,
					length: 3,
					step: 0
				}
			});
			i.moveNext();
		});

		assert.throws(()=>
		{
			var i = new IndexEnumerator(()=>
			{
				return {
					source: a,
					pointer: 1,
					length: 3,
					step: 1.2
				}
			});
			i.moveNext();
		});
	});

	it("should throw for invalid pointer", ()=>
	{

		assert.throws(()=>
		{
			var i = new IndexEnumerator(()=>
			{
				return {
					source: a,
					pointer: 1.3,
					length: 3,
					step: 1
				}
			});
			i.moveNext();
		});

	});

	it("should throw for invalid length", ()=>
	{

		assert.throws(()=>
		{
			var i = new IndexEnumerator(()=>
			{
				return {
					source: a,
					pointer: 1,
					length: -1,
					step: 1
				}
			});
			i.moveNext();
		});

	});

	it("should enumerate by 1 with no step", ()=>
	{


		var a = [0, 1, 2, 3, 4];
		var len = a.length, count = 0;
		var test = new IndexEnumerator(()=>
		{
			return {
				source: [0, 1, 2, 3, 4],
				length: 5,
			}
		});
		var last:number = <any>null;
		while(test.moveNext())
		{
			count++;
			last = test.current!;
		}
		assert.equal(count, len);
		assert.equal(last, 4);
		test.dispose();
	});
});