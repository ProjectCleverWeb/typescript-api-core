import { detect } from './detect'

export enum E_bitwiseInteger {
	bit1 = 1,
	bit2 = 2,
	bit3 = 4,
	bit4 = 8,
	bit5 = 16,
	bit6 = 32,
	bit7 = 64,
	bit8 = 128,
	bit9 = 256,
	bit10 = 512,
	bit11 = 1024,
	bit12 = 2048,
	bit13 = 4096,
	bit14 = 8192,
	bit15 = 16384,
	bit16 = 32768,
	bit17 = 65536,
	bit18 = 131072,
	bit19 = 262144,
	bit20 = 524288,
	bit21 = 1048576,
	bit22 = 2097152,
	bit23 = 4194304,
	bit24 = 8388608,
	bit25 = 16777216,
	bit26 = 33554432,
	bit27 = 67108864,
	bit28 = 134217728,
	bit29 = 268435456,
	bit30 = 536870912,
	bit31 = 1073741824,
	bit32 = 2147483648
}

export type T_bitwiseValue = boolean | number | string

export type T_bitwiseArray = Array<T_bitwiseValue>

export type T_bitwiseString = string

export type T_bitwiseBits = E_bitwiseInteger | T_bitwiseString | T_bitwiseArray

export type T_bitwiseCallback = () => void

export class bitwise {
	static readonly bit1: E_bitwiseInteger = E_bitwiseInteger.bit1
	static readonly bit2: E_bitwiseInteger = E_bitwiseInteger.bit2
	static readonly bit3: E_bitwiseInteger = E_bitwiseInteger.bit3
	static readonly bit4: E_bitwiseInteger = E_bitwiseInteger.bit4
	static readonly bit5: E_bitwiseInteger = E_bitwiseInteger.bit5
	static readonly bit6: E_bitwiseInteger = E_bitwiseInteger.bit6
	static readonly bit7: E_bitwiseInteger = E_bitwiseInteger.bit7
	static readonly bit8: E_bitwiseInteger = E_bitwiseInteger.bit8
	static readonly bit9: E_bitwiseInteger = E_bitwiseInteger.bit9
	static readonly bit10: E_bitwiseInteger = E_bitwiseInteger.bit10
	static readonly bit11: E_bitwiseInteger = E_bitwiseInteger.bit11
	static readonly bit12: E_bitwiseInteger = E_bitwiseInteger.bit12
	static readonly bit13: E_bitwiseInteger = E_bitwiseInteger.bit13
	static readonly bit14: E_bitwiseInteger = E_bitwiseInteger.bit14
	static readonly bit15: E_bitwiseInteger = E_bitwiseInteger.bit15
	static readonly bit16: E_bitwiseInteger = E_bitwiseInteger.bit16
	static readonly bit17: E_bitwiseInteger = E_bitwiseInteger.bit17
	static readonly bit18: E_bitwiseInteger = E_bitwiseInteger.bit18
	static readonly bit19: E_bitwiseInteger = E_bitwiseInteger.bit19
	static readonly bit20: E_bitwiseInteger = E_bitwiseInteger.bit20
	static readonly bit21: E_bitwiseInteger = E_bitwiseInteger.bit21
	static readonly bit22: E_bitwiseInteger = E_bitwiseInteger.bit22
	static readonly bit23: E_bitwiseInteger = E_bitwiseInteger.bit23
	static readonly bit24: E_bitwiseInteger = E_bitwiseInteger.bit24
	static readonly bit25: E_bitwiseInteger = E_bitwiseInteger.bit25
	static readonly bit26: E_bitwiseInteger = E_bitwiseInteger.bit26
	static readonly bit27: E_bitwiseInteger = E_bitwiseInteger.bit27
	static readonly bit28: E_bitwiseInteger = E_bitwiseInteger.bit28
	static readonly bit29: E_bitwiseInteger = E_bitwiseInteger.bit29
	static readonly bit30: E_bitwiseInteger = E_bitwiseInteger.bit30
	static readonly bit31: E_bitwiseInteger = E_bitwiseInteger.bit31
	static readonly bit32: E_bitwiseInteger = E_bitwiseInteger.bit32

	public static async check(bits: T_bitwiseBits, callback: T_bitwiseCallback) {}

	protected static async standardize(bits: T_bitwiseBits): Promise<number[]> {
		const type = await detect.type(bits)
		if (type === 'array') {
			return Array(bits).map(function (bit): number {
				return Number(bit)
			})
		} else if (await detect.isInteger(bits)) {
			const bitString = (Number(bits) >>> 0).toString(2).split('')
			return bitString.map(function (bit): number {
				return parseInt(bit, 10)
			})
		} else if (type === 'string') {
			const bitString = String(bits).split('')
			return bitString.map(function (bit): number {
				return parseInt(bit, 10)
			})
		}
		throw new TypeError('Unsupported bit value')
	}

	protected static async sanitizeArray(bits: T_bitwiseArray): Promise<T_bitwiseArray> {
		return bits.map((bit: T_bitwiseValue) => {
			if (typeof bit == 'string') {
				bit = parseInt(bit)
			}
			if (bit !== 0 && bit !== 1) {
				throw new TypeError('Unsupported bit value')
			}
			return Boolean(bit)
		})
	}
}
