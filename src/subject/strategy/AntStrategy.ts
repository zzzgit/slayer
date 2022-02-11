
import Strategy from "../../model/strategy/Strategy"
import BetOrUndefined from "../../model/strategy/type/BetOrUndefined"
// eslint-disable-next-line node/no-extraneous-import
import {Bet, FreeMun as Free, BankerMun as Banker, PlayerMun as Player, HandOutcome} from "bac-motor"

const samael = require("samael")

class AntStrategy extends Strategy {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	figureOutBet(lastBet: BetOrUndefined, _lastOutcome: HandOutcome): Bet {
		const freeGame = new Bet(new Free(), 0)
		const gen = this.getSequenceGenerator()
		if (!(lastBet?.getMun() instanceof Free)) {
			return freeGame
		}
		if (samael.flipCoin()) {
			return new Bet(new Banker(), gen.next().value as number)
		}
		return new Bet(new Player(), gen.next().value as number)
	}

	setBalance(b: number):void {
		this.getSequenceGenerator().setBalance(b)
	}
}

export default AntStrategy
