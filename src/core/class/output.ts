import { APIGatewayProxyResultV2 } from 'aws-lambda'


export type T_outputBodyValue = [{ [key: string]: any }]

export type T_outputBody = {
	[key: string]: T_outputBodyValue
}

export type T_outputMetaValue = string | number | Array<T_outputMetaValue> | { [key: string]: T_outputMetaValue }

export type T_outputMeta = {
	[key: string]: T_outputMetaValue
}

export class output {
	
	public static body: T_outputBody = {}
	public static meta: T_outputMeta = {}
	
	public static async render(): Promise<APIGatewayProxyResultV2> {
		const output: APIGatewayProxyResultV2 = {
			statusCode      : 200,
			isBase64Encoded : false,
			cookies         : [],
			headers         : {
				'Content-Type' : 'text/json'
			},
			body            : JSON.stringify(
				{
					meta : this.meta,
					body : this.body
				},
				null,
				2
			)
		}
		console.log('Request Output: \n' + output.body)
		return output
	}
	
	public static async replace(key: string, value: T_outputBodyValue) {
		this.body[key] = value
		return value
	}
	
	public static async metaReplace(key: string, value: T_outputMetaValue) {
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


