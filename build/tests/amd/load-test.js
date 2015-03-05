requirejs(
	// First verify that requirejs correctly pulls in System as a dependency.
	['System', 'System.Linq'], function(System, Linq) {
		alert(('Collections' in System && 'Enumerable' in Linq) ? 'Success.' : 'Fail.');
	});