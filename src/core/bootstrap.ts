import {output} from "./class/output"

export class application {
	public static async api(event: object, context: object) {
		
		await output.metaReplace('message', 'Hello from TypeScript!')
		await output.append('test', [
			{
				a: "foo",
				b: "bar",
				c: "baz",
			}
		])
		await output.append('test', [
			{
				hello: "world"
			}
		])
		
		return await output.render()
	}
	
}

