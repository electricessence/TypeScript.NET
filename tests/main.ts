///<reference path="../typings/qunit/qunit.d.ts"/>
/// <amd-dependency path="QUnit"/>

import ArrayTests from './Arrays/_all';
import CollectionTests from './Collections/_all';
import EnumerableTests from './Linq/_all';
import UriTests from './Uri/_all';

UriTests();
ArrayTests();
CollectionTests();
EnumerableTests();

QUnit.start();
