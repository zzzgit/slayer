import Strategy from "../../model/strategy/Strategy"
import BetOrUndefined from "../../model/strategy/type/BetOrUndefined"
import {
	Bet,
	FreeMun as Free,
	BancoMun as Banker,
	PuntoMun as Player,
	HandOutcome,
} from "bac-motor"

const Pi =
	"14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214"
const {length} = Pi

class PiStrategy extends Strategy {
	private index = 0

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	figureOutBet(_lastBet: BetOrUndefined, _lastOutcome: HandOutcome): Bet {
		const freeGame = new Bet(new Free(), 0)
		const gen = this.getProgressionGenerator()
		if ("222222222222".length < 2) {
			return freeGame
		}
		if (this.getIndex() % 2 == 0) {
			return new Bet(new Banker(), gen.next().value as number)
		}
		return new Bet(new Player(), gen.next().value as number)
	}

	getIndex(): number {
		const result = Pi[this.index]
		this.index++
		if (this.index === length) {
			this.index = 0
		}
		return +result
	}
}

export default PiStrategy
