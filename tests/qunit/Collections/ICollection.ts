///<reference types="qunit"/>
///<amd-dependency path="QUnit"/>
import * as Text from "../../../dist/amd/System/Text/Utility";
import * as AU from "../../../dist/amd/System/Collections/Array/Utility";
import NotImplementedException from "../../../dist/amd/System/Exceptions/NotImplementedException";
import {ICollection} from "../../../dist/amd/System/Collections/ICollection";
import {CollectionBase} from "../../../dist/amd/System/Collections/CollectionBase";

/*
 * This is a reusable set of unit test for use with any ICollection to ensure all features of that ICollection function properly.
 */

// export function General<T>(
// 	name:string,
// 	collection:CollectionBase<string>):void
// {
// 	var count = collection.count;
//
// 	QUnit.test(name + ".count", (assert:QUnitAssert)=>
// 	{
// 		assert.ok(!isNaN(count), "Count must be a number.");
// 	});
// }

function assertIsNumber(assert:Assert, value:any, name:string)
{
	assert.ok(!isNaN(value), Text.format("'{0}' must be a real number.", name));
}

function assertAdding<T>(assert:Assert, c:ICollection<T>, a:T[])
{
	let count:number;
	for(let v of a)
	{
		assertIsNumber(assert, count = c.count, 'count');
		c.add(v);
		assertIsNumber(assert, c.count, 'count');
		assert.equal(c.count, count + 1, "'count' should increment after adding.");
		assert.ok(c.contains(v), "'value' must exist after adding.");
	}
}

function assertCopyToClear<T>(assert:Assert, c:ICollection<T>)
{
	let count:number;
	assertIsNumber(assert, count = c.count, 'count');
	if(c.count<2) throw "Can't assert '.copyArrayTo()' or '.clearElements()' without at least (2) entries.";

	const a:T[] = [];

	c.copyTo(a);
	assertIsNumber(assert, c.count, 'count');
	assert.equal(a.length, count, "An empty array's length should match the count if copied to.");
	c.clear();
	assert.equal(c.count, 0, "A collection's count should be zero after calling '.clearElements()'.");

	// Restore contents.
	for(let v1 of a) c.add(v1);

	const extraSize = 10;
	const b = AU.initialize<T>(count + extraSize);

	c.copyTo(b, 1);
	assert.equal(b.length, count + extraSize, "An array's length should be equal to it's original length if the count added does not exceed the length.");
	c.copyTo(b, count + extraSize - 1);
	assert.equal(b.length, 2*count + extraSize - 1, "An array's length should be equal to index+count if the count exceeds the length.");
	c.clear();
	assert.equal(c.count, 0, "A collection's count should be zero after calling '.clearElements()'.");

	// Restore contents.
	for(let v2 of a) c.add(v2);
	assert.equal(c.count, a.length, "A collection's count should be equal to the number of items added.");
}

function assertRemoving<T>(assert:Assert, c:ICollection<T>)
{
	let count:number;
	assertIsNumber(assert, count = c.count, 'count');
	if(c.count<2) throw "Can't assert '.remove()' without at least (2) entries.";

	const a:T[] = [];
	c.copyTo(a);
	assertIsNumber(assert, c.count, 'count');

	try
	{
		for(let v of a)
		{
			count -= c.remove(v); // More than one instance can exist and it should remove both.
			assertIsNumber(assert, c.count, 'count');
			assert.equal(c.count, count, "'count' should increment after removing.");
			assert.ok(!c.contains(v), "'value' must not exist after removing.");
		}
	}
	catch(ex)
	{
		if((ex) instanceof (NotImplementedException))
		{
			console.log(ex);
		}
		else
		{
			throw ex;
		}
	}

}

export function Collection<T>(
	name:string,
	collection:CollectionBase<T>,
	sourceValues:T[]):void
{
	if(sourceValues.indexOf(<any>null)!== -1)
		throw "Source values should not contain null as checking against null is one of the tests.";

	/* The following tests inherently test:
	 - count
	 - contains
	 */
	QUnit.test(name, assert=>
	{
		assertAdding(assert, collection, sourceValues);
		assertCopyToClear(assert, collection);
		assertRemoving(assert, collection);
		assert.ok(!collection.contains(<any>null), 'Equality comparison is not strict.');
	});

	QUnit.test(name + ".linqAsync()", (assert:Assert)=>
	{
		let accept = assert.async();
		collection.linqAsync(linq=>
		{
			assert.ok(!!linq, "Expects a linq enumerable instance.");
			assert.ok(!!collection.linq, "Expects a linq enumerable instance.");
			accept();
		});
	});

}

export function StringCollection(
	name:string,
	collection:CollectionBase<string>):void
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
	collection:CollectionBase<number>):void
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
	collection:CollectionBase<Object>):void
{
	const repeat = {};
	//noinspection SpellCheckingInspection
	Collection(name + '<' + 'Object>', collection, [
		undefined,
		{},
		repeat,
		{},
		repeat // Have a repeated entry to test removing multiple.
	])
}

