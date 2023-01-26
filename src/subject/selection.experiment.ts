import HandOutcomeOrUndefined from "../model/strategy/type/HandOutcomeOrUndefined"
import {Engine, HandOutcome, Bet, FreeMun as Free, HandResult, BancoMun as Banker, PuntoMun as Player} from "bac-motor"
import BetOrUndefined from "../model/strategy/type/BetOrUndefined"
import FlatBetProgression from "./strategy/FlatBetProgression"
import PiStrategy from "./strategy/PiStrategy"
import CliTable from "../report/Table"

const engine = new Engine()
const shoeAmount = 1000

const tableDistribution = new CliTable({
	head: ['', 'win', 'lose', 'tie'],
	colWidths: [15, 15, 15, 15],
	style: {"compact": false, 'padding-left': 1},
})

const result = {
	total: 0,
	b: {
		win: 0,
		lose: 0,
		tie: 0,
	},
	p: {
		win: 0,
		lose: 0,
		tie: 0,
	},
}

const testCase = {
	init() {
		engine.powerOn()
	},
	run() {
		for (let i = 0; i < shoeAmount; i++) {
			let isFree = false
			const seq = new FlatBetProgression(1)
			const system = new PiStrategy(seq)
			let bet: Bet
			const beforePlay = (prevBet: BetOrUndefined, prevComeout: HandOutcomeOrUndefined): Bet => {
				bet = system.figureOutBet(prevBet, prevComeout as HandOutcome)
				isFree = bet.getMun() instanceof Free ? true : false
				return bet
			}
			const afterPlay = (hOutcome: HandOutcome): void => {
				if (isFree) {
					return undefined
				}
				// 押莊
				if (bet.getMun() instanceof Banker) {
					if (hOutcome.result == HandResult.PuntoWins) {
						result.b.lose++
					} else if (hOutcome.result == HandResult.BancoWins) {
						result.b.win++
					} else {
						result.b.tie++
					}
				}
				// 押閒
				if (bet.getMun() instanceof Player) {
					if (hOutcome.result == HandResult.PuntoWins) {
						result.p.win++
					} else if (hOutcome.result == HandResult.BancoWins) {
						result.p.lose++
					} else {
						result.p.tie++
					}
				}

				result.total++
			}
			engine.playOneShoe(beforePlay, afterPlay)
		}
		tableDistribution.push(["B", result.b.win, result.b.lose, result.b.tie])
		tableDistribution.push(["P", result.p.win, result.p.lose, result.p.tie])
		// tableDistribution.push(["100%", util.percentize(result.p / (result.p + result.b), 2) + "%", "", util.percentize(result.b / (result.p + result.b), 2) + "%"])
		engine.shutdown()
	},
	report() {
		tableDistribution.print(`300 shoes，according to Pi：`)
	},
}


testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 根據圓周率下注，理論上，概率應該跟拋硬幣一樣
 * 2.
 */
