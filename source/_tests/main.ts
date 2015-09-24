///<reference path="../../typings/qunit/qunit.d.ts"/>
/// <amd-dependency path="QUnit"/>

import ArrayUtilityTests = require('./Arrays/tests');
import EnumerableTests = require('./Enumerable/tests');

ArrayUtilityTests();
EnumerableTests();

QUnit.start();
