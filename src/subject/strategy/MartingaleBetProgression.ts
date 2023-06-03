import Progression from "../../model/strategy/Progression"
import Instruct from "../../model/strategy/generator/Instruct"

class MartingaleBetProgression extends Progression {
	private _seed: number

	private _steps: number

	constructor(seed: number, step: number) {
		super()
		this._seed = seed
		this._steps = step
	}

	*_getGen(): Generator<number, void, boolean> {
		const context = this.getContext()
		const seed = this._seed
		if (seed < 0) {
			throw new Error("init must be above 0")
		}
		while (true) {
			for (let i = 0; i < this._steps; i++) {
				if (context.instruct == Instruct.Reset) {
					context.instruct = Instruct.DoNothing
					i = 0
				}
				const result = 2 ** i * seed
				yield result
			}
		}
	}
}

export default MartingaleBetProgression
