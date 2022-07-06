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
	// const rawLiterals = [].slice.call(literals.raw, 0)
	const rawLiterals = [...literals.raw]
	const last = rawLiterals.length - 1
	const flagMatch = rawLiterals[last].match(/\/[gimuy]*$/)

	//trim space before and after the regex.
	if (rawLiterals[0].match(/^\//)) {
		if (!flagMatch) throw new TypeError('regex has unmatched slashes, f.e. r`/foo` or r`foo/` instead of r`/foo/`')

		rawLiterals[0] = rawLiterals[0].replace(/^\//, '')
		flags = flagMatch[0].replace(/\//, '')
		rawLiterals[last] = rawLiterals[last].replace(/\/[gimuy]*$/, '')
	} else {
		if (flagMatch) throw new TypeError('regex has unmatched slashes, f.e. r`/foo` or r`foo/` instead of r`/foo/`')
	}

	// run the loop only for the substitution count.
	for (let i = 0; i < substitutions.length; i++) {
		result += rawLiterals[i]
		result +=
			substitutions[i] instanceof RegExp ? substitutions[i].source : substitutions[i] ? substitutions[i].toString() : ''
	}

	// add the last literal
	result += rawLiterals[last]

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
export const escape = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string

export const e = escape

export const version = '1.6.0'
