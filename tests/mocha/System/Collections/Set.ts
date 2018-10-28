///<reference types="node"/>
import * as assert from "assert";
import * as ICollectionTests from "./ICollection";
import Set from "../../../../dist/commonjs/System/Collections/Set";
import Primitive from "../../../../dist/commonjs/System/Primitive";


//noinspection SpellCheckingInspection
ICollectionTests.Collection('Set<' + 'string>', new Set<string>(), [
	"",
	"lorem",
	"ipsum",
	"dolem"
]);

ICollectionTests.Collection('Set<' + 'number>', new Set<number>(), [
	0,
	1,
	2,
	3,
	5,
	7,
	11,
	13
]);


ICollectionTests.Collection('Set<' + 'Primitive>', new Set<Primitive>(), [
	0,
	1,
	2,
	3,
	5,
	7,
	11,
	13,
	"",
	"0",
	"1",
	"2",
	"3",
	"5",
	"7",
	"11",
	"13",
	true,
	false

]);

const sourcePrimitives = [
	1, 2, 1, "1", true, false, "hello", "hello", "hi", true
];
const subset = sourcePrimitives.slice(4);
const superset = sourcePrimitives.slice();
superset.push("NO");
const otherWithIntersect = [1, "1", 4000, "goodbye"];


it("should not repeat entries", ()=>
{
	const s = new Set<Primitive>(sourcePrimitives);

	assert.equal(s.count, 7);

});


describe(".setEquals()", ()=>
{

	it("the current set should equal to the same set and not equal for different sets", ()=>
	{
		const s = new Set<Primitive>(sourcePrimitives);
		const v = sourcePrimitives.slice();
		v[8] = "hola";

		assert.equal(s.setEquals(sourcePrimitives), true, "Exact same set should be equal.");
		assert.equal(s.setEquals(subset), false, "Smaller set should not be equal.");
		assert.equal(s.setEquals(superset), false, "Larger set should not be a equal.");
		assert.equal(s.setEquals(v), false, "Similar set should not be a equal.");
	});

});

describe(".isSupersetOf()", ()=>
{

	it("the current set should be a super set of any equal or smaller set", ()=>
	{
		const s = new Set<Primitive>(sourcePrimitives);

		assert.equal(s.isSupersetOf(sourcePrimitives), true, "Exact same set should be a superset and subset.");
		assert.equal(s.isSupersetOf(subset), true, "Smaller set should be a subset.");
		assert.equal(s.isSupersetOf(superset), false, "Larger set should not be a subset.");
	});

});


describe(".isProperSupersetOf()", ()=>
{

	it("the current set should be a super set of any smaller matching set", ()=>
	{
		const s = new Set<Primitive>(sourcePrimitives);

		assert.equal(s.isProperSupersetOf(sourcePrimitives), false, "Exact same set should not be a proper superset or subset.");
		assert.equal(s.isProperSupersetOf(subset), true, "Smaller set should be a subset.");
		assert.equal(s.isProperSupersetOf(superset), false, "Larger set should not be a subset.");
	});

});

describe(".isSubsetOf()", ()=>
{

	it("the current set should be a sub set of any equal or larger matching set", ()=>
	{
		const s = new Set<Primitive>(sourcePrimitives);

		assert.equal(s.isSubsetOf(sourcePrimitives), true, "Exact same set should be a superset and subset.");
		assert.equal(s.isSubsetOf(subset), false, "Smaller set should be a subset.");
		assert.equal(s.isSubsetOf(superset), true, "Larger set should be a superset.");
	});

});


describe(".isProperSubsetOf()", ()=>
{

	it("the current set should be a sub set of any larger matching set", ()=>
	{
		const s = new Set<Primitive>(sourcePrimitives);

		assert.equal(s.isProperSubsetOf(sourcePrimitives), false, "Exact same set should not be a proper superset or subset.");
		assert.equal(s.isProperSubsetOf(subset), false, "Smaller set should be a subset.");
		assert.equal(s.isProperSubsetOf(superset), true, "Larger set should be a superset.");
	});

});

describe(".exceptWith()", ()=>
{

	it("should remove the specified items front the set", ()=>
	{
		const s = new Set<Primitive>(sourcePrimitives);
		s.exceptWith([1,"1"]);

		assert.equal(s.count, 5);
		assert.equal(s.contains(1), false);
		assert.equal(s.contains("1"), false);
		assert.equal(s.contains("hello"), true);
	});

});

describe(".intersectWith()", ()=>
{

	it("should only leave the intersecting items behind", ()=>
	{
		const s = new Set<Primitive>(sourcePrimitives);
		s.intersectWith(otherWithIntersect);

		assert.equal(s.count, 2);
		assert.equal(s.contains(1), true);
		assert.equal(s.contains("1"), true);
		assert.equal(s.contains("hello"), false);
	});

});

describe(".unionWith()", ()=>
{

	it("should only leave the intersecting items behind", ()=>
	{
		const s = new Set<Primitive>(sourcePrimitives);
		const c = s.count;
		s.unionWith(otherWithIntersect);

		assert.equal(s.count, c+2);
		assert.equal(s.contains(4000), true);
		assert.equal(s.contains("goodbye"), true);
	});

});

describe(".symmetricExceptWith()", ()=>
{

	it("should only leave unique items behind", ()=>
	{
		const s = new Set<Primitive>(sourcePrimitives);
		const c = s.count;
		s.symmetricExceptWith(otherWithIntersect);

		assert.equal(s.count, c-2+2);
		assert.equal(s.contains(4000), true);
		assert.equal(s.contains("goodbye"), true);
		assert.equal(s.contains(1), false);
		assert.equal(s.contains("1"), false);
	});

});