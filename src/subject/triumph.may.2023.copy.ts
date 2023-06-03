import {Engine, HandOutcome, HandResult} from "bac-motor"
import massiveTestConfig from "../config/massiveTestConfig"
import CliTable from "../report/Table"
import util from "../tool/util"
import CounterMap from "./collection/CounterMap"

const engine = new Engine()
const shoeAmount = 300
const round = 1
let previousConsecutiveSingle = 0
let previousConsecutiveDouble = 0
let consecutiveLose = 0
let consecutiveWin = 0
const loseMap = new CounterMap<number>()
const winMap = new CounterMap<number>()
const tableForResult = new CliTable({
	head: ["result", "W", "L", "tie", "total"],
	colWidths: [20, 20, 20, 20, 20],
	style: {compact: false, "padding-left": 1},
})
const tableForProfit = new CliTable({
	head: ["profit rate", "B", "P", "total"],
	colWidths: [20, 20, 20, 20],
	style: {compact: false, "padding-left": 1},
})

let result = {
	banker: {tie: 0, win: 0, lose: 0},
	player: {tie: 0, win: 0, lose: 0},
}

const testCase = {
	init() {
		const config = Object.assign({}, massiveTestConfig, {
			shouldGenerateRoad: true,
			shouldCutShoe: true,
		})
		engine.powerOn(config)
	},
	work() {
		result = {
			banker: {tie: 0, win: 0, lose: 0},
			player: {tie: 0, win: 0, lose: 0},
		}

		const afterPlay = (houtcome: HandOutcome): void => {
			const hresult = houtcome.result
			const bHand = houtcome.bancoHand
			const pHand = houtcome.puntoHand
			const num = bHand.getLength() + pHand.getLength()
			const betOnPlayer = (hresult: HandResult): void => {
				if (hresult == HandResult.BancoWins) {
					result.player.lose++
					consecutiveLose++
					if (consecutiveWin) {
						winMap.count(consecutiveWin)
					}
					consecutiveWin = 0
				} else if (hresult == HandResult.PuntoWins) {
					result.player.win++
					consecutiveWin++
					if (consecutiveLose) {
						loseMap.count(consecutiveLose)
					}
					consecutiveLose = 0
				} else {
					result.player.tie++
				}
			}
			const betOnBanker = (hresult: HandResult): void => {
				if (hresult == HandResult.BancoWins) {
					result.banker.win++
					consecutiveWin++
					if (consecutiveLose) {
						loseMap.count(consecutiveLose)
					}
					consecutiveLose = 0
				} else if (hresult == HandResult.PuntoWins) {
					result.banker.lose++
					consecutiveLose++
					if (consecutiveWin) {
						winMap.count(consecutiveWin)
					}
					consecutiveWin = 0
				} else {
					result.banker.tie++
				}
			}
			// 處理輸贏結果
			if (previousConsecutiveDouble > 1) {
				betOnBanker(hresult)
			}
			if (previousConsecutiveSingle > 1) {
				betOnPlayer(hresult)
			}
			// 處理previousConsecutive變量的修改
			if (num === 4) {
				previousConsecutiveDouble = 0
				previousConsecutiveSingle = 0
			} else if (num === 5) {
				previousConsecutiveDouble = 0
				if (previousConsecutiveSingle < 2) {
					previousConsecutiveSingle++
				} else if (previousConsecutiveSingle == 2) {
					previousConsecutiveSingle = 2
				}
			} else if (num === 6) {
				previousConsecutiveSingle = 0
				if (previousConsecutiveDouble < 2) {
					previousConsecutiveDouble++
				} else if (previousConsecutiveDouble == 2) {
					previousConsecutiveDouble = 2
				}
			}
		}
		for (let i = 0; i < shoeAmount; i++) {
			engine.playOneShoe(undefined, afterPlay)
			previousConsecutiveSingle = 0
			previousConsecutiveDouble = 0
		}
		const totalB: number =
			result.banker.win + result.banker.lose + result.banker.tie
		const totalP: number =
			result.player.win + result.player.lose + result.player.tie
		const total = totalB + totalP

		const smallTotalB = result.banker.win + result.banker.lose
		const smallTotalP = result.player.win + result.player.lose
		const smallTotal = smallTotalB + smallTotalP
		const dataForResult = [
			[
				"on B",
				result.banker.win,
				result.banker.lose,
				result.banker.tie,
				totalB,
			],
			[
				`on B %`,
				util.percentize(result.banker.win / totalB) + " %",
				util.percentize(result.banker.lose / totalB) + " %",
				util.percentize(result.banker.tie / totalB) + " %",
				100,
			],
			[
				"on P",
				result.player.win,
				result.player.lose,
				result.player.tie,
				totalP,
			],
			[
				`on P %`,
				util.percentize(result.player.win / totalP) + " %",
				util.percentize(result.player.lose / totalP) + " %",
				util.percentize(result.player.tie / totalP) + " %",
				100,
			],
		]
		tableForResult.push(...dataForResult)
		const pProfit = result.player.win - result.player.lose
		const bProfit = result.banker.win * 0.95 - result.banker.lose
		const profit = pProfit + bProfit

		const dataForProfit = [
			[
				"include tie",
				util.percentize(bProfit / totalB),
				util.percentize(pProfit / totalP),
				util.percentize(profit / total),
			],
			[
				"exclude tie",
				util.percentize(bProfit / smallTotalB),
				util.percentize(pProfit / smallTotalP),
				util.percentize(profit / smallTotal),
			],
		]
		tableForProfit.push(...dataForProfit)
		console.log("下手機會：", total)
	},
	run() {
		for (let i = 0; i < round; i++) {
			this.work()
		}
		engine.shutdown()
	},
	report() {
		// winMap.printSorted("連贏次數分佈： ")
		// loseMap.printSorted("連輸次數分佈： ")
		tableForResult.print(`輸贏分佈： `)
		tableForProfit.print(`利潤率(已扣除佣金)： `)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 一切成空

 */
