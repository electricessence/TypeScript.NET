///<reference path="../typings/requirejs/require.d.ts"/>
requirejs.config(
	{
		baseUrl: '../'
	}
);
require(
	[
		'min/System/Collections/Arrays/Utility'
	], function(ArrayUtil) {
		var a = ArrayUtil.initialize(50);
		alert(a.length);
	}
);