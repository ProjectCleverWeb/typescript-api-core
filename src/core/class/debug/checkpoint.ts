import { debug, E_debugLevels, T_debugHighResolutionTime, T_debugLevels, T_debugPreciseTime } from '../debug'
import { output, T_outputMetaValue } from '../output'

/**
 * Inputs allowed for a checkpoint object
 */
export type T_checkpointInput = {
	title: string
	description?: string
	type?: T_debugLevels
	preciseTime?: T_debugPreciseTime
}

/**
 * Checkpoint object as it is stored
 */
export type T_checkpointData = T_checkpointInput & {
	description: string
	type: T_debugLevels
	preciseTime: T_debugPreciseTime
}

/**
 * Checkpoint object as it is rendered for output
 */
export type T_checkpointDataRendered = T_checkpointData & {
	lap: number,
	total: number
}

/**
 * Array of all the current checkpoints
 */
export type T_checkpoints = T_checkpointData[]

export class checkpoint {
	
	/**
	 * Array of all the current checkpoints
	 *
	 * @type {T_checkpoints}
	 * @private
	 */
	private _checkpoints: T_checkpoints = []
	
	/**
	 * Get all the current checkpoints
	 *
	 * @returns {Promise<T_checkpoints>}
	 */
	public async getCheckpoints(): Promise<T_checkpoints> {
		return this._checkpoints
	}
	
	/**
	 * Clear all the current checkpoints
	 *
	 * @returns {Promise<void>}
	 */
	public async reset(): Promise<void> {
		this._checkpoints = []
	}
	
	/**
	 * Create a general purpose debug checkpoint. (If applicable, it is preferred
	 * for you to use one of the other checkpoint methods)
	 *
	 * Checkpoints are used for tracking in what order actions happen and how
	 * long between each action occurs. This is extremely useful for finding where
	 * performance optimizations are needed.
	 *
	 * @param checkpointInput
	 * @return {Promise<T_checkpointData>}
	 */
	public async other(checkpointInput: T_checkpointInput): Promise<T_checkpointData> {
		const checkpointData: T_checkpointData = {
			...checkpointInput,
			preciseTime : checkpointInput.preciseTime ?? await debug.getPreciseTime(),
			description : checkpointInput.description ?? '',
			type        : checkpointInput.type ?? E_debugLevels.info
		}
		this._checkpoints.push(checkpointData)
		return checkpointData
	}
	
	/**
	 * Create a checkpoint for calling a class's init() function
	 *
	 * @param {Function} classMethodThis
	 * @returns {Promise<T_checkpointData>}
	 */
	public async classStaticInit(classMethodThis: Function): Promise<T_checkpointData> {
		return this.other({
			title       : `Class "${classMethodThis.prototype.constructor.name}" initialized`,
			description : 'This class has called its initializing function'
		})
	}
	
	/**
	 * Create a checkpoint for when the request is made
	 *
	 * @param {T_debugPreciseTime} requestTimestamp
	 * @returns {Promise<T_checkpointData>}
	 */
	public async requestMade(requestTimestamp: T_debugPreciseTime): Promise<T_checkpointData> {
		return this.other({
			title       : `Request Made`,
			description : 'The time the request was made according to the Node server. (millisecond accurate)',
			preciseTime : requestTimestamp / 1e3
		})
	}
	
	/**
	 * Create a checkpoint for when the runtime has started
	 *
	 * @param {T_debugHighResolutionTime} highResolutionTime
	 * @returns {Promise<T_checkpointData>}
	 */
	public async runtimeStarted(highResolutionTime: T_debugHighResolutionTime): Promise<T_checkpointData> {
		return this.other({
			title       : `Runtime Started`,
			description : 'The time the request started to be processed by the runtime',
			preciseTime : await debug.getPreciseTime(highResolutionTime)
		})
	}
	
	/**
	 * Render all the current checkpoints to output
	 *
	 * @returns {Promise<void>}
	 */
	public async render(): Promise<void> {
		let checkpointOutput: T_outputMetaValue[] = []
		const checkpoints: T_checkpoints          = this._checkpoints
		
		let i                 = 0
		const firstCheckpoint = checkpoints[0]
		for (const checkpoint of checkpoints) {
			const prevCheckpoint                               = checkpoints[i - 1] ?? checkpoint
			const checkpointRendered: T_checkpointDataRendered = {
				title       : checkpoint.title,
				description : checkpoint.description,
				type        : checkpoint.type,
				preciseTime : checkpoint.preciseTime,
				lap         : Math.round((checkpoint.preciseTime - prevCheckpoint.preciseTime) * 1e6) / 1e3,
				total       : Math.round((checkpoint.preciseTime - firstCheckpoint.preciseTime) * 1e6) / 1e3
			}
			checkpointOutput.push(checkpointRendered)
			i++
		}
		
		await output._replace('checkpoints', checkpointOutput)
	}
	
}
