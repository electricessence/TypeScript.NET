var gulp = require('gulp');
var shell = require('gulp-shell');
var typescript = require('gulp-tsc');


gulp.task(
	'compile', function() {
		return gulp.src('**/*.ts')
			.pipe(typescript({target: 'es5', sourcemap: true, removeComments:true, noImplicityAny:true}))
			.pipe(gulp.dest('../build'));
	});


gulp.task(
	'compile.min', ['compile'], function() { // Have 'compile' as a dependency to ensure constraints.
		//return gulp.src('source/**/*.ts')
		//	.pipe(typescript({target: 'es5', module: 'amd', sourcemap: true}))
		//	.pipe(gulp.dest('../build'));
	});

gulp.task(
	'default', ['compile','compile.min'], function() {
		console.log("All done");
	});