import Context from "./generator/Context"
import Instruct from "./generator/Instruct"
import ResetableGenerator from "./generator/ResetableGenerator"


// 跟纜相關的東西，輸贏，只有輸贏，但是纜本身不需要知道輸贏，所以還是外界傳入比較合適
abstract class Progression {
	private readonly _context: Context = {instruct: Instruct.DoNothing}

	private _generator: ResetableGenerator<number, void, boolean> | undefined

	getGenerator(): ResetableGenerator<number, void, boolean> {
		// 不可重複新建
		if (this._generator) {
			return this._generator
		}
		const original: Generator<number, void, boolean> = this._getGen()
		const gen = new ResetableGenerator(original, this.getContext())
		this._generator = gen
		return gen
	}

	getContext(): Context {
		return this._context
	}

	abstract _getGen():Generator<number, void, boolean>
}

export default Progression
