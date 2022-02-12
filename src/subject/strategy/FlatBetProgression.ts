import Progression from "../../model/strategy/Progression"

class FlatBetProgression extends Progression {
	private _wager:number

	constructor(wager: number) {
		super()
		if (wager < 0) {
			throw new Error("wager must be above 0")
		}
		this._wager = wager
	}

	* _getGen(): Generator<number, void, boolean> {
		while (true) {
			yield this._wager
		}
	}
}

export default FlatBetProgression
