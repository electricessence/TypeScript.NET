///<reference path="../typings/qunit/qunit.d.ts"/>
/// <amd-dependency path="QUnit"/>

import ArrayTests = require('./Arrays/_all');
import CollectionTests = require('./Collections/_all');
import EnumerableTests = require('./Linq/_all');
import UriTests = require('./Uri/_all');

UriTests();
ArrayTests();
CollectionTests();
EnumerableTests();

QUnit.start();
