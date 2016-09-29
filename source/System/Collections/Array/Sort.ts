import {createComparer} from "./Sort/createComparer";
export * from "./Sort/quickSort";

export {
	createComparer,
	createComparer as default, // Allow for default import.
	createComparer as by // Alias for Sort.by(...) instead of Sort.createComparer
}