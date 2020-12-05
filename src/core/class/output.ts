import { APIGatewayProxyResultV2 } from 'aws-lambda'
import { safeDump as renderYaml } from 'js-yaml'

export type T_outputBodyValue = [{ [key: string]: any }]

export type T_outputBody = {
	[key: string]: T_outputBodyValue
}

export type T_outputMetaValue = string | number | Array<T_outputMetaValue> | { [key: string]: T_outputMetaValue }

export type T_outputMeta = {
	[key: string]: T_outputMetaValue
}

export enum E_renderMode {
	json = 'json',
	yaml = 'yaml'
}

export type T_renderMode = keyof typeof E_renderMode

export class output {
	
	public static body: T_outputBody = {}
	public static meta: T_outputMeta = {}
	
	private static _renderMode: T_renderMode = 'json'
	
	public static async renderMode(newMode: T_renderMode): Promise<T_renderMode> {
		if (typeof newMode !== 'undefined') {
			this._renderMode = newMode
		}
		return this._renderMode
	}
	
	public static async reset(): Promise<void> {
		this.meta = {}
		this.body = {}
	}
	
	public static async render(): Promise<APIGatewayProxyResultV2> {
		
		const outputObject = {
			meta : this.meta,
			body : this.body
		}
		
		let outputString      = ''
		let outputContentType = 'text/html'
		if (this._renderMode === 'yaml') {
			outputString      = renderYaml(outputObject, {
				lineWidth : 150,
				noRefs    : true // only important for output
			})
			outputContentType = 'application/x-yaml'
		} else {
			outputString      = JSON.stringify(outputObject, null, 2)
			outputContentType = 'application/json'
		}
		
		const output: APIGatewayProxyResultV2 = {
			statusCode      : 200,
			isBase64Encoded : false,
			headers         : {
				'Content-Type'                     : outputContentType,
				'Access-Control-Allow-Origin'      : '*', // Required for CORS support to work
				'Access-Control-Allow-Credentials' : true, // Required for cookies, authorization headers with HTTPS
				'Set-Cookie'                       : encodeURI('username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/')
			},
			body            : outputString
		}
		console.log('Request Output: \n' + output.body)
		return output
	}
	
	public static async replace(key: string, value: T_outputBodyValue) {
		this.body[key] = value
		return value
	}
	
	public static async _replace(key: string, value: T_outputMetaValue) {
		this.meta[key] = value
		return value
	}
	
	public static async append(key: string, value: T_outputBodyValue) {
		if (await this.exists(key)) {
			this.body[key].push(...value)
		} else {
			await this.replace(key, value)
		}
		return value
	}
	
	public static async exists(key: string) {
		return typeof this.body[key] !== 'undefined'
	}
	
	
}


