import Context from "./Context"
import Instruct from "./Instruct"

// maybe need to extends the interface which Generate extends
class ResetableGenerator<YieldType, ReturnType, NextType> {
	private _context: Context

	private _gen: Generator<YieldType, ReturnType, NextType>

	constructor(
		gen: Generator<YieldType, ReturnType, NextType>,
		context: Context
	) {
		this._context = context
		this._gen = gen
	}

	setBalance(balance: number): void {
		this._context.balance = balance
	}

	reset(): void {
		this._context.instruct = Instruct.Reset
	}

	// 調用的時候，在錯誤的位置傳入參數，無法檢測到，所以還不如用reset，另外，由於先進行yield，然後在把外部參數傳入內部，所以也非常不方便，不如reset意義明顯
	next(...para: [] | [NextType]): IteratorResult<YieldType, ReturnType> {
		return this._gen.next(...para)
	}

	// 方便，但是破壞了底層原有邏輯
	getNext(shouldReset: boolean): IteratorResult<YieldType, ReturnType> {
		if (shouldReset) {
			this.reset()
		}
		return this._gen.next()
	}
}

export default ResetableGenerator
