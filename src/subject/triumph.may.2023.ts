import {Engine, HandOutcome, HandResult} from "bac-motor"
import massiveTestConfig from "../config/massiveTestConfig"
import CliTable from "../report/Table"
import util from "../tool/util"
import CounterMap from "./collection/CounterMap"

const engine = new Engine()
const shoeAmount = 9000
const round = 1
let consecutiveBanco = 0
let consecutivePunto = 0
let consecutiveLose = 0
let consecutiveWin = 0
const loseMap = new CounterMap<number>()
const winMap = new CounterMap<number>()
const tableForResult = new CliTable({
	head: ['result', 'W', 'L', 'tie', "total"],
	colWidths: [20, 20, 20, 20, 20],
	style: {"compact": false, 'padding-left': 1},
})
const tableForProfit = new CliTable({
	head: ['profit rate', 'B', 'P', 'total'],
	colWidths: [20, 20, 20, 20],
	style: {"compact": false, 'padding-left': 1},
})

let result = {
	banker: {tie: 0, win: 0, lose: 0},
	player: {tie: 0, win: 0, lose: 0},
}


const testCase = {
	init() {
		const config = Object.assign({}, massiveTestConfig, {shouldGenerateRoad: true, shouldCutShoe: true})
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
			const num = bHand.getDuplicatedCardArray().length + pHand.getDuplicatedCardArray().length
			if (num === 4) {
				//
			} else if (num === 5) {
				if (consecutiveBanco < 3) {
					consecutiveBanco++
				} else if (consecutiveBanco == 3) {
					consecutiveBanco = 1
				}

				if (consecutivePunto < 2) {
					//
				} else if (consecutivePunto > 1) {
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
				consecutivePunto = 0
			} else if (num === 6) {
				if (consecutivePunto < 3) {
					consecutivePunto++
				} else if (consecutivePunto == 3) {
					consecutivePunto = 1
				}

				if (consecutiveBanco < 2) {
					//
				} else if (consecutiveBanco > 1) {
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
				consecutiveBanco = 0
			}
		}
		for (let i = 0; i < shoeAmount; i++) {
			engine.playOneShoe(undefined, afterPlay)
			consecutiveBanco = 0
			consecutivePunto = 0
			consecutiveLose = 0 // 導致最後一列無法被統計
		}
		const totalB: number = result.banker.win + result.banker.lose + result.banker.tie
		const totalP: number = result.player.win + result.player.lose + result.player.tie
		const total = totalB + totalP

		const smallTotalB = result.banker.win + result.banker.lose
		const smallTotalP = result.player.win + result.player.lose
		const smallTotal = smallTotalB + smallTotalP
		const dataForResult = [
			["on B", result.banker.win, result.banker.lose, result.banker.tie, totalB],
			[`on B %`, util.percentize(result.banker.win / totalB) + " %", util.percentize(result.banker.lose / totalB) + " %", util.percentize(result.banker.tie / totalB) + " %", 100],
			["on P", result.player.win, result.player.lose, result.player.tie, totalP],
			[`on P %`, util.percentize(result.player.win / totalP) + " %", util.percentize(result.player.lose / totalP) + " %", util.percentize(result.player.tie / totalP) + " %", 100],

		]
		tableForResult.push(...dataForResult)
		const pProfit = result.player.win - result.player.lose
		const bProfit = result.banker.win * .95 - result.banker.lose
		const profit = pProfit + bProfit

		const dataForProfit = [
			["include tie", util.percentize(bProfit / totalB), util.percentize(pProfit / totalP), util.percentize(profit / total)],
			["exclude tie", util.percentize(bProfit / smallTotalB), util.percentize(pProfit / smallTotalP), util.percentize(profit / smallTotal)],
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
		winMap.printSorted("連贏次數分佈： ")
		loseMap.printSorted("連輸次數分佈： ")
		tableForResult.print(`輸贏分佈： `)
		tableForProfit.print(`利潤率(已扣除佣金)： `)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 2月10日重新發現，但是一直沒有用代碼來做驗證，幾次失敗，幾次改進，都沒有最終的方案
 * 2. 買閒，下手機會0.043不到
 * 3. 買莊，下手機會0.043到0.044之間
 * 4. 單獨買莊，100手獲利12-13手（不算和），11-12手（算上和），沒有減除5%的手續費  ------或許不准，重新計算
 * 5. 單獨買閒，100手獲利7-8手（不算和），6-7手（算上和）------或許不准，重新計算
 * 6.
 * 7.
 * 8. 下手機會 第一種方案0.087，第二種方案0.12，第三種方案0.013
 * 		三種方案，第一種：2之後可以下注，然後重置為0，第二種：2和3可以下注，3之後重置為0，第三種：2和3可以下注，3之後重置為1
 * 10. 奇思妙想，見5打6見6打5，這種打法為什麼連輸？

 */
