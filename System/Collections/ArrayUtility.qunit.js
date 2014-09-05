(function () {

	var ArrayUtility = System.Collections.ArrayUtility;

	var a = [5,2000,-1,-10,-2,20];

	QUnit.test("ArrayUtility.min", function (assert) {
		assert.ok(ArrayUtility.min(a)==-10);
	});

	QUnit.test("ArrayUtility.max", function (assert) {
		assert.ok(ArrayUtility.max(a)==2000);
	});

	var b = [5,2000,Infinity,-1,-10,-Infinity,-2,20];

	QUnit.test("ArrayUtility.min", function (assert) {
		assert.ok(ArrayUtility.min(b)==-Infinity);
	});

	QUnit.test("ArrayUtility.max", function (assert) {
		assert.ok(ArrayUtility.max(a)==Infinity);
	});


})();