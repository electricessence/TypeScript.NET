///<reference path="../typings/qunit/qunit.d.ts"/>
/// <amd-dependency path="QUnit"/>

import ArrayTests = require('./Arrays/_all');
import EnumerableTests = require('./Enumerable/_all');

ArrayTests();
EnumerableTests();

QUnit.start();
