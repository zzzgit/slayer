import Progression from '../../model/strategy/Progression'

class AntBetProgression extends Progression{

	private _stepLength: number

	constructor(stepLenth: number = 1){
		super()
		this._stepLength = stepLenth
	}

	*_getGen(): Generator<number, void, boolean>{
		while (true){
			yield this.customized()
		}
	}

	customized(): number{
		const len = this._stepLength
		if (this.isBalanceHigherThan(10020 * len)){
			return 4
		}
		if (this.isBalanceHigherThan(10010 * len)){
			return 2
		}
		if (this.isBalanceHigherThan(10000 * len)){
			return 1
		}
		if (this.isBalanceHigherThan(9990 * len)){
			return 1
		}
		if (this.isBalanceHigherThan(9970 * len)){
			return 2
		}
		if (this.isBalanceHigherThan(9950 * len)){
			return 3
		}
		if (this.isBalanceHigherThan(9920 * len)){
			return 4
		}
		if (this.isBalanceHigherThan(9900 * len)){
			return 5
		}
		if (this.isBalanceHigherThan(9850 * len)){
			return 10
		}
		if (this.isBalanceHigherThan(9780 * len)){
			return 15
		}
		if (this.isBalanceHigherThan(9700 * len)){
			return 20
		}
		if (this.isBalanceHigherThan(9600 * len)){
			return 30
		}
		if (this.isBalanceHigherThan(9500 * len)){
			return 40
		}
		if (this.isBalanceHigherThan(9400 * len)){
			console.log(this.getContext().balance, 50)
			return 50
		}
		// if (this.isBalanceHigherThan(9000 * len)) {
		// 	console.log(this.getContext().balance, 3000)
		// 	return 3000
		// }
		return 1
	}

}

export default AntBetProgression
