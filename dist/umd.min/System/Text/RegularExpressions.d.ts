/*!
 * @author electricessence / https://github.com/electricessence/
 * Named groups based on: http://trentrichardson.com/2011/08/02/javascript-regexp-match-named-captures/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
import { IMap } from "../Collections/Dictionaries/IDictionary";
import { Primitive } from "../Primitive";
import { Selector } from "../FunctionTypes";
export declare module RegexOptions {
    const IGNORE_CASE: string;
    const I: string;
    const GLOBAL: string;
    const G: string;
    const MULTI_LINE: string;
    const M: string;
    const UNICODE: string;
    const U: string;
    const STICKY: string;
    const Y: string;
    const IGNORE_PATTERN_WHITESPACE: string;
    const W: string;
    type Global = 'g';
    type IgnoreCase = 'i';
    type MultiLine = 'm';
    type Unicode = 'u';
    type Sticky = 'y';
    type IgnorePatternWhitespace = "w";
    type Literal = Global | IgnoreCase | MultiLine | Unicode | Sticky | IgnorePatternWhitespace;
}
export interface MatchEvaluator extends Selector<Match, Primitive> {
}
export declare class Regex {
    private _re;
    private _keys;
    constructor(pattern: string | RegExp, options?: RegexOptions.Literal | RegexOptions.Literal[], ...extra: RegexOptions.Literal[]);
    match(input: string, startIndex?: number): Match;
    matches(input: string): Match[];
    replace(input: string, replacement: Primitive, count?: number): string;
    replace(input: string, evaluator: MatchEvaluator, count?: number): string;
    isMatch(input: string): boolean;
    static isMatch(input: string, pattern: string, options?: RegexOptions.Literal[]): boolean;
    static replace(input: string, pattern: string, replacement: string, options?: RegexOptions.Literal[]): string;
    static replace(input: string, pattern: string, evaluator: MatchEvaluator, options?: RegexOptions.Literal[]): string;
}
export declare class Capture {
    value: string;
    index: number;
    length: number;
    constructor(value?: string, index?: number);
    freeze(): void;
}
export declare class Group extends Capture {
    success: boolean;
    constructor(value?: string, index?: number);
    static Empty: Group;
}
export declare class Match extends Group {
    groups: Group[];
    namedGroups: IMap<Group>;
    constructor(value?: string, index?: number, groups?: Group[], namedGroups?: IMap<Group>);
    freeze(): void;
    static Empty: Match;
}
export default Regex;
