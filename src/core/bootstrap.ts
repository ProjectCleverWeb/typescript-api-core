import { Context, APIGatewayEvent, APIGatewayProxyResultV2 } from 'aws-lambda'
import { _, debug, T_debugHighResolutionTime, T_debugTimestamp } from './class/debug'
import { event } from './class/event'

export type T_applicationApiEventHandler = (eventData: APIGatewayEvent, contextData: Context) => Promise<APIGatewayProxyResultV2>

export class application {
	public static async api(timestamp : T_debugTimestamp, highResolutionTime : T_debugHighResolutionTime): Promise<T_applicationApiEventHandler> {
		
		await Promise.all([
			debug.init(timestamp, highResolutionTime)
		])
		
		return event.api
	}
	
	
}

