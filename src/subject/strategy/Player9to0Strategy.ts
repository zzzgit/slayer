import Strategy from "../../model/strategy/Strategy"
import BetOrUndefined from "../../model/strategy/type/BetOrUndefined"
import HandOutcomeOrUndefined from "../../model/strategy/type/HandOutcomeOrUndefined"
import {Bet, FreeMun as Free, PuntoMun as Player} from "bac-motor"
// import samael from "samael"

// const date = new Date()
// const path = "/Users/luochao/Desktop/projects/slayer/src/baccaratology/reportCache/mm.txt"
// let prom = samael.writeToFile(path, `${date.toLocaleString()}\n  \n`).catch((e: Error) => console.log("錯誤", e))

class Player9to0Strategy extends Strategy {
	figureOutBet(_lastBet: BetOrUndefined, lastComeout: HandOutcomeOrUndefined): Bet {
		if (lastComeout?.puntoHand.getPoint() == 9 && lastComeout?.bancoHand.getPoint() == 0) {
			return new Bet(new Player(), 0)
		}
		const freeGame = new Bet(new Free(), 0)
		return freeGame
	}
}

export default Player9to0Strategy
