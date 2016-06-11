import * as TASK from "./constants/TaskNames";
import * as gulp from "gulp";
import * as fs from "fs";

gulp.task(TASK.NUGET_PACK,
	// [
	// 	TASK.BUILD
	// ],
	(callback:()=>void)=>
	{

		var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
		require("gulp-nuget-pack")({
				id: "TypeScript.NET.Library",
				title: "TypeScript.NET",
				version: pkg.version,
				authors: "https://github.com/electricessence/",
				description: pkg.description,
				summary: "See http://electricessence.github.io/TypeScript.NET/ for details.",
				language: "en-us",
				projectUrl: "https://github.com/electricessence/TypeScript.NET",
				licenseUrl: "https://raw.githubusercontent.com/electricessence/TypeScript.NET/master/LICENSE.md",
				tags: pkg.keywords.join(" "),
				excludes: [],
				outputDir: ".nuget"
			},

			[
				'source',
				'dist',
				'*.md'
			],

			callback
		);
	});
