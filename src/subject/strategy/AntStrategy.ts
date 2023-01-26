
import Strategy from "../../model/strategy/Strategy"
import BetOrUndefined from "../../model/strategy/type/BetOrUndefined"
import {Bet, FreeMun as Free, BancoMun as Banker, PuntoMun as Player, HandOutcome} from "bac-motor"
import samael from "samael"

let counter = 0
class AntStrategy extends Strategy {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	figureOutBet(lastBet: BetOrUndefined, _lastOutcome: HandOutcome): Bet {
		counter++
		const freeGame = new Bet(new Free(), 0)
		const gen = this.getProgressionGenerator()
		if (!lastBet) {
			lastBet = freeGame
		}
		if (!(lastBet.getMun() instanceof Free)) {
			// 此處取到的始終是上上手，因為freegame沒有被bac-motor記錄下來
			// return freeGame
		}
		if (counter > 1 && counter % 2 == 0) {
			return freeGame
		}
		if (samael.flipCoin()) {
			return new Bet(new Banker(), gen.next().value as number)
		}
		return new Bet(new Player(), gen.next().value as number)
	}

	setBalance(b: number):void {
		this.getProgressionGenerator().setBalance(b)
	}
}

export default AntStrategy
