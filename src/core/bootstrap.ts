import { Context, APIGatewayEvent, APIGatewayProxyResultV2 } from 'aws-lambda'
import { debug, T_debugHighResolutionTime, T_debugTimestamp } from './class/debug'
import { event } from './class/event'

export type T_applicationApiEventHandler = (eventData: APIGatewayEvent, contextData: Context) => Promise<APIGatewayProxyResultV2>

export class application {
	public static async api(timestamp : T_debugTimestamp, highResolutionTime : T_debugHighResolutionTime, requestTimestamp: number): Promise<T_applicationApiEventHandler> {
		
		await Promise.all([
			debug.init(timestamp, highResolutionTime, requestTimestamp)
		])
		
		return event.api
	}
	
	
}

