const splitExpr            = /(?<!["'][\d\w ]) (?![\d\w ]*["'])/g;
const whitespace           = '(?: |(?:\t)|(?:\n))';
const trimStartWhitespace  = new RegExp('^' + whitespace + '+');
const trimEndWhitespace    = new RegExp(whitespace + '+$');
const trimEqualsWhitespace = new RegExp(whitespace + '*=' + whitespace + '*', 'g');
const trimAttrWhitespace   = new RegExp('(?!["\'])' + whitespace + '+', 'g');


/**
 * Removes the following from arrays of strings.
 *
 * empty space, newlines and tabs from the beginning and end of a string.
 *
 * empty space, newlines and tabs between each side of a `=`
 *
 * empty space, newlines and tabs in the beginning and end of a quote.
 */
export const trimInPlace = (...strings: string[][]) => {
	for (const arr of strings) {
		for (let i = 0; i < arr.length; i++) {
			arr[i] = arr[i]!
				.replace(trimStartWhitespace, '')
				.replace(trimEndWhitespace, '')
				.replaceAll(trimEqualsWhitespace, '=')
				.replaceAll(trimAttrWhitespace, ' ');
		}
	}
};


/**
 * Takes a trimmed string of attributes and splits it into an array of key/value? strings.
 *
 * @param rawAttributes string of attributes delimited by a single space.
 *
 * @example
 * const input = 'id="1" label="label goes here" checked count=4 final='
 * const output = ['id="1"', 'label="label goes here"', 'checked', 'count=4', 'final=']
 */
export const splitAttributes = (rawAttributes: string) => {
	return rawAttributes.split(splitExpr);
};
