import { A_foundation } from './abstract/A_foundation'

/**
 * All the detectable types as a enum
 */
export enum E_detectType {
	null = 'null',
	undefined = 'undefined',
	number = 'number',
	bigint = 'bigint',
	infinity = 'infinity',
	string = 'string',
	boolean = 'boolean',
	object = 'object',
	array = 'array',
	promise = 'promise',
	error = 'error',
	nan = 'nan',
	symbol = 'symbol',
	function = 'function'
}

/**
 * All the detectable types as a type
 */
export type T_detectType = keyof typeof E_detectType

/**
 * The types that are considered nullable as a enum
 */
export enum E_detectTypeGroupNullable {
	null = E_detectType.null,
	undefined = E_detectType.undefined
}

/**
 * The types that are considered nullable as a type
 */
export type T_detectTypeGroupNullable = keyof typeof E_detectTypeGroupNullable

/**
 * The types that are considered numeric as a enum
 */
export enum E_detectTypeGroupNumeric {
	number = E_detectType.number,
	bigint = E_detectType.bigint,
	infinity = E_detectType.infinity
}

/**
 * The types that are considered numeric as a type
 */
export type T_detectTypeGroupNumeric = keyof typeof E_detectTypeGroupNumeric

/**
 * The types that are considered numeric as a enum
 */
export enum E_detectTypeGroupParsableNumeric {
	number = E_detectType.number,
	string = E_detectType.string,
	bigint = E_detectType.bigint
}

/**
 * The types that are considered numeric as a type
 */
export type T_detectTypeGroupParsableNumeric = typeof E_detectTypeGroupParsableNumeric

/**
 * The types that are considered scalar as a enum
 */
export enum E_detectTypeGroupScalar {
	number = E_detectType.number,
	string = E_detectType.string,
	boolean = E_detectType.boolean
}

/**
 * The types that are considered scalar as a type
 */
export type T_detectTypeGroupScalar = keyof typeof E_detectTypeGroupScalar

/**
 * The types that are considered object as a enum
 */
export enum E_detectTypeGroupObject {
	object = E_detectType.object,
	null = E_detectType.null,
	array = E_detectType.array,
	promise = E_detectType.promise,
	error = E_detectType.error
}

/**
 * The types that are considered object as a type
 */
export type T_detectTypeGroupObject = keyof typeof E_detectTypeGroupObject

/**
 * This class is compilation of functions used for detecting various things
 */
export class detect extends A_foundation {
	/**
	 * Detect the type of a value. This is an extension of typeof which adds
	 * support for distinguishing the following types:
	 * - null
	 * - array
	 * - promise
	 * - error
	 * - nan
	 * - infinity
	 *
	 * @param value The value you want to check the type of
	 * @return {Promise<T_detectType>} The type of the value
	 */
	public static async type(value: any): Promise<T_detectType> {
		const type = typeof value

		if (type === 'number') {
			if (Number.isNaN(value)) {
				return 'nan'
			} else if (!Number.isFinite(value)) {
				return 'infinity'
			}
		} else if (type === 'object') {
			if (value === null) {
				return 'null'
			} else if (Array.isArray(value)) {
				return 'array'
			} else if (value instanceof Promise) {
				return 'promise'
			} else if (value instanceof Error) {
				return 'error'
			}
		}
		return type
	}

	/**
	 * Determine a object's type/name.
	 *
	 * @param object The object to check
	 * @return {Promise<string>} The object type
	 */
	public static async objectType(object: object): Promise<string> {
		return Object()
			.toString.call(object)
			.match(/\s([a-zA-Z]+)/)[1]
			.toLowerCase()
	}

	/**
	 * Check if value is a specific type
	 *
	 * @param value The value to check
	 * @param {T_detectType} type The type to check against
	 * @returns {Promise<boolean>} True if type matched, false otherwise
	 */
	public static async isType(value: any, type: T_detectType): Promise<boolean> {
		return (await this.type(value)) === type
	}

	/**
	 * Check if object is a specific type
	 *
	 * @param {object} object The object to check
	 * @param {string} type The type to check against
	 * @returns {Promise<boolean>} True if type matched, false otherwise
	 */
	public static async isObjectType(object: object, type: string): Promise<boolean> {
		return (await this.objectType(object)) === type
	}

	/**
	 * Check if value is 1 of many types
	 *
	 * @param value The value to check
	 * @param {T_detectType[]} types This array of types to return true for
	 * @returns {Promise<boolean>} True if type matched, false otherwise
	 */
	public static async isTypeIn(value: any, types: T_detectType[]): Promise<boolean> {
		return types.includes(await this.type(value))
	}

	/**
	 * Check if a value is a nullable type ('undefined' or 'null')
	 *
	 * @param value The value to check
	 * @returns {Promise<boolean>} True if type matched, false otherwise
	 */
	public static async isNullable(value: any): Promise<boolean> {
		return await this.isTypeIn(value, ['null', 'undefined'])
	}

