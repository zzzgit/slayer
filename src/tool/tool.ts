import {Card} from "cardation"
import {HandOutcome} from "bac-motor"
const tool = {
	countHandScore(handResult: HandOutcome | undefined):number {
		let result = 0
		if (!handResult) {
			return 0
		}
		const score = this.countNew(handResult)
		// const prev = handResult.getPreviousHandOutcome()
		// let preScore = 0
		// if (prev) {
		// 	preScore = this.countNew(prev)
		// }
		result = score * 1
		// result = score + preScore
		return result
	},
	_countScore(handOutcome: HandOutcome):number {
		const bhand = handOutcome.bancoHand
		const phand = handOutcome.puntoHand
		const cards: Card[] = [...bhand.getDuplicatedCardArray(), ...phand.getDuplicatedCardArray()]
		let result = 0
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
			} else if (6 < score && score < 9) {
				delta = 1
			}
			result = result + delta
		})
		return result
	},
	countNew(handOutcome: HandOutcome): number {
		const bhand = handOutcome.bancoHand
		const phand = handOutcome.puntoHand
		const cards: Card[] = [...bhand.getDuplicatedCardArray(), ...phand.getDuplicatedCardArray()]
		let result = 0
		cards.forEach((card) => {
			let delta = 0
			const pointValue = card.getPoint()
			delta = bankerArr[pointValue]
			result = result + delta
		})
		return result
	},
}

export default tool

const bankerArr = [-188, -440, -522, -649, -1157, 827, 1132, 827, 502, 231]
// const playerarr = [178, 448, 543, 672, 119, -841, -1128, -817, -533, -249]
// const tiara = [-5129, -1293, 2392, 2141, 2924, 2644, 11595, 10914, -6543, -4260]
