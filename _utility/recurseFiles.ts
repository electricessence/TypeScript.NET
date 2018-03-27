/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */

///<reference types="node"/>
import "mocha";
import getDirectories from "./getDirectories";
import getFiles from "./getFiles";

/**
 * Recursively reads all file names and stops if the handler returns false.
 * @param {string} path
 * @param {(filePath: string) => (void | boolean)} handler
 * @returns {boolean} TRUE if the handler never returned false and all file names were processed.  FALSE if interrupted by handler returning false.
 */
export default function recurseFiles(
	path:string,
	handler:(filePath:string) => void | boolean):boolean {
	return getDirectories(path)
		.sort()
		.every((dirname) => {
			const dirPath = path + '/' + dirname;
			return recurseFiles(dirPath, handler)!==false
				&& getFiles(dirPath)
					.sort()
					.every((fileName) => {
						const filePath = dirPath + '/' + fileName;
						return handler(filePath)!==false;
					});
		});
}
