/*!
 * @author electricessence / https://github.com/electricessence/
 * Named groups based on: http://trentrichardson.com/2011/08/02/javascript-regexp-match-named-captures/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IMap } from "../../IMap";
import { Primitive } from "../Primitive";
import { SelectorWithIndex } from "../FunctionTypes";
/**
 * https://msdn.microsoft.com/en-us/library/system.text.regularexpressions.regexoptions%28v=vs.110%29.aspx
 */
export declare module RegexOptions {
    type Global = 'g';
    type IgnoreCase = 'i';
    type MultiLine = 'm';
    type Unicode = 'u';
    type Sticky = 'y';
    type IgnorePatternWhitespace = "w";
    type Literal = Global | IgnoreCase | MultiLine | Unicode | Sticky | IgnorePatternWhitespace;
    /**
     * Specifies case-insensitive matching. For more information, see the "Case-Insensitive Matching " section in the Regular Expression Options topic.
     */
    const IGNORE_CASE: IgnoreCase;
    const I: IgnoreCase;
    /**
     * Specifies global matching instead of single.
     */
    const GLOBAL: Global;
    const G: Global;
    /**
     * treat beginning and end characters (^ and $) as working over multiple lines (i.e., match the beginning or end of each line (delimited by \n or \r), not only the very beginning or end of the whole input string)
     */
    const MULTI_LINE: MultiLine;
    const M: MultiLine;
    /**
     * treat pattern as a sequence of unicode code points
     */
    const UNICODE: Unicode;
    const U: Unicode;
    /**
     * matches only from the index indicated by the lastIndex property of this regular expression in the target string (and does not attempt to match from any later indexes).
     */
    const STICKY: Sticky;
    const Y: Sticky;
    /**
     * Modifies the pattern to ignore standard whitespace characters.
     */
    const IGNORE_PATTERN_WHITESPACE: IgnorePatternWhitespace;
    const W: IgnorePatternWhitespace;
}
export declare class Regex {
    private readonly _re;
    private readonly _keys;
    constructor(pattern: string | RegExp, options?: RegexOptions.Literal | RegexOptions.Literal[], ...extra: RegexOptions.Literal[]);
    match(input: string, startIndex?: number): Match;
    matches(input: string): Match[];
    replace(input: string, replacement: Primitive, count?: number): string;
    replace(input: string, evaluator: SelectorWithIndex<Match, Primitive>, count?: number): string;
    isMatch(input: string): boolean;
    static isMatch(input: string, pattern: string, options?: RegexOptions.Literal[]): boolean;
    static replace(input: string, pattern: string, replacement: string, options?: RegexOptions.Literal[]): string;
    static replace(input: string, pattern: string, evaluator: SelectorWithIndex<Match, Primitive>, options?: RegexOptions.Literal[]): string;
}
export declare class Capture {
    readonly value: string;
    readonly index: number;
    readonly length: number;
    constructor(value?: string, index?: number);
    freeze(): void;
}
export declare class Group extends Capture {
    readonly success: boolean;
    constructor(value?: string, index?: number);
    static readonly Empty: Group;
}
export declare class Match extends Group {
    readonly groups: Group[];
    readonly namedGroups: IMap<Group>;
    constructor(value?: string, index?: number, groups?: Group[], namedGroups?: IMap<Group>);
    freeze(): void;
    static readonly Empty: Match;
}
export default Regex;
