///<reference types="node"/>
import * as assert from "assert";
import "mocha";
import * as AU from "../../../../dist/commonjs/System/Collections/Array/Utility";
import NotImplementedException
	from "../../../../dist/commonjs/System/Exceptions/NotImplementedException";
import ICollection from "../../../../dist/commonjs/System/Collections/ICollection";

/*
 * This is a reusable set of unit test for use with any ICollection to ensure all features of that ICollection function properly.
 */


export function General<T>(
	collection:ICollection<string>):void
{
	const count = collection.count;

	describe(".count", ()=>
	{
		assertIsNumber(count);
	});
}

function assertIsNumber(value:any, message:string = "should be a real number")
{
	assert.ok(!isNaN(value), message);
}

function assertAdding<T>(c:ICollection<T>, a:T[])
{
	it(".add(value)", ()=>
	{
		let count:number;
		for(let v of a)
		{
			assertIsNumber(count = c.count, "before adding");
			c.add(v);
			assertIsNumber(c.count, "after adding");
			assert.equal(c.count, count + 1, "count should have incremented");
			assert.ok(c.contains(v), "'value' must exist after adding");
		}
	});
}

function assertCopyToClear<T>(c:ICollection<T>)
{
	it(".copyTo(other) & .clear()", ()=>
	{
		const count:number = c.count;
		assertIsNumber(count);
		if(count<2) throw "Can't assert '.copyTo()' or '.clear()' without at least (2) entries.";

		const a:T[] = [];

		c.copyTo(a);
		assertIsNumber(c.count, 'count');
		assert.equal(a.length, count, "An empty array's length should match the count if copied to.");
		c.clear();
		assert.equal(c.count, 0, "A collection's count should be zero after calling '.clear()'.");

		// Restore contents.
		for(let v of a) c.add(v);

		const extraSize = 10;
		const b = AU.initialize<T>(count + extraSize);

		c.copyTo(b, 1);
		assert.equal(b.length, count + extraSize, "An array's length should be equal to it's original length if the count added does not exceed the length.");
		c.copyTo(b, count + extraSize - 1);
		assert.equal(b.length, 2*count + extraSize - 1, "An array's length should be equal to index+count if the count exceeds the length.");
		c.clear();
		assert.equal(c.count, 0, "A collection's count should be zero after calling '.clear()'.");

		// Restore contents.
		for(let v of a) c.add(v);
		assert.equal(c.count, a.length, "A collection's count should be equal to the number of items added.");
	});

}

function assertRemoving<T>(c:ICollection<T>)
{
	it(".remove(values)", ()=>
	{

		let count:number;
		assertIsNumber(count = c.count);
		if(c.count<2) throw "Can't assert '.remove()' without at least (2) entries.";

		const a:T[] = [];
		c.copyTo(a);
		assertIsNumber(c.count);

		try
		{
			for(let v of a)
			{
				count -= c.remove(v); // More than one instance can exist and it should remove both.
				assertIsNumber(c.count, "after removing");
				assert.equal(c.count, count, "'count' should increment after removing.");
				assert.ok(!c.contains(v), "'value' must not exist after removing.");
			}
		}
		catch(ex)
		{
			if((ex)instanceof(NotImplementedException))
			{
				//console.log(ex);
			}
			else
			{
				throw ex;
			}
		}
	});

}

export function Collection<T>(
	name:string,
	collection:ICollection<T>,
	sourceValues:T[]):void
{
	if(sourceValues.indexOf(<any>null)!= -1)
		throw "Source values should not contain null as checking against null is one of the tests.";

	/* The following tests inherently test:
	 - count
	 - contains
	 */
	describe(name, ()=>
	{
		assertAdding(collection, sourceValues);
		assertCopyToClear(collection);
		assertRemoving(collection);
		it("equality comparison should be strict", ()=>
		{
			assert.ok(!collection.contains(<any>null));
		})

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

