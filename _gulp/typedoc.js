
gulp.task(
	TASK.TYPEDOC, function()
	{
		var typedocOptions = {
			name: 'TypeScript.NET',
			out: PATH.DOCS,

			module: MODULE.UMD,
			target: TARGET.ES5,

			excludeNotExported: true,
			includeDeclarations: true,
			ignoreCompilerErrors: false,
			version: true
		};

		// Step 1: Render type-docs..
		console.log('TypeDocs: rendering');
		return gulp
			.src(PATH.SOURCE)
			.pipe(typedoc(typedocOptions))
			;

	});