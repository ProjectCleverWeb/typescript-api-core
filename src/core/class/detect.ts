import {foundation} from "./abstract/foundation"

export type T_detectType = "null" | "array" | "promise" | "error" | "nan" | "infinity" | "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"


export enum E_detectNumber {
	number,
	bigint,
	string,
}

export class detect extends foundation {
	
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
	public static async type(value: any) : Promise<T_detectType> {
		const type   = typeof value
		
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
	 * @return {Promise<string>}
	 */
	public static async objectType(object: object) : Promise<string> {
		return Object().toString.call(object).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
	}
	
	public static async isType(value: any, type: T_detectType) : Promise<boolean> {
		return await this.type(value) === type
	}
	
	public static async isObjectType(object: object, type: string) : Promise<boolean> {
		return await this.objectType(object) === type
	}
	
	public static async isTypeIn(value: any, types: T_detectType[]) : Promise<boolean> {
		return types.includes(await this.type(value))
	}
	
	public static async isNumber(value: any, strict: boolean = true) : Promise<boolean> {
		const type = await this.type(value)
		if (strict) {
			return type === 'number'
		} else if (type in E_detectNumber) {
			return !Number.isNaN(Number(value))
		}
		return false
	}
	
	public static async isInt(value: any, strict: boolean = true) : Promise<boolean> {
		const type = await this.type(value)
		if (strict) {
			return type === 'number' && Number.isInteger(value)
		} else if (type in E_detectNumber) {
			return Number.isInteger(Number(value))
		}
		return false
	}
	
	public static async isFloat(value: any, strict: boolean = true) : Promise<boolean> {
		const type = await this.type(value)
		if (strict) {
			return type === 'number' &&  !await this.isInt(value, strict)
		} else if (type in E_detectNumber) {
			return !await this.isInt(Number(value), strict)
		}
		return false
	}
	
	public static async isFinite(value: any, strict: boolean = true) : Promise<boolean> {
		if (strict) {
			return Number.isFinite(value)
		}
		return Number.isFinite(Number(value))
	}
	
	public static async isSigned(value: any, strict: boolean = true) : Promise<boolean> {
		if (strict) {
			return Number.isSafeInteger(value)
		}
		return Number.isSafeInteger(Number(value))
	}
	
	public static async isNegative(value: any, strict: boolean = true) : Promise<boolean> {
		return await this.isNumber(value, strict) && value < 0
	}
	
	public static async isBinaryString(value: any) : Promise<boolean> {
		return await this.type(value) === 'string' && /\A[01]\Z/.test(value);
	}
	
	public static async isBinaryArray(value: any, strict: boolean = true) : Promise<boolean> {
		if (await this.type(value) === 'array') {
			// This functionally will only be boolean, the promise is to take care of TS warnings
			let valid : boolean|Promise<boolean> = true
			value.map((element: any) => {
				valid = (async () => {return await this.isBoolean(element, strict)})()
			})
			return valid
		}
		return false
	}
	
	public static async isBoolean(value: any, strict: boolean = true) : Promise<boolean> {
		const type = await this.type(value)
		if (strict || type === 'boolean') {
			return type === 'boolean'
		}
		if (await this.isInt(value, strict)) {
			value = parseInt(value)
			console.log(value)
			switch (value) {
				case 0:
				case 1:
					return true
			}
		}
		return false
	}
	
	public static async size(value: any) : Promise<number> {
		// it is important here that we distinguish infinity, NaN, etc
		const type = await this.type(value)
		if (['array', 'string', 'function'].includes(type)) {
			return value.length
		} else if (['number', 'bigint'].includes(type)) {
			return value.toString().length
		} else if (['object', 'promise', 'error'].includes(type)) {
			return Object.keys(value).length
		} else if (type === 'boolean') {
			return value ? 1 : 0
		} else if (type === 'symbol' && typeof value.description === 'string') {
			return value.description.length
		}
		return 0
	}
	
	
}

