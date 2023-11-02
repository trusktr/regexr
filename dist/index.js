export function regexr(literals, ...substitutions) {
    let result = '';
    let flags = '';
    const rawLiterals = [...literals.raw];
    const last = rawLiterals.length - 1;
    const flagsMatch = rawLiterals[last].match(/\/[gimuy]*$/);
    let flagMatchError = false;
    if (rawLiterals[0].match(/^\//)) {
        if (!flagsMatch)
            flagMatchError = true;
        else {
            rawLiterals[0] = rawLiterals[0].replace('/', '');
            flags = flagsMatch[0].replace('/', '');
            rawLiterals[last] = rawLiterals[last].replace(/\/[gimuy]*$/, '');
        }
    }
    else {
        if (flagsMatch)
            flagMatchError = true;
    }
    for (let i = 0, l = substitutions.length; i < l; i += 1) {
        const sub = substitutions[i];
        result += rawLiterals[i];
        result += sub instanceof RegExp ? sub.source : String(sub);
    }
    result += rawLiterals[last];
    if (flagMatchError) {
        throw new TypeError(`regex has unmatched slashes, f.e. r\`/foo\` or r\`foo/\` instead of r\`/foo/\`. Input was: ${result}.`);
    }
    return new RegExp(result, flags);
}
export const r = regexr;
export const escape = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const e = escape;
export const version = '2.0.3';
//# sourceMappingURL=index.js.map