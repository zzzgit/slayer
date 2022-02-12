import Progression from "../../model/strategy/Progression"


class AntBetProgression extends Progression {
	private _stepLength:number

	constructor(stepLenth: number = 1) {
		super()
		this._stepLength = stepLenth
	}

	* _getGen(): Generator<number, void, boolean> {
		const context = this.getContext()
		const len = this._stepLength
		while (true) {
			if ((context.balance || 0) >= 1090 * len) {
				yield 10
			}
			if ((context.balance || 0) >= 1080 * len) {
				yield 20
			}
			if ((context.balance || 0) >= 1070 * len) {
				yield 30
			}
			if ((context.balance || 0) >= 1060 * len) {
				yield 20
			}
			if ((context.balance || 0) >= 1050 * len) {
				yield 20
			}
			if ((context.balance || 0) >= 1040 * len) {
				yield 10
			}
			if ((context.balance || 0) >= 1030 * len) {
				yield 20
			}
			if ((context.balance || 0) >= 1020 * len) {
				yield 30
			}
			if ((context.balance || 0) >= 1010 * len) {
				yield 20
			}
			if ((context.balance || 0) >= 1000 * len) {
				yield 10
			}
			if ((context.balance || 0) < 1000 * len) {
				yield 10
			}
		}
	}
}

export default AntBetProgression
