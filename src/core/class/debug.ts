import { output, T_outputMetaValue } from './output'

export enum E_debugLevels {
	info    = 'info',
	notice  = 'notice',
	warning = 'warning',
	error   = 'error',
}

export type T_debugLevels = keyof typeof E_debugLevels

export type T_debugCheckpointInput = {
	title: string
	description?: string
	type?: T_debugLevels
}

export type T_debugCheckpoint = T_debugCheckpointInput & {
	description: string
	type: T_debugLevels
	hrTime: bigint
}

export type T_debugCheckpoints = T_debugCheckpoint[]


export const _ = console

export class debug {
	
	public static _checkpoints: T_debugCheckpoints = []
	
	
	/**
	 * Simple sleep/wait function
	 *
	 * @param {number} milliseconds
	 * @returns {Promise<void>}
	 */
	public static async sleep(milliseconds: number): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(resolve, milliseconds)
		})
	}
	
	public static async log(message: string): Promise<void> {
		return _.log(message)
	}
	
	/**
	 * Create a debug checkpoint. Checkpoints are used for tracking in what order
	 * actions happen and how long between each action occurs. This is extremely
	 * useful for finding where performance optimizations are needed.
	 *
	 * @param checkpointInput
	 * @return {Promise<T_debugCheckpoint>}
	 */
	public static checkpoint(checkpointInput: T_debugCheckpointInput): T_debugCheckpoint {
		const checkpoint: T_debugCheckpoint = {
			...checkpointInput,
			hrTime      : process.hrtime.bigint(),
			description : checkpointInput.description ?? '',
			type        : checkpointInput.type ?? E_debugLevels.info
		}
		this._checkpoints.push(checkpoint)
		return checkpoint
	}
	
	public static async renderCheckpoints(): Promise<void> {
		let checkpointOutput: T_outputMetaValue[] = []
		
		await Promise.all(this._checkpoints.map(async(checkpoint, i) => {
			const prevCheckpoint = this._checkpoints[i - 1] ?? checkpoint
			checkpointOutput.push({
				...checkpoint,
				diff : Math.round(Number(checkpoint.hrTime - prevCheckpoint.hrTime) / 1e3) / 1e3
			})
		}))
		
		await output._replace('checkpoints', checkpointOutput)
		
	}
	
}
