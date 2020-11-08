import 'source-map-support/register'

// Bootstrap the environment and api core
import { api } from './core/bootstrap'

// "and the monkey flips the switch" (Launch!)
const application = async (event: object, context: object) => {
  const output = {
		statusCode : 200,
		body       : JSON.stringify(
			{
				message : await api.test(event, context)
			},
			null,
			2,
		),
	}
	console.log("Request Output: \n" + output.body)
	return output
}


export default application
