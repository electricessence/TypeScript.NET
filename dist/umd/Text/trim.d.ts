/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
/**
 * Can trimEntries any character or set of characters from the ends of a string.
 * Uses a Regex escapement to replace them with empty.
 * @param source
 * @param chars A string or array of characters desired to be trimmed.
 * @param ignoreCase
 * @returns {string}
 */
export default function trim(source: string, chars?: string | string[], ignoreCase?: boolean): string;
