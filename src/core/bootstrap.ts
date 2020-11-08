
export class application {
	public static async api(event: object, context: object) {
		const output = {
			statusCode : 200,
			body       : JSON.stringify(
				{
					message : 'Hello from TypeScript!'
				},
				null,
				2,
			),
		}
		console.log("Request Output: \n" + output.body)
		return output
	}
	
}

