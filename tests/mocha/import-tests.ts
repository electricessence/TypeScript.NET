///<reference types="node"/>
import "mocha";
import getDirectories from "../../_utility/getDirectories";
import getFiles from "../../_utility/getFiles";

const root = "./tests/mocha";

describe("",()=>{}); // Trick WebStorm into thinking this can be tested.

function importRecursive(path:string = "", importFiles:boolean = false, base:string = "")
{
	const dirPath = base + path;
	if(importFiles) console.log(dirPath);
	getDirectories(root + dirPath)
		.sort()
		.forEach((dirname)=>
		{
			describe(dirname + '/', ()=>
			{
				importRecursive(dirname, true, dirPath + '/');
			});
		});

	if(importFiles)
	{
		const files = getFiles(root + dirPath, '.ts'), count = files.length;

		files
			.sort()
			.forEach((filename)=>
			{
				const filePath = dirPath + '/' + filename;
				console.log(" ", filename);

				const name = filename.replace(/\.js$/, '');

				const i = () =>
				{
					require('./' + filePath);
				};

				// Allows for simple default instead of recursive.
				if(count==1 && name==path) i();
				else describe(name, i);

			});
	}

}
console.log("Importing Tests:");
importRecursive();
