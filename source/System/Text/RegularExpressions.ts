/*!
 * @author electricessence / https://github.com/electricessence/
 * Named groups based on: http://trentrichardson.com/2011/08/02/javascript-regexp-match-named-captures/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
// NOTE: Avoid real (types/interfaces only = ok) dependencies so this class can be used cleanly.
import {IMap} from "../../IMap";
import {Primitive} from "../Primitive";
import {SelectorWithIndex} from "../FunctionTypes";
import __extendsImport from "../../extends";
// noinspection JSUnusedLocalSymbols
const __extends = __extendsImport;

const EMPTY:string = "";

const _I = 'i', _G = 'g', _M = 'm', _U = 'u', _W = 'w', _Y = 'y';


/**
 * https://msdn.microsoft.com/en-us/library/system.text.regularexpressions.regexoptions%28v=vs.110%29.aspx
 */
export module RegexOptions
{
	export type Global = 'g';
	export type IgnoreCase = 'i';
	export type MultiLine = 'm';
	export type Unicode = 'u';
	export type Sticky = 'y';
	export type IgnorePatternWhitespace = "w";

	export type Literal = Global | IgnoreCase | MultiLine | Unicode | Sticky | IgnorePatternWhitespace;


	/**
	 * Specifies case-insensitive matching. For more information, see the "Case-Insensitive Matching " section in the Regular Expression Options topic.
	 */
	export const IGNORE_CASE:IgnoreCase = _I;
	export const I:IgnoreCase = _I;

	/**
	 * Specifies global matching instead of single.
	 */
	export const GLOBAL:Global = _G;
	export const G:Global = _G;

	/**
	 * treat beginning and end characters (^ and $) as working over multiple lines (i.e., match the beginning or end of each line (delimited by \n or \r), not only the very beginning or end of the whole input string)
	 */
	export const MULTI_LINE:MultiLine = _M;
	export const M:MultiLine = _M;

	/**
	 * treat pattern as a sequence of unicode code points
	 */
	export const UNICODE:Unicode = _U;
	export const U:Unicode = _U;

	/**
	 * matches only from the index indicated by the lastIndex property of this regular expression in the target string (and does not attempt to match from any later indexes).
	 */
	export const STICKY:Sticky = _Y;
	export const Y:Sticky = _Y;

	/**
	 * Modifies the pattern to ignore standard whitespace characters.
	 */
	export const IGNORE_PATTERN_WHITESPACE:IgnorePatternWhitespace = _W;
	export const W:IgnorePatternWhitespace = _W;

}


export class Regex
{
	private readonly _re:RegExp;
	private readonly _keys:string[];

