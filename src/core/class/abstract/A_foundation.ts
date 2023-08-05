import { debug } from '../debug'

export abstract class A_foundation {
	
	protected static async init(classMethodThis : Function) {
		await debug.checkpoint.classStaticInit(classMethodThis)
	}
	
	public static test = async() => {
		console.log('Hello World!!!')
	}
	
	
	
	
}
