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

})();