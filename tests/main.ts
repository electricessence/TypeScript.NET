///<reference path="../typings/qunit/qunit.d.ts"/>
/// <amd-dependency path="QUnit"/>

import ArrayTests = require('./Arrays/_all');
import CollectionTests = require('./Collections/_all');
import EnumerableTests = require('./Linq/_all');

ArrayTests();
CollectionTests();
EnumerableTests();

QUnit.start();
