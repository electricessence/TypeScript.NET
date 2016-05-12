/*!
 * @author electricessence / https://github.com/electricessence/
 * Named groups based on: http://trentrichardson.com/2011/08/02/javascript-regexp-match-named-captures/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

///<reference path="../Collections/Dictionaries/IDictionary"/>

// NOTE: Avoid dependencies so this class can be used cleanly.

const EMPTY:string = "";
const UNDEFINED:string = "undefined";


/**
 * https://msdn.microsoft.com/en-us/library/system.text.regularexpressions.regexoptions%28v=vs.110%29.aspx
 */
export module RegexOptions
{
	/**
	 * Specifies case-insensitive matching. For more information, see the "Case-Insensitive Matching " section in the Regular Expression Options topic.
	 */
	export const IGNORE_CASE:string = 'i';

	/**
	 * Specifies global matching instead of single.
	 */
	export const GLOBAL:string = 'g';

	/**
	 * treat beginning and end characters (^ and $) as working over multiple lines (i.e., match the beginning or end of each line (delimited by \n or \r), not only the very beginning or end of the whole input string)
	 */
	export const MULTI_LINE:string = 'm';

	/**
	 * treat pattern as a sequence of unicode code points
	 */
	export const UNICODE:string = 'u';

	/**
	 * matches only from the index indicated by the lastIndex property of this regular expression in the target string (and does not attempt to match from any later indexes).
	 */
	export const STICKY:string = 'y';

	export type Global = 'g';
	export type IgnoreCase = 'i';
	export type MultiLine = 'm';
	export type Unicode = 'u';
	export type Sticky = 'y';

	export type Literal = Global | IgnoreCase | MultiLine | Unicode | Sticky;
}

export interface MatchEvaluator
{
	//(match:Match):string;
	(substring:string, ...args:any[]):string;
}

export class Regex
{
	private _re:RegExp;
	private _keys:string[];

	constructor(
		pattern:string|RegExp,
		options?:RegexOptions.Literal[])
	{
		if(!pattern) throw new Error("'pattern' cannot be null or empty.");
		var patternString:string, flags:string = options && options.join(EMPTY) || EMPTY;

		if(pattern instanceof RegExp)
		{
			let p = <RegExp>pattern;
			if(p.ignoreCase && flags.indexOf(RegexOptions.IGNORE_CASE)=== -1) flags
				+= RegexOptions.IGNORE_CASE;
			if(p.multiline && flags.indexOf(RegexOptions.MULTI_LINE)=== -1) flags
				+= RegexOptions.MULTI_LINE;
			patternString = p.source;
		}
		else
		{
			patternString = pattern;
		}

		// For the majority of expected behavior, we need to eliminate global.
		flags = flags.replace(RegexOptions.GLOBAL, EMPTY);

		// find the keys inside the pattern, and place in mapping array {0:'key1', 1:'key2', ...}
		var keys:string[] = [];
		{
			let k = patternString.match(/(?!\(\?<)(\w+)(?=>)/g);
			if(k)
			{
				for(let i = 0, len = k.length; i<len; i++)
				{
					keys[i+1] = k[i];
				}

				this._keys = keys;
				// remove keys from regexp leaving standard regexp
				this._re = new RegExp(patternString.replace(/\?<\w+>/g, EMPTY), flags);
			}
			else
			{
				this._keys = null;
				this._re = new RegExp(patternString, flags);
			}
		}

		Object.freeze(this);
	}

	match(input:string):Match
	{
		var _ = this;
		var r = this._re.exec(input);
		if(!r) return Match.Empty;

		var loc                  = r.index,
		    groups:Group[]       = [],
		    groupMap:IMap<Group> = {};

		for(let i = 0, len = r.length; i<len; ++i)
		{
			let text = typeof r[i]!==UNDEFINED && r[i].constructor===String ? r[i] : EMPTY;
			let g = new Group(text, loc);
			g.freeze();
			if(i && _._keys && i<_._keys.length) groupMap[_._keys[i]] = g;
			groups.push(g);
			if(i!==0) loc += text.length;
		}

		var m = new Match(r[0], r.index, groups, groupMap);
		m.freeze();
		return m;
	}

	matches(input:string):Match[]
	{
		var matches:Match[] = [], m:Match;
		while((m = this.match(input)) && m.success) {
			matches.push(m);
			input = input.substring(m.index+m.length);
		}

		return matches;
	}

	replace(
		input:string,
		replacement:string):string;

	replace(
		input:string,
		evaluator:MatchEvaluator):string;

	replace(
		input:string, r:any):string
	{
		return input.replace(this._re, r);
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
		var r = new Regex(pattern, options);
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
		evaluator:MatchEvaluator,
		options?:RegexOptions.Literal[]):string;

	static replace(
		input:string,
		pattern:string,
		e:any,
		options?:RegexOptions.Literal[]):string
	{
		var r = new Regex(pattern, options);
		return r.replace(input, e);
	}
}

export class Capture
{

	get length():number
	{
		var v = this.value;
		return v && v.length || 0;
	}

	constructor(
		public value:string = EMPTY,
		public index:number = -1)
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

export class Match extends Group
{

	constructor(
		value:string = EMPTY,
		index:number = -1,
		public groups:Group[] = [],
		public namedGroups:IMap<Group> = {})
	{
		super(value, index);
	}

	freeze():void
	{
		if(!this.groups) throw new Error("'groups' cannot be null.");
		if(!this.namedGroups) throw new Error("'groupMap' cannot be null.");
		Object.freeze(this.groups.slice());
		Object.freeze(this.namedGroups);
		super.freeze();
	}

	static get Empty():Match
	{
		return EmptyMatch;
	}
}
const EmptyMatch = new Match();




export default Regex;