	/**
	 * Check if a value can be considered empty.
	 *
	 * This returns true if the value is:
	 * - null
	 * - undefined
	 * - boolean false
	 * - the number 0 (including BigInt)
	 * - an empty string
	 * - an array with length of 0
	 * - an object with no keys
	 * - an symbol where the description is empty
	 *
	 * @param value The value to check
	 * @returns {Promise<boolean>} True if the value is considered empty, false otherwise
	 */
	public static async isEmpty(value: any): Promise<boolean> {
		const type = await this.type(value)
		if (type === 'number') {
			return value === 0
		} else if (type === 'string') {
			return value === ''
		} else if (type === 'bigint') {
			return value.toString() === '0'
		} else if ((await this.size(value)) === 0) {
			return true
		}
		return false
	}

	/**
	 * Check if a value is a number
	 *
	 * @param value The value to check
	 * @param {boolean} strict Whether or not to use strict type checks
	 * @returns {Promise<boolean>} True if the value is considered a number, false otherwise
	 */
	public static async isNumber(value: any, strict: boolean = true): Promise<boolean> {
		const type = await this.type(value)
		if (type === 'number') {
			return true
		} else if (!strict && type in E_detectTypeGroupParsableNumeric) {
			return !Number.isNaN(Number(value))
		}
		return false
	}

	/**
	 * Check if a value is a integer
	 *
	 * @param value The value to check
	 * @param {boolean} strict Whether or not to use strict type checks
	 * @returns {Promise<boolean>} True if the value is considered a integer, false otherwise
	 */
	public static async isInteger(value: any, strict: boolean = true): Promise<boolean> {
		const type = await this.type(value)
		if (type === 'number') {
			return Number.isInteger(value)
		} else if (!strict && type in E_detectTypeGroupParsableNumeric) {
			return Number.isInteger(Number(value))
		}
		return false
	}

	/**
	 * Check if a value is a float
	 *
	 * @param value The value to check
	 * @param {boolean} strict Whether or not to use strict type checks
	 * @returns {Promise<boolean>} True if the value is considered a float, false otherwise
	 */
	public static async isFloat(value: any, strict: boolean = true): Promise<boolean> {
		const type = await this.type(value)
		if (type === 'number') {
			return !Number.isInteger(value)
		} else if (!strict && type in E_detectTypeGroupParsableNumeric) {
			return !Number.isInteger(Number(value))
		}
		return false
	}

	/**
	 * Check if a value is a finite number
	 *
	 * @param value The value to check
	 * @param {boolean} strict Whether or not to use strict type checks
	 * @returns {Promise<boolean>} True if the value is considered finite, false otherwise
	 */
	public static async isFinite(value: any, strict: boolean = true): Promise<boolean> {
		if (!strict) {
			value = Number(value)
		}
		return Number.isFinite(value)
	}

	/**
	 * Check if a value is a signed integer
	 *
	 * @param value The value to check
	 * @param {boolean} strict Whether or not to use strict type checks
	 * @returns {Promise<boolean>} True if the value is considered a signed integer, false otherwise
	 */
	public static async isSigned(value: any, strict: boolean = true): Promise<boolean> {
		if (!strict) {
			value = Number(value)
		}
		return Number.isSafeInteger(value)
	}

	/**
	 * Check if a value is a negative number
	 *
	 * @param value The value to check
	 * @param {boolean} strict Whether or not to use strict type checks
	 * @returns {Promise<boolean>} True if the value is considered a negative number, false otherwise
	 */
	public static async isNegative(value: any, strict: boolean = true): Promise<boolean> {
		return (await this.isNumber(value, strict)) && value < 0
	}

	/**
	 * Check if a value is a binary string
	 *
	 * @param value The value to check
	 * @returns {Promise<boolean>} True if the value is considered a binary string, false otherwise
	 */
	public static async isBinaryString(value: any): Promise<boolean> {
		return (await this.isType(value, 'string')) && /\A[01]\Z/.test(value)
	}

	/**
	 * Check if a value is a boolean
	 *
	 * @param value The value to check
	 * @param {boolean} strict Whether or not to use strict type checks
	 * @returns {Promise<boolean>} True if the value is considered a boolean, false otherwise
	 */
	public static async isBoolean(value: any, strict: boolean = true): Promise<boolean> {
		const type = await this.type(value)
		if (type === 'boolean') {
			return true
		} else if (!strict && (await this.isInteger(value, false))) {
			value = Number(value)
			switch (value) {
				case 0:
				case 1:
					return true
			}
		}
		return false
	}

	/**
	 * Checks the size (aka length) of a value
	 *
	 * @param value The value to check
	 * @returns {Promise<number>} The length of the value, if the length cannot be determined it returns -1
	 */
	public static async size(value: any): Promise<number> {
		// it is important here that we distinguish infinity, NaN, etc
		const type = await this.type(value)
		if (type in E_detectTypeGroupNullable) {
			return 0
		} else if (type === 'boolean') {
			return value ? 1 : 0
		} else if (['array', 'string'].includes(type)) {
			return value.length
		} else if (type in E_detectTypeGroupParsableNumeric) {
			return value.toString().length
		} else if (type in E_detectTypeGroupObject) {
			return Object.keys(value).length
		} else if (type === 'symbol' && typeof value.description === 'string') {
			return value.description.length
		}
		return -1
	}
}
