import Strategy from '../../model/strategy/Strategy'
import BetOrUndefined from '../../model/strategy/type/BetOrUndefined'
import {
	BancoMun as Banker,
	Bet,
	FreeMun as Free,
	HandOutcome,
	PuntoMun as Player,
} from 'bac-motor'
import * as samael from 'samael'

let counter = 0
class AntStrategy extends Strategy{

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	figureOutBet(lastBet: BetOrUndefined, _lastOutcome: HandOutcome): Bet{
		counter++
		const freeGame = new Bet(new Free(), 0)
		const gen = this.getProgressionGenerator()
		if (!lastBet){
			lastBet = freeGame
		}
		if (!(lastBet.getMun() instanceof Free)){
			// 此處取到的始終是上上手，因為freegame沒有被bac-motor記錄下來，應該修改之，使其能夠被記錄下來
			// 這個分支已經不需要，因為用了下面的if分支代替
			// return freeGame
		}
		if (counter > 1 && counter % 2 == 0){
			return freeGame
		}
		if (samael.flipCoin()){
			return new Bet(new Banker(), gen.next().value as number)
		}
		return new Bet(new Player(), gen.next().value as number)
	}

	setBalance(b: number): void{
		this.getProgressionGenerator().setBalance(b)
	}

}

export default AntStrategy
