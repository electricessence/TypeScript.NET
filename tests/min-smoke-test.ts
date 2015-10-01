
// This should demonstrate the the minified versions are working and can be debugged with source-maps.
import ArrayUtility = require('../min/System/Collections/Array/Utility');
import TextUtility = require( '../min/System/Text/Utility');

var a = ArrayUtility.initialize(50);
alert(TextUtility.supplant('Array Initialized to {i}.', {i: a.length}));

