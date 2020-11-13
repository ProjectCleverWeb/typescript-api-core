
export type T_detectType = "null" | "array" | "nan" | "infinity" | "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"

export enum E_detectNumber {
	number,
	bigint,
	string,
}

export class detect {
	
	/**
	 * Detect the type of a variable. This is an extension of typeof which adds
	 * support for distinguishing the following types:
	 * - null
	 * - array
	 * - nan
	 * - infinity
	 *
	 * @param value
	 * @return {Promise<T_detectType>} The type of the value
	 */
	public static async type(value: any) : Promise<T_detectType> {
		const type   = typeof value
		const object = value instanceof Object
		
		if (value === null) {
			return 'null'
		} else if (type === 'number' && Number.isNaN(value)) {
			return 'nan'
		} else if (type === 'number' && !Number.isFinite(value)) {
			return 'infinity'
		} else if ((object || type === 'object') && value.constructor === Array) {
			return 'array'
		}
		return type
	}
	
	public static async isType(value: any, type: T_detectType) : Promise<boolean> {
		return await this.type(value) === type
	}
	
	public static async isNumber(value: any, strict: boolean = true) : Promise<boolean> {
		const type = await this.type(value)
		if (strict) {
			return type === 'number'
		} else if (type in E_detectNumber) {
			return !Number.isNaN(Number.parseFloat(value))
		}
		return false
	}
	
	public static async isInt(value: any, strict: boolean = true) : Promise<boolean> {
		const type = await this.type(value)
		if (strict) {
			return type === 'number' && Number.isInteger(value)
		} else if (type in E_detectNumber) {
			return Number.isInteger(Number.parseFloat(value))
		}
		return false
	}
	
	public static async isFloat(value: any, strict: boolean = true) : Promise<boolean> {
		const type = await this.type(value)
		if (strict) {
			return type === 'number' &&  !await this.isInt(value, strict)
		} else if (type in E_detectNumber) {
			return !await this.isInt(Number.parseFloat(value), strict)
		}
		return false
	}
	
	public static async isFinite(value: any, strict: boolean = true) : Promise<boolean> {
		if (strict) {
			return Number.isFinite(value)
		}
		return Number.isFinite(Number.parseFloat(value))
	}
	
	public static async isSigned(value: any, strict: boolean = true) : Promise<boolean> {
		if (strict) {
			return Number.isSafeInteger(value)
		}
		return Number.isSafeInteger(Number.parseFloat(value))
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
	
}


