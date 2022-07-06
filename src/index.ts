// TODO:
//   - NOT operation like with regex-not package.
//   - Caching like with the regex-cache package.

/**
 * Template tag function to make composing regexes easier.
 *
 * @example
 *
 *   import {r} from 'regexr'
 *   const regex1 = r`/(this|that)*$/m`
 *   const regex2 = r`/something|other_${regex1}/g`
 *   console.log(regex2) // /something|other_(this|that)*$/g
 */
export function regexr<T extends TemplateStringsArray>(literals: T, ...substitutions: any[]) {
	let result = ''
	let flags = ''

	// We get the raw string that the user typed so that they don't have to
	// escape backslashes, etc, inside of the regex. Awesome!!
	const rawLiterals = [...literals.raw]
	const last = rawLiterals.length - 1
	const flagsMatch = rawLiterals[last].match(/\/[gimuy]*$/)
	let flagMatchError = false

	// trim space before and after the regex.
	if (rawLiterals[0].match(/^\//)) {
		if (!flagsMatch) flagMatchError = true
		else {
			rawLiterals[0] = rawLiterals[0].replace('/', '')
			flags = flagsMatch[0].replace('/', '')
			rawLiterals[last] = rawLiterals[last].replace(/\/[gimuy]*$/, '')
		}
	} else {
		if (flagsMatch) flagMatchError = true
	}

	// run the loop only for the substitution count.
	for (let i = 0, l = substitutions.length; i < l; i += 1) {
		const sub = substitutions[i]
		result += rawLiterals[i]
		result += sub instanceof RegExp ? sub.source : String(sub)
	}

	// add the last literal
	result += rawLiterals[last]

	if (flagMatchError) {
		throw new TypeError(
			`regex has unmatched slashes, f.e. r\`/foo\` or r\`foo/\` instead of r\`/foo/\`. Input was: ${result}.`,
		)
	}

	return new RegExp(result, flags)
}

export const r = regexr

/** helpers */

/**
 * escapes a string literal
 * Adapted from https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
 *
 * @param {string} A string to be literally matched (it does not represent a
 * RegExp). For example, "foo$bar" will be converted to "foo\$bar" so that the
 * `$` is not treated as a RegExp special character.
 */
// TODO replace certain characters with escape representations, f.e. line breaks
// with \n, tabs with \t, etc
export const escape = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string

export const e = escape

export const version = '2.0.1'
