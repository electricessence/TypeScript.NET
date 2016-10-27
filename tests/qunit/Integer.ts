///<reference types='qunit'/>
///<amd-dependency path='QUnit'/>

import Integer from "../../dist/amd/System/Integer";


export default function run()
{

	const TEST_FLOAT = 10.915, TEST_INT = 10;

	QUnit.test('Integer: convert', assert=>
	{

		assert.equal(
			Integer(TEST_FLOAT),
			TEST_INT,
			'Should convert float number to integer without rounding.');

	});

	QUnit.test('Integer: is', assert=>
	{

		assert.equal(
			Integer.is(TEST_FLOAT),
			false,
			'Should detect a number that is not an integer.');

		assert.equal(
			Integer.is(TEST_INT),
			true,
			'Should detect a number that is an integer.');

	});

	QUnit.test('Integer: assert', assert=>
	{

		assert.equal(
			Integer.assert(TEST_INT),
			true,
			'Should detect a number that is an integer.');

		assert.throws(()=>
		{
			Integer.assert(TEST_FLOAT);
		});

	});
}
