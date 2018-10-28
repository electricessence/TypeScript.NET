///<reference types="node"/>
import * as assert from "assert";
import "mocha";
import {InfiniteLinqEnumerable, LinqEnumerable} from "../../../dist/commonjs/System.Linq/Linq";
import List from "../../../dist/commonjs/System/Collections/List";
import CollectionBase from "../../../dist/commonjs/System/Collections/CollectionBase";
import __extendsImport from "../../../dist/commonjs/extends";
// noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;

class A {
	constructor() {

	}
}

class B extends A {
	constructor() {
		super();
	}
}

describe("Verify instanceof usability", () =>
{
	it("should work with built in classes", () =>
	{
		assert.ok([] instanceof Array);
	});

	it("should work with standard inheritance", () =>
	{
		assert.ok(new B() instanceof A);
	});

	it("should work same module inheritance", () =>
	{
		assert.ok(new LinqEnumerable(<any>(()=>{})) instanceof InfiniteLinqEnumerable);
	});

	it("should work cross module inheritance", () =>
	{
		assert.ok(new List() instanceof CollectionBase);
	});

});