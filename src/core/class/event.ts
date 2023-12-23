import { Context, APIGatewayEvent, APIGatewayProxyResultV2 } from 'aws-lambda'
import { output, E_renderMode, T_renderMode } from './output'
import { detect } from './detect'
import { _, debug } from './debug'
import { options } from './options'

export class event {
	public static async api(
		event: APIGatewayEvent,
		context: Context,
	): Promise<APIGatewayProxyResultV2> {
		await debug.checkpoint.other({
			title: 'API Start',
		})

		_.log(event)

		if ((await detect.type(event.queryStringParameters)) === 'object') {
			const get = event.queryStringParameters || {}

			if (get.renderMode in E_renderMode) {
				await output.renderMode(get.renderMode as T_renderMode)
			}
		}

		await output.reset()
		await output._replace('message', 'Hello from TypeScript!')

		const test1 = new options({
			a: 1,
			b: 1,
			c: 3,
		})

		await test1.set({
			b: 2,
			d: 5,
		})

		const test2 = await test1.duplicate()
		await test2.reset()
		await test2.set({
			a: 4,
		})

		// await test.reset()

		await output.append('type_test', [
			{
				test1: await test1.get(),
				test2: await test2.get(),
			},
		])

		// await output.append('type_test', [
		// 	{
		// 		'null detected as': await detect.type(null),
		// 		'[] detected as': await detect.type([]),
		// 		'Number.NaN detected as': await detect.type(Number.NaN),
		// 		'Number.POSITIVE_INFINITY detected as': await detect.type(Number.POSITIVE_INFINITY),
		// 		'Number.NEGATIVE_INFINITY detected as': await detect.type(Number.NEGATIVE_INFINITY),
		// 		'"" detected as': await detect.type(""),
		// 		'"0" detected as': await detect.type("0"),
		// 		'0 detected as': await detect.type(0),
		// 		'1 detected as': await detect.type(1),
		// 		'BigInt(9007199254740991) detected as': await detect.type(BigInt(9007199254740991)),
		// 		'BigInt(1) detected as': await detect.type(BigInt(1)),
		// 		'false detected as': await detect.type(false),
		// 		'true detected as': await detect.type(true),
		// 		'Symbol("foo") detected as': await detect.type(Symbol("foo")),
		// 		'undefined detected as': await detect.type(undefined),
		// 		'{} detected as': await detect.type({}),
		// 		'() => {} detected as': await detect.type(() => {}),
		// 		'detect.type detected as': await detect.type(detect.type),
		// 		'Promise detected as': await detect.type(new Promise(() => {})),
		// 		'Error detected as': await detect.type(new Error('Hello World!')),
		// 	}
		// ])

		// await a.syncWhile(async(end) => {
		// 	if (b === 10) {
		// 		return end()
		// 	}
		// 	b++
		// 	console.log(b)
		// })

		await debug.checkpoint.other({
			title: 'API End',
		})
		await debug.renderCheckpoints()
		const render = await output.render()
		return render
	}
}
