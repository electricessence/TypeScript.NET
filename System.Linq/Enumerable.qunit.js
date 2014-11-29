(function () {

	var Enumerable = System.Linq.Enumerable;

	var source = [
		{
			a: 1,
			b: 2
		},
		{
			a: 1,
			b: 1
		},
		{
			a: 1,
			b: 3
		},
		{
			a: 2,
			b: 2
		},
		{
			a: 2,
			b: 1
		},
		{
			a: 2,
			b: 3
		},
	];

	var sourceEnumerable = Enumerable.fromArray(source);
	var selector = function (i) { return i.b };

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

		var A = source;

		var sum = A.sum(selector);

		assert.equal(sum, source.sum(selector), "Values must be equal after where pass 1.");

		sum = A.sum(selector);
		assert.equal(sum, source.sum(selector), "Values must be equal after where pass 2.");


		A = source.memoize();

		var sum = A.sum(selector);

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

})();