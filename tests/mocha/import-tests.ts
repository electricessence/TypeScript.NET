import * as fs from "fs";

const root = "./tests/mocha/";

function getFilesAt(path:string, ext?:string):string[]
{
	return fs
		.readdirSync(path)
		.filter((name)=>
		(!ext || name.lastIndexOf(ext)==name.length - ext.length)
		&& fs.statSync(path + '/' + name).isFile());
}

function getDirectoriesAt(path:string):string[]
{
	return fs
		.readdirSync(path)
		.filter((name)=>fs.statSync(path + '/' + name).isDirectory());
}

function importRecursive(path:string = "", importFiles:boolean = false, base:string = "")
{
	const dirPath = base + path;
	if(importFiles) console.log(dirPath);
	getDirectoriesAt(root + dirPath)
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
		const files = getFilesAt(root + dirPath, '.js'), count = files.length;

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
