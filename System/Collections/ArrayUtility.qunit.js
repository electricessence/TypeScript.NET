(function () {

	var ArrayUtility = System.Collections.ArrayUtility;

	// Min/Max tests...
	var minA = -10, maxA = 2000,
		minB = -Infinity, maxB = Infinity;

	var a = [5, minA, -1, maxA, -2, NaN, 20],
		sum = 5 + minA + -1 + maxA + -2 + 20,
		average = sum / 6, // Not including NaN
		product = 5 * minA * -1 * maxA * -2 * 20;

	var b = [5, 2000, maxB, -1, NaN, -10, minB, -2, 20];

	QUnit.test("ArrayUtility.initialize", function (assert) {
		var len;

		len = 100;
		var a = ArrayUtility.initialize(len);
		assert.equal(a.length, len, ".length should be " + len);

		len = 100000;
		var a = ArrayUtility.initialize(len);
		assert.equal(a.length, len, ".length should be " + len);

	});


	QUnit.test("ArrayUtility.copy/equals", function (assert) {
		var s1 = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3];
		var s2 = ArrayUtility.copy(s1);

		assert.ok(ArrayUtility.areEqual(s1, s2));
	});

	QUnit.test("ArrayUtility.contains", function (assert) {
		assert.ok(ArrayUtility.contains(a, -1));
		assert.ok(!ArrayUtility.contains(a, -9876));
	});

	QUnit.test("ArrayUtility.findIndex", function (assert) {
		assert.equal(ArrayUtility.findIndex(a, function (v) { return v == -1; }), 2);
		assert.equal(ArrayUtility.findIndex(a, function (v) { return v == -9876; }), -1);
	});

	QUnit.test("ArrayUtility.register", function (assert) {
		var s = ArrayUtility.copy(a), len = s.length;
		assert.ok(ArrayUtility.register(s, -9876));
		assert.equal(s.length, len + 1);
		len = s.length;

		assert.ok(!ArrayUtility.register(s, -1));
		assert.equal(s.length, len);
	});


	QUnit.test("ArrayUtility.remove", function (assert) {
		var s = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3];
		var len = s.length;

		assert.equal(ArrayUtility.remove(s, 9), 1, "Only 9 removed once");
		assert.equal(s.length, len - 1, ".length should be less by one");
		assert.equal(s[1], 8, "Index [1] is now 8");
		len = s.length;

		assert.equal(ArrayUtility.remove(s, 2), 2, "2 removed twice");
		assert.equal(s.length, len - 2, ".length should be less by two");
		assert.equal(s[7], 1, "Index [7] is now 1");
		assert.equal(s[10], 3, "Index [10] is now 3");
		len = s.length;

		assert.equal(ArrayUtility.remove(s, 15), 0, "15 does not exist");
		assert.equal(s.length, len, ".length should be the same");
		len = s.length;

		assert.ok(ArrayUtility.removeIndex(s, 5), "Index [5] removed");
		assert.equal(s.length, len - 1, ".length should be less by one");
		len = s.length;

		assert.ok(!ArrayUtility.removeIndex(s, 15), "Index [15] doesn't exist");
		assert.equal(s.length, len, ".length should be the same");
	});

	/*	ArrayUtility.applyTo skipped.
		It has too many permutations while being a straight forward function. */

	QUnit.test("ArrayUtility.remove", function (assert) {
		var s = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1, 2, 3];
		var len = s.length;

		assert.equal(ArrayUtility.remove(s,9), 1, "Only 9 removed once");
		assert.equal(s.length, len - 1, ".length should be less by one");
		assert.equal(s[1], 8, "Index [1] is now 8");
		len = s.length;

		assert.equal(ArrayUtility.remove(s,2), 2, "2 removed twice");
		assert.equal(s.length, len - 2, ".length should be less by two");
		assert.equal(s[7], 1, "Index [7] is now 1");
		assert.equal(s[10], 3, "Index [10] is now 3");
		len = s.length;

		assert.equal(ArrayUtility.remove(s,15), 0, "15 does not exist");
		assert.equal(s.length, len, ".length should be the same");
		len = s.length;

		assert.ok(ArrayUtility.removeIndex(s, 5), "Index [5] removed");
		assert.equal(s.length, len - 1, ".length should be less by one");
		len = s.length;

		assert.ok(!ArrayUtility.removeIndex(s, 15), "Index [15] doesn't exist");
		assert.equal(s.length, len, ".length should be the same");
	});


	QUnit.test("ArrayUtility.repeat", function (assert) {
		var value = 10, count = 3;
		var r = ArrayUtility.repeat(value, count);
		assert.ok(r.length == count, ".length should be 3");
		for (var i = 0; i < count; i++)
			assert.equal(r[i], value);
	});


	QUnit.test("ArrayUtility.sum", function (assert) {
		assert.ok(isNaN(ArrayUtility.sum(a, false)), "Sum should be NaN");
		assert.equal(ArrayUtility.sum(a, true), sum, "Sum should be " + sum);
	});

	QUnit.test("ArrayUtility.average", function (assert) {
		assert.ok(isNaN(ArrayUtility.average(a, false)), "Average should be NaN");
		assert.equal(ArrayUtility.average(a, true), average, "Average should be " + average);
	});


	QUnit.test("ArrayUtility.product", function (assert) {
		assert.ok(isNaN(ArrayUtility.product(a, false)), "Product should be NaN");
		assert.equal(ArrayUtility.product(a, true), product, "Product should be " + product);
	});


	QUnit.test("ArrayUtility.min", function (assert) {
		assert.ok(isNaN(ArrayUtility.min(a, false)), "Min value should be NaN");
		assert.equal(ArrayUtility.min(a, true),minA, "Min value should be "+minA);
		assert.equal(ArrayUtility.min(b, true), minB, "Min value should be " + minB);
	});

	QUnit.test("ArrayUtility.max", function (assert) {
		assert.ok(isNaN(ArrayUtility.max(a, false)), "Min value should be NaN");
		assert.equal(ArrayUtility.max(a, true), maxA, "Min value should be "+maxA);
		assert.equal(ArrayUtility.max(b, true), maxB, "Min value should be "+maxB);
	});


})();