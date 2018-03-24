/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
/**
 * Utility for quick validation/invalidation of array equality.
 * Why this way?  Why not pass a closure for the last return?
 * Reason: Performance and avoiding the creation of new functions/closures.
 * @param {ArrayLike<any>} a
 * @param {ArrayLike<any>} b
 * @returns {boolean | number}
 */
export default function validateSize(a: ArrayLike<any>, b: ArrayLike<any>): boolean | number;
