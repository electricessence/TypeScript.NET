import ICollectionTests = require('./ICollection');
import Queue = require('../../source/System/Collections/Queue');

function run() {
	ICollectionTests.StringCollection('Queue',new Queue<string>());
	ICollectionTests.NumberCollection('Queue',new Queue<number>());
	ICollectionTests.InstanceCollection('Queue',new Queue<Object>());
}

export = run;
