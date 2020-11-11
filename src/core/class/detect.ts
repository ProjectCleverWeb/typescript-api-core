
export type E_detectType = "null" | "array" | "nan" | "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"

export class detect {
	public static async type(value: any) : Promise<E_detectType> {
		const type   = typeof value
		const object = value instanceof Object
		
		if (value === null) {
			return 'null'
		} else if (Number.isNaN(value)) {
			return 'nan'
		} else if ((object || type === 'object') && value.constructor === Array) {
			return 'array'
		}
		return type
	}
	
	public static async isNumber(value: any, strict: boolean = true) : Promise<boolean> {
		if (strict) {
			return await this.type(value) === 'number'
		}
		return Number.isNaN(Number.parseFloat(value))
	}
	
	public static async isInt(value: any, strict: boolean = true) : Promise<boolean> {
		if (strict) {
			return Number.isInteger(value)
		}
		return Number.isInteger(Number.parseFloat(value))
	}
	
	public static async isFloat(value: any, strict: boolean = true) : Promise<boolean> {
		if (strict) {
			return await this.isNumber(value, true) && !await this.isInt(value, true)
		}
		return !await this.isInt(Number.parseFloat(value), false)
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
	
}


