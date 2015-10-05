///<reference path="../../typings/qunit/qunit.d.ts"/>
/// <amd-dependency path="QUnit"/>

import LinkedList = require('./LinkedList');
import Queue = require('./Queue');
import OrderedStringKeyDictionary = require('./OrderedStringKeyDictionary');

function run()
{
	LinkedList();
	Queue();
	OrderedStringKeyDictionary();
}

export = run;
