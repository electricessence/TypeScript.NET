/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

import recurseFiles from "./recurseFiles";

export default function getFilesRecursive(path:string):string[] {
	const result:string[] = [];
	recurseFiles(path, fileName => { result.push(fileName);});
	return result;
}
