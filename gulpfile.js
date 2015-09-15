var gulp = require('gulp');

gulp.task('typescript',function(){

	var typescript = require('gulp-typescript');
	var sourcemaps = require('gulp-sourcemaps');

	return gulp
		.src(['source/**/*.ts'])
		.pipe(typescript({
			noImplicitAny: true,
			module:'amd',
			target: 'es5',
			removeComments:true
		}))
		.pipe(gulp.dest('.'));

});


gulp.task('typedoc',function(){

	var typedoc = require('gulp-typedoc');

	return gulp
		.src(['source'])
		.pipe(typedoc({
			name: 'TypeScript.NET',
			out: './documentation',

			module: 'amd',
			target: 'es5',

			ignoreCompilerErrors: false,
			version: true
		}));

});