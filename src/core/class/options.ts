import { foundation } from './abstract/foundation'

export type T_optionsState = {
	[key: string]: any
}

export class options extends foundation {
	
	
	private readonly defaultState: T_optionsState = {}
	private readonly optionState: T_optionsState  = {}
	
	/**
	 * Create a options object
	 *
	 * @param {T_optionsState} defaultOptions The default options
	 * @param {T_optionsState} options Any options you want to apply immediately
	 */
	public constructor(defaultOptions: T_optionsState, options?: T_optionsState) {
		super()
		this.defaultState = { ...defaultOptions }
		this.optionState  = { ...this.defaultState }
		if (typeof options !== 'undefined') {
			(async() => await this.set(options))()
		}
	}
	
	public async getDefaults() {
		return this.defaultState
	}
	
	public async get() {
		return this.optionState
	}
	
	public async set(options: T_optionsState) {
		for (const key of Object.keys(this.defaultState)) {
			const type = typeof options[key]
			if (type !== 'undefined') {
				this.optionState[key] = options[key]
			}
		}
		return this.get()
	}
	
	public async reset() {
		// We use this method instead of object spread/assign to preserve references
		for (const key of Object.keys(this.defaultState)) {
			this.optionState[key] = this.defaultState[key]
		}
		return this.get()
	}
	
	public async duplicate() {
		return new options(await this.getDefaults(), await this.get())
	}
	
	
}


