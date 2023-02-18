import HandOutcomeOrUndefined from "../model/strategy/type/HandOutcomeOrUndefined"
import {Engine, HandOutcome, Bet, FreeMun as Free, HandResult} from "bac-motor"
import BetOrUndefined from "../model/strategy/type/BetOrUndefined"
import FlatBetProgression from "./strategy/FlatBetProgression"
import Player9to0Strategy from "./strategy/Player9to0Strategy"
import CliTable from "../report/Table"
import util from "../tool/util"

const engine = new Engine()
const shoeAmount = 5000

const tableDistribution = new CliTable({
	head: ['total', 'P win', 'tie', 'B win'],
	colWidths: [15, 15, 15, 15],
	style: {"compact": false, 'padding-left': 1},
})

const result = {
	total: 0,
	b: 0,
	p: 0,
	tie: 0,
}

const testCase = {
	init() {
		engine.powerOn()
	},
	run() {
		for (let i = 0; i < shoeAmount; i++) {
			let isFree = false
			const seq = new FlatBetProgression(1)
			const system = new Player9to0Strategy(seq)
			let bet: Bet
			const beforePlay = (prevBet: BetOrUndefined, prevComeout: HandOutcomeOrUndefined): Bet => {
				bet = system.figureOutBet(prevBet, prevComeout as HandOutcome)
				isFree = bet.getMun() instanceof Free ? true : false
				return bet
			}
			const afterPlay = (handResult: HandOutcome): void => {
				if (isFree) {
					return undefined
				}
				if (handResult.result == HandResult.PuntoWins) {
					result.p++
				} else if (handResult.result == HandResult.BancoWins) {
					result.b++
				} else {
					result.tie++
				}
				result.total++
			}
			engine.playOneShoe(beforePlay, afterPlay)
		}
		tableDistribution.push([result.total, result.p, result.tie, result.b])
		tableDistribution.push(["100%", util.percentize(result.p / (result.p + result.b), 2) + "%", "", util.percentize(result.b / (result.p + result.b), 2) + "%"])
		engine.shutdown()
	},
	report() {
		tableDistribution.print(`2000 shoes，player when 9 to 0：`)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 閒莊的點數9：0，然後買閒，沒有bias
 * 2. 不但不會贏，反而還輸一點點，倫理上莊閒的比例是1.02767525608，而這種打法，開出的結果1.035
 */
