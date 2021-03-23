// import { output, T_outputMetaValue } from '../output'

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
	preciseTime?: T_checkpointPreciseTime
}

export type T_debugCheckpoint = T_debugCheckpointInput & {
	description: string
	type: T_debugLevels
	preciseTime: T_checkpointPreciseTime
}

export type T_debugCheckpoints = T_debugCheckpoint[]

export type T_checkpointTimestamp = number

export type T_checkpointHighResolutionTime = [number, number]

export type T_checkpointPreciseTime = number


export const _ = console

export class checkpoint {
	
	public _checkpoints: T_debugCheckpoints = []
	
	public static _initHighResolutionTime = 0
	public static _initTimestamp = 0
	
	public static async init(): Promise<void> {
		checkpoint._initHighResolutionTime = await this.getHighResolutionTime()
		checkpoint._initTimestamp = await this.getTimestamp()
		
		// await this.classStaticInit(this)
	}
	
	public static async getHighResolutionTime(hrTime?: T_checkpointHighResolutionTime): Promise<number> {
		if (typeof hrTime === 'undefined') {
			hrTime = process.hrtime()
		}
		return hrTime[0] + hrTime[1] / 1e9
	}
	
	public static async getTimestamp(date?: Date): Promise<number> {
		if (typeof date === 'undefined') {
			date = new Date
		}
		return date.getTime() / 1e3
	}
	
	public static async getPreciseRelativeTime(hrTime?: T_checkpointHighResolutionTime): Promise<T_checkpointPreciseTime> {
		return await this.getHighResolutionTime(hrTime) - this._initHighResolutionTime
	}
	
	public static async getPreciseTime(hrTime?: T_checkpointHighResolutionTime): Promise<T_checkpointPreciseTime> {
		return this._initTimestamp + await this.getPreciseRelativeTime(hrTime)
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
			preciseTime : checkpointInput.preciseTime ?? await checkpoint.getPreciseTime(),
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
