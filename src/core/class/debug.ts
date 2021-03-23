import { output, T_outputMetaValue } from './output'
import { checkpoint, T_checkpointPreciseTime, T_checkpointTimestamp, T_checkpointHighResolutionTime } from './debug/checkpoint'

export enum E_debugLevels {
	info    = 'info',
	notice  = 'notice',
	warning = 'warning',
	error   = 'error',
}

// export type T_debugLevels = keyof typeof E_debugLevels
//
//
//
// export type T_debugCheckpointInput = {
// 	title: string
// 	description?: string
// 	type?: T_debugLevels
// 	preciseTime?: T_debugPreciseTime
// }
//
// export type T_debugCheckpoint = T_debugCheckpointInput & {
// 	description: string
// 	type: T_debugLevels
// 	preciseTime: [number, number]
// }
//
// export type T_debugCheckpoints = T_debugCheckpoint[]
//
// export type T_debugTimestamp = number
//
export type T_debugHighResolutionTime = T_checkpointHighResolutionTime


export type T_debugPreciseTime = T_checkpointPreciseTime
export type T_debugTimestamp = T_checkpointTimestamp

export const _ = console

export class debug {
	
	
	public static checkpoint : checkpoint = new checkpoint
	
	
	public static async init(timestamp : T_debugTimestamp, highResolutionTime : T_debugHighResolutionTime): Promise<void> {
		await checkpoint.init()
		
		await this.checkpoint.other({
			title       : `Runtime Started`,
			preciseTime : await checkpoint.getPreciseTime(highResolutionTime),
		})
		
		await this.checkpoint.other({
			title : `apple`,
		})
		
		await debug.sleep(50)
		
		await this.checkpoint.other({
			title : `banana`,
		})
		
		await this.checkpoint.classStaticInit(this)
	}
	
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
	
	
	public static async renderCheckpoints(): Promise<void> {
		let checkpointOutput: T_outputMetaValue[] = []
		
		let i                 = 0
		const firstCheckpoint = this.checkpoint._checkpoints[0]
		for (const checkpoint of this.checkpoint._checkpoints) {
			const prevCheckpoint           = this.checkpoint._checkpoints[i - 1] ?? checkpoint
			const checkpointTimestamp      = checkpoint.preciseTime
			const prevCheckpointTimestamp  = prevCheckpoint.preciseTime
			const firstCheckpointTimestamp = firstCheckpoint.preciseTime
			checkpointOutput.push({
				title       : checkpoint.title,
				description : checkpoint.description,
				type        : checkpoint.type,
				preciseTime : checkpoint.preciseTime,
				lap         : Math.round((checkpointTimestamp - prevCheckpointTimestamp) * 1e6) / 1e3,
				total       : Math.round((checkpointTimestamp - firstCheckpointTimestamp) * 1e6) / 1e3
			})
			i++
		}
		
		await output._replace('checkpoints', checkpointOutput)
		
	}
	
}
