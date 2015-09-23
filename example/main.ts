import ArrayUtility = require('../source/System/Collections/Array/Utility');
import TextUtility = require('../source/System/Text/Utility');

var a = ArrayUtility.initialize(50);
alert(
	TextUtility.supplant(
		'Array Initialized to {i}.',
		{i: a.length}
	)
);