	constructor(
		pattern:string|RegExp,
		options?:RegexOptions.Literal|RegexOptions.Literal[],
		...extra:RegexOptions.Literal[])
	{
		if(!pattern) throw new Error("'pattern' cannot be null or empty.");

		let patternString:string,
		    flags:string
			    = (options && ((options)instanceof(Array) ? options : [options]).concat(extra) || extra)
			    .join(EMPTY)
			    .toLowerCase();

		if(pattern instanceof RegExp)
		{
			let p = <RegExp>pattern;
			if(p.ignoreCase && flags.indexOf(_I)=== -1)
				flags += _I;
			if(p.multiline && flags.indexOf(_M)=== -1)
				flags += _M;
			patternString = p.source;
		}
		else
		{
			patternString = pattern;
		}
		const ignoreWhiteSpace = flags.indexOf(_W)!= -1;

		// For the majority of expected behavior, we need to eliminate global and whitespace ignore.
		flags = flags.replace(/[gw]/g, EMPTY);

		// find the keys inside the pattern, and place in mapping array {0:'key1', 1:'key2', ...}
		const keys:string[] = [];
		{
			let k = patternString.match(/(?!\(\?<)(\w+)(?=>)/g);
			if(k)
			{
				for(let i = 0, len = k.length; i<len; i++)
				{
					keys[i + 1] = k[i];
				}

				// remove keys from regexp leaving standard regexp
				patternString = patternString.replace(/\?<\w+>/g, EMPTY);
				this._keys = keys;
			}

			if(ignoreWhiteSpace)
				patternString = patternString.replace(/\s+/g, "\\s*");

			this._re = new RegExp(patternString, flags);

		}

		Object.freeze(this);
	}

	match(input:string, startIndex:number = 0):Match
	{
		const _ = this;
		let r:RegExpExecArray | null;
		if(!input
			|| startIndex>=input.length
			|| !(r = this._re.exec(input.substring(startIndex))))
			return Match.Empty;

		if(!(startIndex>0)) startIndex = 0;

		const first = startIndex + r.index;
		let loc = first;
		const groups:Group[] = [],
		      groupMap:IMap<Group> = {};

		for(let i = 0, len = r.length; i<len; ++i)
		{
			let text = r[i];
			let g = EmptyGroup;
			if(text!==null || text!== void 0)
			{
				// Empty string might mean \b match or similar.
				g = new Group(text, loc);
				g.freeze();
			}
			if(i && _._keys && i<_._keys.length) groupMap[_._keys[i]] = g;
			groups.push(g);
			if(i!==0) loc += text.length;
		}

		const m = new Match(r[0], first, groups, groupMap);
		m.freeze();
		return m;
	}

	matches(input:string):Match[] //Readonly<Match[]>
	{
		const matches:Match[] = [];
		let m:Match, p = 0;
		const end = input && input.length || 0;
		while(p<end && (m = this.match(input, p)) && m.success)
		{
			matches.push(m);
			p = m.index + m.length;
		}
		Object.freeze(matches);
		return matches;
	}

	replace(
		input:string,
		replacement:Primitive,
		count?:number):string;

	replace(
		input:string,
		evaluator:SelectorWithIndex<Match,Primitive>,
		count?:number):string;

	replace(
		input:string,
		r:any,
		count:number = Infinity):string
	{
		if(!input || r===null || r=== void 0 || !(count>0)) return input;
		const result:string[] = [];
		let p = 0;
		const end = input.length, isEvaluator = typeof r=="function";

		let m:Match, i:number = 0;
		while(i<count && p<end && (m = this.match(input, p)) && m.success)
		{
			let {index, length} = m;
			if(p!==index) result.push(input.substring(p, index));
			result.push(isEvaluator ? r(m, i++) : r);
			p = index + length;
		}

		if(p<end) result.push(input.substring(p));

		return result.join(EMPTY);
	}

	isMatch(input:string):boolean
	{
		return this._re.test(input);
	}

	static isMatch(
		input:string,
		pattern:string,
		options?:RegexOptions.Literal[]):boolean
	{
		const r = new Regex(pattern, options);
		return r.isMatch(input);
	}

	static replace(
		input:string,
		pattern:string,
		replacement:string,
		options?:RegexOptions.Literal[]):string;

	static replace(
		input:string,
		pattern:string,
		evaluator:SelectorWithIndex<Match,Primitive>,
		options?:RegexOptions.Literal[]):string;

	static replace(
		input:string,
		pattern:string,
		e:any,
		options?:RegexOptions.Literal[]):string
	{
		const r = new Regex(pattern, options);
		return r.replace(input, e);
	}
}

export class Capture
{

	get length():number
	{
		const v = this.value;
		return v && v.length || 0;
	}

	constructor(
		public readonly value:string = EMPTY,
		public readonly index:number = -1)
	{
	}

	freeze():void
	{
		Object.freeze(this);
	}
}

export class Group extends Capture
{
	get success():boolean
	{
		return this.index!= -1;
	}

	constructor(
		value:string = EMPTY,
		index:number = -1)
	{
		super(value, index);
	}

	static get Empty():Group
	{
		return EmptyGroup;
	}

}
const EmptyGroup = new Group();
EmptyGroup.freeze();

export class Match extends Group
{

	constructor(
		value:string = EMPTY,
		index:number = -1,
		public readonly groups:Group[] = [],
		public readonly namedGroups:IMap<Group> = {})
	{
		super(value, index);
	}

	freeze():void
	{
		if(!this.groups) throw new Error("'groups' cannot be null.");
		if(!this.namedGroups) throw new Error("'groupMap' cannot be null.");
		Object.freeze(this.groups);
		Object.freeze(this.namedGroups);
		super.freeze();
	}

	static get Empty():Match
	{
		return EmptyMatch;
	}
}
const EmptyMatch = new Match();
EmptyMatch.freeze();


export default Regex;