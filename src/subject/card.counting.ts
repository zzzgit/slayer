
import HandOutcomeOrUndefined from "../model/strategy/type/HandOutcomeOrUndefined"
import BetOrUndefined from "../model/strategy/type/BetOrUndefined"
import MartingaleBetSequence from "./strategy/MartingaleBetSequence"
import CardCountingStrategy from "./strategy/CardCountingStrategy"
// eslint-disable-next-line node/no-extraneous-import
import {Engine, HandOutcome, HandResult, Bet, FreeMun as Free, BankerMun as Banker, PlayerMun as Player} from "baccarat-engine"
import CliTable from "../report/Table"

const engine = new Engine()
const shoeAmount = 6000

const tableDistribution = new CliTable({
	head: ['bet/result', 'win', 'loss', 'tie'],
	colWidths: [15, 15, 15, 15],
	style: {"compact": false, 'padding-left': 1},
})


let result = {
	total: 0,
	banker: {
		win: 0,
		lose: 0,
		tie: 0,
	},
	player: {
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
		result = {
			total: 0,
			banker: {
				win: 0,
				lose: 0,
				tie: 0,
			},
			player: {
				win: 0,
				lose: 0,
				tie: 0,
			},
		}
		for (let i = 0; i < shoeAmount; i++) {
			// 不斷create，導致取到的amount為初始值
			const seq = new MartingaleBetSequence(1, 10)
			const system = new CardCountingStrategy(seq)
			let bet: Bet
			const beforePlay = (prevBet: BetOrUndefined, prevComeout: HandOutcomeOrUndefined): Bet => {
				bet = system.figureOutBet(prevBet, prevComeout)
				return bet
			}
			const afterPlay = (handResult: HandOutcome): void => {
				result.total++
				if (bet.getMun() instanceof Free) {
					return undefined
				}
				if (bet.getMun() instanceof Banker) {
					const bResult = result.banker
					if (handResult.result == HandResult.BankerWins) {
						bResult.win = bResult.win + 1
					} else if (handResult.result == HandResult.PlayerWins) {
						bResult.lose = bResult.lose + 1
					} else if (handResult.result == HandResult.Tie) {
						bResult.tie = bResult.tie + 1
					}
				}
				if (bet.getMun() instanceof Player) {
					const pResult = result.player
					if (handResult.result == HandResult.BankerWins) {
						pResult.lose = pResult.lose + 1
					} else if (handResult.result == HandResult.PlayerWins) {
						pResult.win = pResult.win + 1
					} else if (handResult.result == HandResult.Tie) {
						pResult.tie = pResult.tie + 1
					}
				}
			}
			engine.playOneShoe(beforePlay, afterPlay)
			// const info = shoeresult.getStatisticInfo()
		}
		const bResult = result.player
		const pResult = result.banker
		tableDistribution.push(["bet on B", bResult.win, bResult.lose, bResult.tie],
			["bet on P", pResult.win, pResult.lose, pResult.tie],
			["total", bResult.win + pResult.win, bResult.lose + pResult.lose, bResult.tie + pResult.tie],

		)
		// [100 + "%", util.percentize(result.bankerTimes / totalHands) + "%", util.percentize(result.playerTimes / totalHands) + "%", util.percentize(result.tieTiems / totalHands) + "%"],
		// ["scor/hand", (result.bankerScore / result.bankerTimes).toFixed(2), (result.playerScore / result.playerTimes).toFixed(2), (result.tieScore / result.tieTiems).toFixed(2)])

		engine.shutdown()
	},
	report() {
		tableDistribution.print(`三千靴牌，大小牌算牌法，輸贏：`)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 算牌幾乎無用，有時表現比拋硬幣還差
 * 2.
 */

