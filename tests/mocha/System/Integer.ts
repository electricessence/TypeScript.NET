///<reference path="../import.d.ts"/>

import Integer from "../../../source/System/Integer";
var assert = require('../../../node_modules/assert/assert');


const TEST_FLOAT = 10.915, TEST_INT = 10;

describe('.convert(value)', ()=>
{
	it('should convert float number to integer without rounding', ()=>
	{
		assert.equal(
			Integer(TEST_FLOAT),
			TEST_INT);
	});
});


describe('.is(value)', ()=>
{
	it('should detect a number that is not an integer', ()=>
	{
		assert.equal(
			Integer.is(<any>"1"),
			false);

		assert.equal(
			Integer.is(<any>"test"),
			false);

		assert.equal(
			Integer.is(NaN),
			false);

		assert.equal(
			Integer.is(Infinity),
			false);

		assert.equal(
			Integer.is(-Infinity),
			false);

		assert.equal(
			Integer.is(TEST_FLOAT),
			false);

		assert.equal(
			Integer.is(-TEST_FLOAT),
			false);
	});

	it('should detect a number that is an integer', ()=>
	{
		assert.equal(
			Integer.is(-TEST_INT),
			true);

		assert.equal(
			Integer.is(TEST_INT),
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
