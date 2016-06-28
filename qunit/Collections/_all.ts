/// <reference path="../../../typings/qunit/qunit.d.ts"/>
/// <amd-dependency path="QUnit"/>

import LinkedList from "./LinkedList";
import Queue from "./Queue";
import OrderedStringKeyDictionary from "./OrderedStringKeyDictionary";

export default function run()
{
	LinkedList();
	Queue();
	OrderedStringKeyDictionary();
}
