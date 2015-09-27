///<reference path="../../source/System/Collections/ICollection.ts"/>
///<reference path="../../typings/qunit/qunit.d.ts"/>
///<amd-dependency path="QUnit"/>

import Text = require('../../source/System/Text/Utility');
import AU = require('../../source/System/Collections/Array/Utility');

/**
 * This is a reusable set of unit test for use with any ICollection to ensure all features of that ICollection function properly.
 */
module ICollectionTests
{

	export function General<T>(
		name:string,
		collection:ICollection<string>):void
	{
		var count = collection.count;

		QUnit.test(name + ".count", function (assert:QUnitAssert)
		{
			assert.ok(!isNaN(count), "Count must be a number.");
		});
	}

	function assertIsNumber(assert:QUnitAssert, value:any, name:string)
	{
		assert.ok(!isNaN(value), Text.format("'{0}' must be a real number.", name));
	}

	function assertAdding<T>(assert:QUnitAssert, c:ICollection<T>, a:T[])
	{
		var count:number;
		for(var v of a)
		{
			assertIsNumber(assert, count = c.count, 'count');
			c.add(v);
			assertIsNumber(assert, c.count, 'count');
			assert.equal(c.count, count + 1, "'count' should increment after adding.");
			assert.ok(c.contains(v), "'value' must exist after adding.");
		}
	}

	function assertCopyToClear<T>(assert:QUnitAssert, c:ICollection<T>)
	{
		var count:number;
		assertIsNumber(assert, count = c.count, 'count');
		if(c.count<2) throw "Can't assert '.copyTo()' or '.clear()' without at least (2) entries.";

		var a:T[] = [];

		c.copyTo(a);
		assertIsNumber(assert, c.count, 'count');
		assert.equal(a.length, count, "An empty array's length should match the count if copied to.");
		c.clear();
		assert.equal(c.count, 0, "A collection's count should be zero after calling '.clear()'.");

		// Restore contents.
		for(var v of a) c.add(v);

		var extraSize = 10;
		var b = AU.initialize<T>(count + extraSize);

		c.copyTo(b, 1);
		assert.equal(b.length, count + extraSize, "An array's length should be equal to it's original length if the count added does not exceed the length.");
		c.copyTo(b, count + extraSize - 1);
		assert.equal(b.length, 2*count + extraSize - 1, "An array's length should be equal to index+count if the count exceeds the length.");
		c.clear();
		assert.equal(c.count, 0, "A collection's count should be zero after calling '.clear()'.");

		// Restore contents.
		for(var v of a) c.add(v);
		assert.equal(c.count, a.length, "A collection's count should be equal to the number of items added.");
	}

	function assertRemoving<T>(assert:QUnitAssert, c:ICollection<T>)
	{
		var count:number;
		assertIsNumber(assert, count = c.count, 'count');
		if(c.count<2) throw "Can't assert '.remove()' without at least (2) entries.";

		var a:T[] = [];
		c.copyTo(a);
		assertIsNumber(assert, c.count, 'count');

		try {
			for(var v of a)
			{
				count -= c.remove(v); // More than one instance can exist and it should remove both.
				assertIsNumber(assert, c.count, 'count');
				assert.equal(c.count, count, "'count' should increment after removing.");
				assert.ok(!c.contains(v), "'value' must not exist after removing.");
			}
		}
		catch (ex) {
			if(ex.message.indexOf('NotImplementedException')==-1)
				throw ex;
		}

	}

	export function Collection<T>(
		name:string,
		collection:ICollection<T>,
		sourceValues:T[]):void
	{
		if(sourceValues.indexOf(null)!=-1)
			throw "Source values should not contain null as checking against null is one of the tests.";

		/* The following tests inherently test:
		 - count
		 - contains
		 */
		QUnit.test(name, function (assert:QUnitAssert)
		{
			assertAdding(assert, collection, sourceValues);
			assertCopyToClear(assert, collection);
			assertRemoving(assert, collection);
			assert.ok(!collection.contains(null),'Equality comparison is not strict.');
		});

	}

	export function StringCollection(
		name:string,
		collection:ICollection<string>):void
	{

		//noinspection SpellCheckingInspection
		Collection(name + '<' + 'string>', collection, [
			"",
			"lorem",
			"ipsum",
			"dolem",
			"ipsum" // Have a repeated entry to test removing multiple.
		])


	}

	export function NumberCollection(
		name:string,
		collection:ICollection<number>):void
	{
		//noinspection SpellCheckingInspection
		Collection(name + '<' + 'number>', collection, [
			0,
			1,
			1, // Have a repeated entry to test removing multiple.
			2,
			3,
			5,
			8,
			NaN // Must be able to reconginze NaN
		]);


	}

	export function InstanceCollection(
		name:string,
		collection:ICollection<Object>):void
	{
		var repeat = {};
		//noinspection SpellCheckingInspection
		Collection(name + '<' + 'Object>', collection, [
			undefined,
			{},
			repeat,
			{},
			repeat // Have a repeated entry to test removing multiple.
		])
	}



}


export = ICollectionTests;
