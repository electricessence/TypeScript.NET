import ArrayUtility = require('../source/System/Collections/Array/Utility');
import Text = require('../source/System/Text/Utility');
import supplant = Text.supplant;

var a = ArrayUtility.initialize(50);
alert(
	supplant(
		'Array Initialized to {i}.',
		{i: a.length}
	)
);

