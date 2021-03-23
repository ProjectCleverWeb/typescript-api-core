import 'source-map-support/register'

// Start tracking the runtime
const timestamp = Date.now()
const highResolutionTime =process.hrtime()

// Bootstrap the environment and api core
import { application } from './core/bootstrap'
import { Context, APIGatewayEvent, APIGatewayProxyResultV2 } from 'aws-lambda'

// "and the monkey flips the switch" (Launch!)
export default (async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResultV2> => {
	return (await application.api(
		timestamp,
		highResolutionTime
	))(event, context)
})
