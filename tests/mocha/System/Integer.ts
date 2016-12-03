///<reference types="node"/>
import * as assert from "assert";
import "mocha";
import Integer from "../../../dist/commonjs/System/Integer";


const TEST_FLOAT = 10.915, TEST_INT = 10, MAX = 9007199254740991;

describe('(value)', ()=>
{
	it('should convert float number to integer without rounding', ()=>
	{
		assert.equal(
			Integer(TEST_FLOAT),
			TEST_INT);
	});
});

describe('.as32Bit(value)', ()=>
{
	it('should convert float number to integer without rounding', ()=>
	{
		assert.equal(
			Integer.as32Bit(TEST_FLOAT),
			TEST_INT);
	});

	it('should throw not possible to convert', ()=>
	{
		assert.throws(()=>Integer.as32Bit(MAX));
	});
});

describe('.is(value)', ()=>
{
	it('should detect a number that is not an integer', ()=>
	{
		function baseTests(fn:(n:number)=>boolean):void
		{

			assert.equal(
				fn(<any>"1"),
				false);

			assert.equal(
				fn(<any>"test"),
				false);

			assert.equal(
				fn(NaN),
				false);

			assert.equal(
				fn(Infinity),
				false);

			assert.equal(
				fn(-Infinity),
				false);

			assert.equal(
				fn(TEST_FLOAT),
				false);

			assert.equal(
				fn(-TEST_FLOAT),
				false);
		}

		baseTests(Integer.is);
		baseTests(Integer.is32Bit);

		assert.equal(
			Integer.is32Bit(Integer.MAX_32_BIT + 1),
			false);
	});

	it('should detect a number that is an integer', ()=>
	{
		function baseTests(fn:(n:number)=>boolean):void
		{

			assert.equal(
				fn(-0),
				true);

			assert.equal(
				fn(-TEST_INT),
				true);

			assert.equal(
				fn(TEST_INT),
				true);

			assert.equal(
				fn(Integer.MAX_32_BIT),
				true);

			assert.equal(
				fn(-Integer.MAX_32_BIT),
				true);
		}

		baseTests(Integer.is);
		baseTests(Integer.is32Bit);

		assert.equal(
			Integer.is(Integer.MAX_32_BIT + 1),
			true);

		assert.equal(
			Integer.is(-MAX),
			true);

		assert.equal(
			Integer.is(MAX),
			true);

	});
});


describe('.assert(value)', ()=>
{
	it('should detect a number that is not an integer', ()=>
	{
		assert.throws(()=>
		{
			Integer.assert(TEST_FLOAT);
		});
	});

	it('should detect a number that is an integer', ()=>
	{
		assert.equal(
			Integer.assert(TEST_INT),
			true);
	});
});

