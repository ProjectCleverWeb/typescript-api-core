import { Context, APIGatewayEvent, APIGatewayProxyResultV2 } from 'aws-lambda'
import { output, E_renderMode, T_renderMode } from './class/output'
import { detect } from './class/detect'
import { cookie } from './class/cookie'
import { _, debug } from './class/debug'

export class application {
	public static async api(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResultV2> {
		
		debug.checkpoint({
			title: 'API Start'
		})
		
		
		_.log(event)
		
		if (await detect.type(event.queryStringParameters) === 'object') {
			const GET = event.queryStringParameters || {}
			
			if (GET.renderMode in E_renderMode) {
				await output.renderMode(GET.renderMode as T_renderMode)
			}
		}
		
		await output.reset()
		await output._replace('message', 'Hello from TypeScript!')
		
		await output.append('type_test', [
			{
				test1 : await detect.isNumber(1, false),
				test2 : await detect.isNumber('010110', false),
				test3 : await detect.isNumber('010110sxxxd', false),
				test4 : parseInt('010110sxxxd'),
				test5 : await cookie.parse(await cookie.renderHeader({
					name   : 'hello',
					value  : 'test',
					secure : true
				})),
				test6 : (await cookie.renderHeader({
					name   : 'hello',
					value  : 'test',
					secure : true
				}))
			}
		])
		
		
		
		await output.append('type_test', [
			{
				'null detected as': await detect.type(null),
				'[] detected as': await detect.type([]),
				'Number.NaN detected as': await detect.type(Number.NaN),
				'Number.POSITIVE_INFINITY detected as': await detect.type(Number.POSITIVE_INFINITY),
				'Number.NEGATIVE_INFINITY detected as': await detect.type(Number.NEGATIVE_INFINITY),
				'"" detected as': await detect.type(""),
				'"0" detected as': await detect.type("0"),
				'0 detected as': await detect.type(0),
				'1 detected as': await detect.type(1),
				'BigInt(9007199254740991) detected as': await detect.type(BigInt(9007199254740991)),
				'BigInt(1) detected as': await detect.type(BigInt(1)),
				'false detected as': await detect.type(false),
				'true detected as': await detect.type(true),
				'Symbol("foo") detected as': await detect.type(Symbol("foo")),
				'undefined detected as': await detect.type(undefined),
				'{} detected as': await detect.type({}),
				'() => {} detected as': await detect.type(() => {}),
				'detect.type detected as': await detect.type(detect.type),
				'Promise detected as': await detect.type(new Promise(() => {})),
				'Error detected as': await detect.type(new Error('Hello World!')),
			}
		])
		
		debug.checkpoint({
			title: 'API End'
		})
		await debug.renderCheckpoints()
		let render = await output.render()
		return render
	}
	
}

