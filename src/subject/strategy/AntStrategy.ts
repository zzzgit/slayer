
import Strategy from "../../model/strategy/Strategy"
import BetOrUndefined from "../../model/strategy/type/BetOrUndefined"
import {Bet, FreeMun as Free, BankerMun as Banker, PlayerMun as Player, HandOutcome} from "bac-motor"
import samael from "samael"

class AntStrategy extends Strategy {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	figureOutBet(lastBet: BetOrUndefined, _lastOutcome: HandOutcome): Bet {
		const freeGame = new Bet(new Free(), 0)
		const gen = this.getProgressionGenerator()
		if (!(lastBet?.getMun() instanceof Free)) {
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
