// import HandOutcomeOrUndefined from "../model/strategy/type/HandOutcomeOrUndefined"
// import BetOrUndefined from "../model/strategy/type/BetOrUndefined"
// import MartingaleBetProgression from "./strategy/MartingaleBetProgression"
// import CardCountingStrategy from "./strategy/CardCountingStrategy"
// import {Engine, HandOutcome, HandResult, Bet, FreeMun as Free, BancoMun as Banker, PuntoMun as Player} from "bac-motor"
// import CliTable from "../report/Table"
// import util from "../tool/util"
// import massiveTestConfig from "../config/massiveTestConfig"

// const engine = new Engine()
// const shoeAmount = 6000

// const tableDistribution = new CliTable({
// 	head: ['bet/result', 'win', 'loss', 'tie'],
// 	colWidths: [15, 15, 15, 15],
// 	style: {"compact": false, 'padding-left': 1},
// })


// let result = {
// 	total: 0,
// 	banker: {
// 		win: 0,
// 		lose: 0,
// 		tie: 0,
// 	},
// 	player: {
// 		win: 0,
// 		lose: 0,
// 		tie: 0,
// 	},
// }


// const testCase = {
// 	init() {
// 		const config = Object.assign({}, massiveTestConfig, {shouldGenerateRoad: false, shouldCutShoe: true})
// 		engine.powerOn(config)
// 	},
// 	run() {
// 		result = {
// 			total: 0,
// 			banker: {
// 				win: 0,
// 				lose: 0,
// 				tie: 0,
// 			},
// 			player: {
// 				win: 0,
// 				lose: 0,
// 				tie: 0,
// 			},
// 		}
// 		for (let i = 0; i < shoeAmount; i++) {
// 			// 不斷create，導致取到的amount為初始值
// 			const seq = new MartingaleBetProgression(1, 10)
// 			const system = new CardCountingStrategy(seq)
// 			let bet: Bet
// 			const beforePlay = (prevBet: BetOrUndefined, prevComeout: HandOutcomeOrUndefined): Bet => {
// 				bet = system.figureOutBet(prevBet, prevComeout)
// 				return bet
// 			}
// 			const afterPlay = (handResult: HandOutcome): void => {
// 				result.total++
// 				if (bet.getMun() instanceof Free) {
// 					return undefined
// 				}
// 				if (bet.getMun() instanceof Banker) {
// 					const bResult = result.banker
// 					if (handResult.result == HandResult.BancoWins) {
// 						bResult.win = bResult.win + 1
// 					} else if (handResult.result == HandResult.PuntoWins) {
// 						bResult.lose = bResult.lose + 1
// 					} else if (handResult.result == HandResult.Tie) {
// 						bResult.tie = bResult.tie + 1
// 					}
// 				}
// 				if (bet.getMun() instanceof Player) {
// 					const pResult = result.player
// 					if (handResult.result == HandResult.BancoWins) {
// 						pResult.lose = pResult.lose + 1
// 					} else if (handResult.result == HandResult.PuntoWins) {
// 						pResult.win = pResult.win + 1
// 					} else if (handResult.result == HandResult.Tie) {
// 						pResult.tie = pResult.tie + 1
// 					}
// 				}
// 			}
// 			engine.playOneShoe(beforePlay, afterPlay)
// 		}
// 		const pResult = result.player
// 		const bResult = result.banker
// 		tableDistribution.push(["bet on P", pResult.win, pResult.lose, pResult.tie],
// 			["bet on B", bResult.win, bResult.lose, bResult.tie],
// 			["total", pResult.win + bResult.win, pResult.lose + bResult.lose, pResult.tie + bResult.tie],

// 		)
// 		// [100 + "%", util.percentize(result.bankerTimes / totalHands) + "%", util.percentize(result.playerTimes / totalHands) + "%", util.percentize(result.tieTiems / totalHands) + "%"],
// 		// ["scor/hand", (result.bankerScore / result.bankerTimes).toFixed(2), (result.playerScore / result.playerTimes).toFixed(2), (result.tieScore / result.tieTiems).toFixed(2)])

// 		engine.shutdown()
// 	},
// 	report() {
// 		tableDistribution.print(`三千靴牌，大小牌算牌法，輸贏：`)
// 		// 百家樂理論值：1.02767525608，想要贏錢：1.05254515599
// 		console.log("買莊， W/L:", util.percentize(result.banker.win / result.banker.lose, 2))
// 		console.log("買閒， W/L:", util.percentize(result.player.win / result.player.lose, 2))
// 	},
// }

// testCase.init()
// testCase.run()
// testCase.report()

/**
 * 1. 由於算牌無效，這個實驗無意義，代碼沒有優化
 * 2.
 */
