
// These paths show how each module identifies itself.
requirejs.config({
	paths:
		{
			"TypeScript.NET/System": "System",
			"TypeScript.NET/System.Linq":"System.Linq"
		}
});


requirejs(["TypeScript.NET/System.Linq"], function (Linq) {
	alert("Enumerable" in Linq?"Success.":"Fail.");
});