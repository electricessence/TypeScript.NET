requirejs.config(
	{
		baseUrl: '../'
	}
);
require(
	[
		'source/System/Collections/Arrays/Utility'
	],

	function(ArrayUtil) {
		var a = ArrayUtil.initialize(50);
		alert(a.length);
	}
);