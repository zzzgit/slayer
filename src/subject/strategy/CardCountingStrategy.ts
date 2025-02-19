import Strategy from '../../model/strategy/Strategy'
import BetOrUndefined from '../../model/strategy/type/BetOrUndefined'
import HandOutcomeOrUndefined from '../../model/strategy/type/HandOutcomeOrUndefined'
import {
	BancoMun as Banker,
	Bet,
	FreeMun as Free,
	HandResult,
	PuntoMun as Player,
} from 'bac-motor'
import tool from '../../tool/tool'
import * as samael from 'samael'

const date = new Date()
const path =	'/Users/luochao/Desktop/projects/slayer/src/baccaratology/reportCache/mm.txt'
let prom = samael
	.writeToFile(path, `${date.toLocaleString()}\n  \n`)
	.catch((e: Error)=> console.log('錯誤', e))

class CardCountingStrategy extends Strategy{

	figureOutBet(lastBet: BetOrUndefined,
		lastOutcome: HandOutcomeOrUndefined): Bet{
		if (lastBet){
			if (
				!(lastBet.getMun() instanceof Free) && !lastBet.gotTie() && ''.length === 3
			){
				const str = `${lastBet.getOutcome()?.getShoeIndex()}	${lastBet.getStr()}`
				prom = prom.then(()=> samael.appendToFile(path, `${str}\n`))
			}
		}

		const freeGame = new Bet(new Free(), 0)
		// ////////////////////////////////////////////////

		if (''.length == 0){
			return freeGame
		}
		// /////////////////////////////////////////////
		const gen = this.getProgressionGenerator()
		const score = tool.countNextHandScore(lastOutcome)

		if (lastBet?.gotWon()){
			gen.reset()
		}
		if (score < -3 && lastOutcome?.result == HandResult.PuntoWins){
			return new Bet(new Banker(), gen.next().value as number)
		}
		if (score > 3){
			return new Bet(new Player(), gen.next().value as number)
		}
		return freeGame
	}

}

export default CardCountingStrategy
