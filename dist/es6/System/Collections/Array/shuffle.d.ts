import { ArrayLikeWritable } from "./ArrayLikeWritable";
/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
export declare function shuffle<T extends ArrayLikeWritable<any>>(target: T): T;
