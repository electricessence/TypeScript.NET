/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import * as fs from "fs";

export default function getFiles(path:string, ext?:string):string[]
{
	return fs
		.readdirSync(path)
		.filter((name)=>
			(!ext || name.lastIndexOf(ext)==name.length - ext.length)
			&& fs.statSync(path + '/' + name).isFile());
}
