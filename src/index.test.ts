import {r, e} from './index.js'

// FIXME no any
declare global {
	const describe: any
	const expect: any
	const it: any
}

describe('Regexr:', () => {
	describe('regexr, r', () => {
		it('composes regexes while eliminating double-escape hell', () => {
			//
			// Old way (double-escape hell):
			const spaceRegex1 = '\\s*'
			const finalRegex1 = new RegExp('\\(' + spaceRegex1 + '\\/\\[\\\\\\d+\\]\\)*$', 'g')
			expect(!!'( /[\\12358])'.match(finalRegex1)).toBe(true)

			//
			// New way (regex composition heaven)
			const spaceRegex2 = r`\s*`
			const finalRegex2 = r`/\(${spaceRegex2}\/\[\\\d+\]\)*$/g`
			expect(!!'( /[\\12358])'.match(finalRegex2)).toBe(true)
		})

		it("doesn't crash on empty flags", () => {
			const reg = r`foo`
			expect(reg.toString()).toBe('/foo/')
		})

		it('throws on unmatched start and end slashes', () => {
			const makeRegex = () => r`/foo`
			expect(makeRegex).toThrowError()

			const makeRegex2 = () => r`foo/`
			expect(makeRegex2).toThrowError()

			const makeRegex3 = () => r`/foo/`
			expect(makeRegex3).not.toThrowError()
		})
	})

	describe('escape, e', () => {
		it('escapes any string for use as a literal match inside any RegExp', () => {
			const money = '$5.00'
			const fiveDollarRegex = r`value: ${e(money)}`
			const fiveDollarRegexNotEscaped = r`value: ${money}`

			expect(fiveDollarRegex.toString()).toBe('/value: \\$5\\.00/')
			expect(fiveDollarRegexNotEscaped.toString()).toBe('/value: $5.00/')

			expect(!!'value: $5.00'.match(fiveDollarRegex)).toBe(true)
			expect(!!'value: $5.50'.match(fiveDollarRegex)).toBe(false)
		})
	})
})
