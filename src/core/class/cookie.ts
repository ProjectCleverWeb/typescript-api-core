import { CookieSerializeOptions, parse as cookieParse, serialize as cookieSerialize } from 'cookie'

export type T_cookieSameSite = E_cookieSameSite | keyof typeof E_cookieSameSite | boolean

export type T_cookieObjectInputString = {
	value: string
}

export type T_cookieObjectInputObject = {
	value: object
}

export type T_cookieObjectInput = (T_cookieObjectInputString | T_cookieObjectInputObject) & {
	name: string
	jsonDataCookie?: boolean
	domain?: string
	encoder?(value: string): string
	expires?: Date | number
	httpOnly?: boolean
	path?: string
	sameSite?: T_cookieSameSite
	secure?: boolean
}

export type T_cookieObject = T_cookieObjectInput & {
	parsed: boolean
	emitted: boolean
	jsonDataCookie: boolean // force not undefined
}


export enum E_cookieSameSite {
	true,
	false,
	lax,
	strict,
	none
}

export type T_cookieState = {
	[key: string]: T_cookieObject
}

export class cookie {
	
	private static _prefix: string                 = ''
	private static _suffix: string                 = ''
	private static _jsonDataCookieDefault: boolean = true
	private static _cookies: T_cookieState         = {}
	
	public static async init(cookieHeader: string): Promise<void> {
		// const cookies = await this.parse(cookieHeader)
		// for (let key in cookies) {
		// 	const value = cookies[key]
		// 	this._cookies[key] =
		// }
	}
	
	public static reset = async(): Promise<void> => {
		cookie._cookies = {}
	}
	
	public static prefix = async(newPrefix ?: string): Promise<string> => {
		if (typeof newPrefix === 'string') {
			cookie._prefix = newPrefix
		}
		return cookie._prefix
	}
	
	public static suffix = async(newSuffix ?: string): Promise<string> => {
		if (typeof newSuffix === 'string') {
			cookie._suffix = newSuffix
		}
		return cookie._suffix
	}
	
	public static add = async(cookieObjectInput: T_cookieObjectInput): Promise<void> => {
		cookie._cookies[cookieObjectInput.name] = {
			...cookieObjectInput,
			...{
				parsed         : false,
				emitted        : false,
				jsonDataCookie : cookieObjectInput.jsonDataCookie ?? cookie._jsonDataCookieDefault
			}
		}
	}
	
	public static addParsed = async(cookieObjectInput: T_cookieObjectInput): Promise<void> => {
		cookie._cookies[cookieObjectInput.name] = {
			...cookieObjectInput,
			...{
				parsed         : true,
				emitted        : true,
				jsonDataCookie : cookieObjectInput.jsonDataCookie ?? cookie._jsonDataCookieDefault
			}
		}
	}
	
	
	public static renderHeader = async(cookieObject: T_cookieObjectInput): Promise<string> => {
		let options: CookieSerializeOptions = {
			domain   : cookieObject.domain,
			encode   : cookieObject.encoder,
			httpOnly : cookieObject.httpOnly,
			path     : cookieObject.path,
			secure   : cookieObject.secure
		}
		
		// Using both max age and expires can lead to unexpected issues, so we forcing using only 1 or the other
		if (typeof cookieObject.expires === 'number') {
			options.maxAge = cookieObject.expires
		} else if (typeof cookieObject.expires === 'object') {
			options.expires = cookieObject.expires
		}
		
		if (
			cookieObject.sameSite === true
			|| cookieObject.sameSite === E_cookieSameSite.true
			|| cookieObject.sameSite === 'true'
		) {
			options.sameSite = true
		} else if (
			cookieObject.sameSite === false
			|| cookieObject.sameSite === E_cookieSameSite.false
			|| cookieObject.sameSite === 'false'
		) {
			options.sameSite = false
		} else if (
			cookieObject.sameSite === E_cookieSameSite.lax
			|| cookieObject.sameSite === 'lax'
		) {
			options.sameSite = 'lax'
		} else if (
			cookieObject.sameSite === E_cookieSameSite.strict
			|| cookieObject.sameSite === 'strict'
		) {
			options.sameSite = 'strict'
		} else if (
			cookieObject.sameSite === E_cookieSameSite.none
			|| cookieObject.sameSite === 'none'
		) {
			options.sameSite = 'none'
		}
		
		if (cookieObject.jsonDataCookie) {
			return cookieSerialize(
				 cookie._prefix + cookieObject.name + cookie._suffix + '_jsonDataCookie',
				JSON.stringify(cookieObject),
				options
			)
		}
		return cookieSerialize(
			cookie._prefix + cookieObject.name + cookie._suffix,
			typeof cookieObject.value === 'string' ? cookieObject.value : JSON.stringify(cookieObject.value),
			options
		)
	}
	
	public static async renderHeaders(): Promise<string[]> {
		let headers = []
		for (const key of Object(this._cookies).keys()) {
			const value = this._cookies[key]
			headers.push(this.renderHeader(value))
		}
		return await Promise.all(headers)
	}
	
	public static async parse(cookieHeader: string) {
		return cookieParse(cookieHeader)
	}
	
}


