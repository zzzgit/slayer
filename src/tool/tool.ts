import {Card} from "cardation"
import {HandOutcome} from "bac-motor"
const tool = {
	countNextHandScore(handResult: HandOutcome | undefined): number {
		let result = 0
		if (!handResult) {
			return 0
		}
		const score = this._countScore(handResult)
		result = score
		return result
	},
	//
	countHandScore(
		handResult: HandOutcome | undefined,
		shouldConsiderPre: boolean = false
	): number {
		let result = 0
		if (!handResult) {
			return 0
		}
		result = this._countScoreByWait(handResult, shouldConsiderPre)
		return result
	},
	// 權重直接用整數表示分數，沒用下面的數組，可以對比兩種算法的效果
	_countScore(handOutcome: HandOutcome): number {
		const bhand = handOutcome.bancoHand
		const phand = handOutcome.puntoHand
		const cards: Card[] = [
			...bhand.getDuplicatedCardArray(),
			...phand.getDuplicatedCardArray(),
		]
		let result = 0
		// 資料來源：https://www.888casino.com/blog/baccarat-tips/card-counting-in-baccarat  莊和閒，用兩個不同的算法
		cards.forEach((card) => {
			let delta = 0
			const score = card.getPoint()
			if (0 < score && score < 4) {
				delta = -1
			} else if (score === 4) {
				delta = -2
			} else if (score === 5) {
				delta = 1
			} else if (score === 6) {
				delta = 2
			} else if (score === 7 || score === 8) {
				delta = 1
			}
			result = result + delta
		})
		return result
	},
	_countScoreByWait(
		handOutcome: HandOutcome,
		shouldConsiderPre: boolean = false
	): number {
		const bhand = handOutcome.bancoHand
		const phand = handOutcome.puntoHand
		const cards: Card[] = [
			...bhand.getDuplicatedCardArray(),
			...phand.getDuplicatedCardArray(),
		]
		const prev = handOutcome.getPreviousHandOutcome()
		if (shouldConsiderPre && prev) {
			const previousBHand = prev.bancoHand
			const previousPHand = prev.puntoHand
			cards.push(
				...previousBHand.getDuplicatedCardArray(),
				...previousPHand.getDuplicatedCardArray()
			)
		}
		const prevPrev = prev?.getPreviousHandOutcome()
		if (shouldConsiderPre && prevPrev) {
			const previousBHand = prevPrev.bancoHand
			const previousPHand = prevPrev.puntoHand
			cards.push(
				...previousBHand.getDuplicatedCardArray(),
				...previousPHand.getDuplicatedCardArray()
			)
		}
		let result = 0
		const scorArray = bankerWeightArr
		cards.forEach((card) => {
			result = result + scorArray[card.getPoint()]
		})
		return result
	},
}

export default tool

const bankerWeightArr = [
	-188, -440, -522, -649, -1157, 827, 1132, 827, 502, 231,
]
// const playerWeightarr = [-178, -448, -543, -672, -1195, 841, 1128, 817, 533, 249]
// const tiara = [-5129, -1293, 2392, 2141, 2924, 2644, 11595, 10914, -6543, -4260]
