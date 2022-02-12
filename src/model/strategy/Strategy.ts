import {Bet} from "bac-motor"
import BetSequence from "./BetSequence"
import ResetableGenerator from "./generator/ResetableGenerator"
import BetOrUndefined from "./type/BetOrUndefined"
import HandOutcomeOrUndefined from "./type/HandOutcomeOrUndefined"

abstract class Strategy {
	private readonly _sequence: BetSequence

	abstract figureOutBet(lastBet: BetOrUndefined, lastHandComeout: HandOutcomeOrUndefined): Bet

	constructor(sequence: BetSequence) {
		this._sequence = sequence
	}

	getSequenceGenerator(): ResetableGenerator<number, void, boolean> {
		return this._sequence.getGenerator()
	}
}

export default Strategy
