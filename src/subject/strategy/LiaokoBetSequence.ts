import BetSequence from "../../model/strategy/BetSequence"
import Instruct from "../../model/strategy/generator/Instruct"


class LiaokoBetSequence extends BetSequence {
	private _seed:number[]

	constructor(seed: number[]) {
		super()
		if (!Array.isArray(seed)) {
			throw new Error("seed must be an array")
		}
		this._seed = seed
	}

	* _getGen(): Generator<number, void, boolean> {
		const seed = this._seed
		const context = this.getContext()
		while (true) {
			for (let i = 0; i < seed.length; i++) {
				if (context.instruct == Instruct.Reset) {
					context.instruct = Instruct.DoNothing
					i = 0
				}
				const item: number = seed[i]
				yield item
				yield item * 2
			}
		}
	}
}

export default LiaokoBetSequence
