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
			const i = new IndexEnumerator(() =>
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
			const i = new IndexEnumerator(() =>
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
			const i = new IndexEnumerator(() =>
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
			const i = new IndexEnumerator(() =>
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
			const i = new IndexEnumerator(() =>
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
			const i = new IndexEnumerator(() =>
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


		const a = [0, 1, 2, 3, 4];
		const len = a.length;
		let count = 0;
		const test = new IndexEnumerator(() =>
		{
			return {
				source: [0, 1, 2, 3, 4],
				length: 5,
			}
		});
		let last:number = <any>null;
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