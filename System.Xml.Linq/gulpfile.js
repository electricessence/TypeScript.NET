var gulp = require('gulp');

// Initialize the tasks array.
var tasks = [];

// Setup the function to append the task names to the array.
function addTask(task,namespace,dependencies) { tasks = tasks.concat(require('../gulp-tasks/' + task)(gulp)(namespace,dependencies)); }

// Add the task to gulp.
addTask('compile-namespace','System.Xml.Linq',['System','System.Linq']);

gulp.task( 'default', tasks );
