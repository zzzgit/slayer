import { Bet } from 'bac-motor'
import Progression from './Progression'
import ResetableGenerator from './generator/ResetableGenerator'
import BetOrUndefined from './type/BetOrUndefined'
import HandOutcomeOrUndefined from './type/HandOutcomeOrUndefined'

abstract class Strategy{
	private readonly _sequence: Progression

	abstract figureOutBet(
		lastBet: BetOrUndefined,
		lastHandComeout: HandOutcomeOrUndefined
	): Bet

	constructor(sequence: Progression){
		this._sequence = sequence
	}

	getProgressionGenerator(): ResetableGenerator<number, void, boolean>{
		return this._sequence.getGenerator()
	}
}

export default Strategy
