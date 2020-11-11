
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
	
	public static async isNumber(value: any) : Promise<boolean> {
		return await this.type(value) === 'number'
	}
	
	public static async isInt(value: any) : Promise<boolean> {
		return Number.isInteger(value)
	}
	
	public static async isFloat(value: any) : Promise<boolean> {
		return await this.isNumber(value) && !await this.isInt(value)
	}
	
	public static async isFinite(value: any) : Promise<boolean> {
		return Number.isFinite(value)
	}
	
	public static async isSigned(value: any) : Promise<boolean> {
		return Number.isSafeInteger(value)
	}
	
	public static async isNegative(value: any) : Promise<boolean> {
		return await this.isNumber(value) && value < 0
	}
	
	
	
	
}


