///<reference path="../../../typings/qunit/qunit.d.ts"/>
///<amd-dependency path="QUnit"/>

import Enumerable = require('System.Linq/Enumerable');

interface TestItem {
	a:number;
	b:number;
	c:string;
}

function run() {

	var source:{a:number,b:number,c:string}[] = [
		{
			a: 1,
			b: 2,
			c: "a"
		},
		{
			a: 1,
			b: 1,
			c: "b"
		},
		{
			a: 1,
			b: 3,
			c: "c"
		},
		{
			a: 2,
			b: 2,
			c: "d"
		},
		{
			a: 2,
			b: 1,
			c: "e"
		},
		{
			a: 2,
			b: 3,
			c: "f"
		}
	];

	var sourceEnumerable = Enumerable.fromArray(source);
	var selector = function (i:TestItem):number { return i.b };

	QUnit.test("Enumerable.memoize", function (assert) {

		var source = sourceEnumerable;
		var A = source.memoize();

		var sum = A.sum(selector);

		assert.equal(sum, source.sum(selector), "Values must be equal after memoize pass 1.");

		sum = A.sum(selector);
		assert.equal(sum, source.sum(selector), "Values must be equal after memoize pass 2.");
	});

	QUnit.test("Enumerable.where.memoize", function (assert) {
		var source = sourceEnumerable.where(function(i){return i.a==1});

		var sum:number, A = source;

		sum = A.sum(selector);

		assert.equal(sum, source.sum(selector), "Values must be equal after where pass 1.");

		sum = A.sum(selector);
		assert.equal(sum, source.sum(selector), "Values must be equal after where pass 2.");


		A = source.memoize();

		sum = A.sum(selector);

		assert.equal(sum, source.sum(selector), "Values must be equal after memoize pass 1.");

		sum = A.sum(selector);
		assert.equal(sum, source.sum(selector), "Values must be equal after memoize pass 2.");

	});

	QUnit.test("Enumerable.orderBy", function (assert) {

		var source = sourceEnumerable.reverse();

		var A = source.orderBy(function (o) { return o.a }).toArray();
		for (var i = 0; i < 3;i++)
			assert.equal(A[i].a, 1, "First three 'a' values should be 1 when ordered by 'a'.");
		for (var i = 3; i < 6; i++)
			assert.equal(A[i].a, 2, "Last three 'a' values should be 2 when ordered by 'a'.");

		var B = source.orderBy(function (o) { return o.b }).toArray();
		for (var i = 0; i < 2; i++)
			assert.equal(B[i].b, 1, "First two 'b' values should be 1 when ordered by 'b'.");
		for (var i = 2; i < 4; i++)
			assert.equal(B[i].b, 2, "Second two 'b' values should be 2 when ordered by 'b'.");
		for (var i = 4; i < 6; i++)
			assert.equal(B[i].b, 3, "Last two 'b' values should be 3 when ordered by 'b'.");

	});


	QUnit.test("Enumerable.orderByDescending", function (assert) {

		var source = sourceEnumerable.reverse();

		var A = source.orderByDescending(function (o) { return o.a }).toArray();
		for (var i = 0; i < 3; i++)
			assert.equal(A[i].a, 2, "First three 'a' values should be 2 when ordered by 'a'.");
		for (var i = 3; i < 6; i++)
			assert.equal(A[i].a, 1, "Last three 'a' values should be 1 when ordered by 'a'.");

		var B = source.orderByDescending(function (o) { return o.b }).toArray();
		for (var i = 0; i < 2; i++)
			assert.equal(B[i].b, 3, "First two 'b' values should be 3 when ordered by 'b'.");
		for (var i = 2; i < 4; i++)
			assert.equal(B[i].b, 2, "Second two 'b' values should be 2 when ordered by 'b'.");
		for (var i = 4; i < 6; i++)
			assert.equal(B[i].b, 1, "Last two 'b' values should be 1 when ordered by 'b'.");

	});

	QUnit.test("Enumerable.orderBy.thenBy", function (assert) {

		var B = sourceEnumerable
			.orderBy(function (o) { return o.b })
			.thenBy(function (o) { return o.c })
			.toArray();

		for (var i = 0; i < 2; i++)
			assert.equal(B[i].b, 1, "First two 'b' values should be 1 when ordered by 'b'.");
		for (var i = 2; i < 4; i++)
			assert.equal(B[i].b, 2, "Second two 'b' values should be 2 when ordered by 'b'.");
		for (var i = 4; i < 6; i++)
			assert.equal(B[i].b, 3, "Last two 'b' values should be 3 when ordered by 'b'.");

		assert.equal(B[0].c, "b");
		assert.equal(B[1].c, "e");

		assert.equal(B[2].c, "a");
		assert.equal(B[3].c, "d");

		assert.equal(B[4].c, "c");
		assert.equal(B[5].c, "f");


	});



}

export = run;
