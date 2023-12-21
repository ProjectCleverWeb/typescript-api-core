const bitwise = {
	bit1: 1 << 0,
	bit2: 1 << 1,
	bit3: 1 << 2,
	bit4: 1 << 3
}

export enum E_ioTypes {
	phone = bitwise.bit1
}

export class io {
	public static async create(key: string, type: E_ioTypes) {
		return 1 + type
	}
}
