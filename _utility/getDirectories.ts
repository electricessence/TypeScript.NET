/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */


import * as fs from "fs";

export default function getDirectories(path:string):string[]
{
	return fs
		.readdirSync(path)
		.filter((name)=>fs.statSync(path + '/' + name).isDirectory());
}