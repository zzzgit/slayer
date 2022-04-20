import {Card} from "cardation"
import {HandResult, HandOutcome} from "bac-motor"
const tool = {
	countHandScore(handResult: HandOutcome | undefined):number {
		let result = 0
		if (!handResult || handResult.result == HandResult.BancoWins) {
			return 0
		}
		let score = this._countScore(handResult)
		if (score < 3) {
			return 0
		}
		result += score
		const prev = handResult.getPreviousHandOutcome()
		if (!prev || handResult.result == HandResult.BancoWins) {
			return 0
		}
		score = this._countScore(prev)
		if (score < 3) {
			return 0
		}
		result += score
		// prev = prev.getPreviousHandOutcome()
		// if (!prev || handResult.result == HandResult.PuntoWins) {
		// 	return 0
		// }
		// score = this._countScore(prev)
		// if (score > -2) {
		// 	return 0
		// }
		// result += score
		return result
	},
	_countScore(handResult: HandOutcome):number {
		const bhand = handResult.bancoHand
		const phand = handResult.puntoHand
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
}

export default tool
