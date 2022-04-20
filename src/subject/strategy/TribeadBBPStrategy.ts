
// import Strategy from "../../model/strategy/Strategy"
// import {Bet, FreeMun as Free, PuntoMun as Player, HandOutcome, HandResult} from "bac-motor"

// class TribeadBBPStrategy extends Strategy {
// 	// 根本不完善，以後要改成用三株路
// 	figureOutBet(lastBet: Bet | undefined, lastComeout: HandOutcome| undefined): Bet {
// 		const freeGame = new Bet(new Free(), 0)
// 		if (!lastBet || !lastComeout) {
// 			return freeGame
// 		}
// 		if (lastComeout.handIndex % 3 !== 1) {
// 			return freeGame
// 		}
// 		if (lastComeout.result === HandResult.PuntoWins) {
// 			return freeGame
// 		}
// 		const prev = lastComeout.getPreviousHandOutcome()
// 		if (prev && prev.result === HandResult.PuntoWins) {
// 			return freeGame
// 		}
// 		// 輸了兩次，先停一手
// 		if (lastBet.getOutcome().result === HandResult.BancoWins) {
// 			const prev = lastBet.getPreviousBet()
// 			if (prev && prev.getOutcome().result === HandResult.BancoWins) {
// 				return freeGame
// 			}
// 		}
// 		return new Bet(new Player(), this.getSequenceGenerator().next().value as number)
// 	}
// }

// export default TribeadBBPStrategy
