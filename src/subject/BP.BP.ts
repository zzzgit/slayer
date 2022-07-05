import {BigRoad} from "marga"
import massiveTestConfig from "../config/massiveTestConfig"
import {Engine, ShoeOutcome} from "bac-motor"
import CliTable from "../report/Table"
import util from "../tool/util"
import samael from "samael"
import {LosingEntity, Blackhole, WinningEntity} from "@zzznpm/orphan"

const engine = new Engine()
const shoeAmount = 4000
const round = 1
const table = new CliTable({
	head: ['total', 'B', 'P', 'tie'],
	colWidths: [20, 20, 20, 20],
	style: {"compact": false, 'padding-left': 1},
})

const bhole = new Blackhole()

let result: { tie: number; banker: number; player: number } = {
	tie: 0,
	banker: 0,
	player: 0,
}


const testCase = {
	init() {
		const config = Object.assign({}, massiveTestConfig, {shouldGenerateRoad: true, shouldCutShoe: true})
		engine.powerOn(config)
	},
	work() {
		result = {
			tie: 0,
			banker: 0,
			player: 0,
		}
		const date = new Date()
		const path = "/Users/luochao/Desktop/projects/slayer/src/baccaratology/reportCache/mm.txt"
		let prom = samael.writeToFile(path, `${date.toLocaleString()}\n  \n`).catch((e: Error) => console.log("錯誤", e))
		for (let i = 0; i < shoeAmount; i++) {
			const shoeOutcome: ShoeOutcome = engine.playOneShoe()
			const info = shoeOutcome.getStatisticInfo()
			let str = `${shoeOutcome.getShoeIndex()}\t${info.banco}\t${info.punto}\t${info.tie}\n`
			str = ""
			prom = prom.then(() => samael.appendToFile(path, str))
			const bigroad: BigRoad = shoeOutcome.getBigRoad()
			// 分析遇莊打莊
			let streak = bigroad.getFirstStreak()
			while (streak) {
				if (streak.getFirstEntity()?.isPunto) {
					streak = streak.getNextStreak()
					continue
				}
				const length = streak.getLength()
				if (length < 4) {
					streak = streak.getNextStreak()
					continue
				}
				if (streak.getNextStreak()) {
					if (length === 4) {
						bhole.addEntity(new LosingEntity(true))
					} else {
						bhole.addEntity(new WinningEntity(true))
						if (length === 5) {
							// 必須存在這樣，不然邏輯有問題
						} else	if (length === 6) {
							bhole.addEntity(new LosingEntity(true))
						} else {
							bhole.addEntity(new WinningEntity(true))
						}
					}
				} else {	// the last treak
					if (length === 4) {
						//
					} else {
						bhole.addEntity(new WinningEntity(true))
						if (length === 5) {
							//
						} else if (length === 6) {
							// /
						} else {
							bhole.addEntity(new WinningEntity(true))
						}
					}
				}
				streak = streak.getNextStreak()
			}

			result.banker += info.banco
			result.player += info.punto
			result.tie += info.tie
		}
		const totalResult: number = result.tie + result.banker + result.player
		table.push([totalResult, result.banker, result.player, result.tie],
			[`100 %`, util.percentize(result.banker / totalResult) + " %",
				util.percentize(result.player / totalResult) + " %", util.percentize(result.tie / totalResult) + " %"])
	},
	run() {
		for (let i = 0; i < round; i++) {
			this.work()
		}
		engine.shutdown()
	},
	report() {
		table.print(`莊閒分佈：`)
		console.log()
		console.log()
		const info = bhole.getOutcome(true)
		console.log(info.bet)
		console.log(info.statistics)
		console.log(info.strategy)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 遇閒打莊，因為莊有0.05佣金，最終還是輸（代碼在注釋掉的部分）
 * 2. 莊跟龍，w2l低於105%，也就是說扣除佣金後，沒有利潤
 * 3.
 * 4.
 *
 */
