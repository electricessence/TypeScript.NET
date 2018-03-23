import repeatText from "./repeatText";

const EMPTY = '';
const SPACE = ' ';
const ZERO = '0';

export function padStringLeft(source:string, minLength:number, pad:string = SPACE):string
{
	return pad && minLength>0
		? (repeatText(pad, minLength - source.length) + source)
		: source;
}

export function padStringRight(source:string, minLength:number, pad:string = SPACE):string
{
	return pad && minLength>0
		? (source + repeatText(pad, minLength - source.length))
		: source;
}

export function padNumberLeft(source:number, minLength:number, pad:string | number = ZERO):string
{
	if(isNaN(source))
		throw new Error("Cannot pad non-number.");
	return padStringLeft(source + EMPTY, minLength, pad + EMPTY);
}

export function padNumberRight(source:number, minLength:number, pad:string | number = ZERO):string
{
	if(isNaN(source))
		throw new Error("Cannot pad non-number.");
	return padStringRight(source + EMPTY, minLength, pad + EMPTY);
}

export function padLeft(source:string, minLength:number, pad?:string):string
export function padLeft(source:number, minLength:number, pad?:string | number):string
export function padLeft(source:string | number, minLength:number, pad?:any):string
{
	return typeof source=='string'
		? padStringLeft(source, minLength, pad)
		: padNumberLeft(source, minLength, pad);
}

export function padRight(source:string, minLength:number, pad?:string):string
export function padRight(source:number, minLength:number, pad?:string | number):string
export function padRight(source:string | number, minLength:number, pad?:any):string
{
	return typeof source=='string'
		? padStringRight(source, minLength, pad)
		: padNumberRight(source, minLength, pad);
}