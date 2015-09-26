import ICollectionTests = require('./ICollection');
import LinkedList = require('../../source/System/Collections/LinkedList');

function run() {
	ICollectionTests.StringCollection('LinkedList',new LinkedList<string>());
	ICollectionTests.NumberCollection('LinkedList',new LinkedList<number>());
	ICollectionTests.InstanceCollection('LinkedList',new LinkedList<Object>());
}

export = run;
