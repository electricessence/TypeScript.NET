///<reference types="qunit"/>
///<amd-dependency path="QUnit"/>

import * as ArrayProcedure from "../../../dist/amd/System/Collections/Array/Procedure";

export default function run()
{
	// Min/Max tests...
	var minA                   = -10, maxA = 2000,
	    minB = -Infinity, maxB = Infinity;

	var a       = [5, minA, -1, maxA, -2, NaN, 20],
	    sum     = 5 + minA + -1 + maxA + -2 + 20,
	    average = sum/6, // Not including NaN
	    product = 5*minA* -1*maxA* -2*20;

	var b = [5, 2000, maxB, -1, NaN, -10, minB, -2, 20];


	QUnit.test("Array/Procedure.sum", assert=>
	{
		assert.ok(isNaN(ArrayProcedure.sum(a, false)), "Sum should be NaN");
		assert.equal(ArrayProcedure.sum(a, true), sum, "Sum should be " + sum);
	});

	QUnit.test("Array/Procedure.average", assert=>
	{
		assert.ok(isNaN(ArrayProcedure.average(a, false)), "Average should be NaN");
		assert.equal(ArrayProcedure.average(a, true), average, "Average should be " + average);
	});


	QUnit.test("Array/Procedure.product", assert=>
	{
		assert.ok(isNaN(ArrayProcedure.product(a, false)), "Product should be NaN");
		assert.equal(ArrayProcedure.product(a, true), product, "Product should be " + product);
	});


	QUnit.test("Array/Procedure.min", assert=>
	{
		assert.ok(isNaN(ArrayProcedure.min(a, false)), "Min value should be NaN");
		assert.equal(ArrayProcedure.min(a, true), minA, "Min value should be " + minA);
		assert.equal(ArrayProcedure.min(b, true), minB, "Min value should be " + minB);
	});

	QUnit.test("Array/Procedure.max", function(assert:Assert)
	{
		assert.ok(isNaN(ArrayProcedure.max(a, false)), "Min value should be NaN");
		assert.equal(ArrayProcedure.max(a, true), maxA, "Min value should be " + maxA);
		assert.equal(ArrayProcedure.max(b, true), maxB, "Min value should be " + maxB);
	});

}
