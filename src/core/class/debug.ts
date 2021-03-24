import { checkpoint } from './debug/checkpoint'

export enum E_debugLevels {
	info    = 'info',
	notice  = 'notice',
	warning = 'warning',
	error   = 'error',
}

export type T_debugLevels = keyof typeof E_debugLevels

export type T_debugTimestamp = number

export type T_debugHighResolutionTime = [number, number]

export type T_debugPreciseTime = number

export const _ = console

export class debug {
	
	
	public static _initHighResolutionTime = 0
	public static _initTimestamp          = 0
	public static checkpoint: checkpoint  = new checkpoint
	
	
	public static async init(timestamp: T_debugTimestamp, highResolutionTime: T_debugHighResolutionTime, requestTimestamp: number): Promise<void> {
		debug._initHighResolutionTime = await this.getHighResolutionTime()
		debug._initTimestamp          = await this.getTimestamp()
		
		await this.checkpoint.other({
			title       : `Request Made`,
			preciseTime : requestTimestamp / 1e3
		})
		
		await this.checkpoint.other({
			title       : `Runtime Started`,
			preciseTime : await this.getPreciseTime(highResolutionTime)
		})
		
		await this.checkpoint.classStaticInit(this)
	}
	
	/**
	 * Get a high resolution time (in seconds) as a float
	 *
	 * @param {T_debugHighResolutionTime} hrTime The value returned from `process.hrtime()`
	 * @returns {Promise<number>} The high resolution time as a float
	 */
	public static async getHighResolutionTime(hrTime?: T_debugHighResolutionTime): Promise<number> {
		if (typeof hrTime === 'undefined') {
			hrTime = process.hrtime()
		}
		return hrTime[0] + hrTime[1] / 1e9
	}
	
	/**
	 * Get a timestamp (in seconds) as a float
	 *
	 * @param {Date} date An instance of Date
	 * @returns {Promise<number>} The timestamp (in seconds) as a float
	 */
	public static async getTimestamp(date?: Date): Promise<number> {
		if (typeof date === 'undefined') {
			date = new Date
		}
		return date.getTime() / 1e3
	}
	
	/**
	 * Get a high resolution timestamp, relative to when the request was made
	 *
	 * @param {T_debugHighResolutionTime} hrTime The value returned from `process.hrtime()`
	 * @returns {Promise<T_debugPreciseTime>} The relative high resolution time as a float
	 */
	public static async getPreciseRelativeTime(hrTime?: T_debugHighResolutionTime): Promise<T_debugPreciseTime> {
		return await this.getHighResolutionTime(hrTime) - this._initHighResolutionTime
	}
	
	/**
	 * Get a really precise timestamp, with nanosecond accuracy. (seconds as
	 * a float) This is useful for checking how performant code is running.
	 *
	 * This is essentially a combination of high resolution time and a unix
	 * timestamp.
	 *
	 * @param {T_debugHighResolutionTime} hrTime The value returned from `process.hrtime()`
	 * @returns {Promise<T_debugPreciseTime>} The precise unix timestamp as a float
	 */
	public static async getPreciseTime(hrTime?: T_debugHighResolutionTime): Promise<T_debugPreciseTime> {
		return this._initTimestamp + await this.getPreciseRelativeTime(hrTime)
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
		await debug.checkpoint.render()
	}
	
}
