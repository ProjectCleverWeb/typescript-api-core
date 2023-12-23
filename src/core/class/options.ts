import { foundation } from './abstract/foundation'

export type T_optionsState = {
	[key: string]: any
}

export class options extends foundation {
	private readonly _defaultState: T_optionsState = {}
	private readonly _optionState: T_optionsState = {}

	/**
	 * Create a options object
	 *
	 * @param {T_optionsState} defaultOptions The default options
	 * @param {T_optionsState} options Any options you want to apply immediately
	 */
	public constructor(defaultOptions: T_optionsState, options?: T_optionsState) {
		super()
		this._defaultState = { ...defaultOptions }
		this._optionState = { ...this._defaultState }
		if (typeof options !== 'undefined') {
			;(async () => await this.set(options))()
		}
	}

	public async getDefaults() {
		return this._defaultState
	}

	public async get() {
		return this._optionState
	}

	public async set(options: T_optionsState) {
		for (const key of Object.keys(this._defaultState)) {
			const type = typeof options[key]
			if (type !== 'undefined') {
				this._optionState[key] = options[key]
			}
		}
		return this.get()
	}

	public async reset() {
		// We use this method instead of object spread/assign to preserve references
		for (const key of Object.keys(this._defaultState)) {
			this._optionState[key] = this._defaultState[key]
		}
		return this.get()
	}

	public async duplicate() {
		return new options(await this.getDefaults(), await this.get())
	}
}
