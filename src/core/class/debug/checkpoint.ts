// import { output, T_outputMetaValue } from '../output'

import { debug, T_debugPreciseTime } from '../debug'

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
	preciseTime?: T_debugPreciseTime
}

export type T_debugCheckpoint = T_debugCheckpointInput & {
	description: string
	type: T_debugLevels
	preciseTime: T_debugPreciseTime
}

export type T_debugCheckpoints = T_debugCheckpoint[]



export const _ = console

export class checkpoint {
	
	public _checkpoints: T_debugCheckpoints = []
	
	
	public static async init(): Promise<void> {
		
		
		// await this.classStaticInit(this)
	}
	
	
	
	/**
	 * Create a debug checkpoint. Checkpoints are used for tracking in what order
	 * actions happen and how long between each action occurs. This is extremely
	 * useful for finding where performance optimizations are needed.
	 *
	 * @param checkpointInput
	 * @return {Promise<T_debugCheckpoint>}
	 */
	public async other(checkpointInput: T_debugCheckpointInput): Promise<T_debugCheckpoint> {
		const checkpointData: T_debugCheckpoint = {
			...checkpointInput,
			preciseTime : checkpointInput.preciseTime ?? await debug.getPreciseTime(),
			description : checkpointInput.description ?? '',
			type        : checkpointInput.type ?? E_debugLevels.info
		}
		this._checkpoints.push(checkpointData)
		return checkpointData
	}
	
	public async classStaticInit(classMethodThis : Function) {
		await this.other({
			title : `Class "${classMethodThis.prototype.constructor.name}" initialized`,
			description: ""
		})
	}
	
	
	
}
