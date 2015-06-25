/**
 * Template tag function to make composing regexes easier.
 *
 * Example:
 *
 * ```js
 *   var regex1 = regex`/(this|that)*$/m`
 *   var regex2 = regex`/something|other_${regex1}/g`
 *   console.log(regex2) // /something|other_(this|that)*$/g
 * ```
 */
function regexr(literals, ...substitutions) {
    var result = ""
    var flags = ''

    // We get the raw string that the user typed so that they don't have to
    // escape backslashes, etc, inside of the regex. Awesome!!
    literals = [].slice.call(literals.raw, 0)
    let last = literals.length - 1

    //trim space before and after the regex.
    if (literals[0].match(/^\//)) {
        literals[0] = literals[0].replace(/^\//, '')

        flags = literals[last].match(/\/[gim]*$/)
        flags = flags[0].replace(/\//, '')
        literals[last] = literals[last].replace(/\/[gim]*$/, '')
    }

    // run the loop only for the substitution count.
    for (let i = 0; i < substitutions.length; i++) {
        result += literals[i]
        result += substitutions[i] instanceof RegExp ?
            substitutions[i].source : substitutions[i].toString()
    }

    // add the last literal
    result += literals[last]

    return new RegExp(result, flags)
}

export default regexr
