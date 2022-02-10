
import {BigRoad} from "marga"
import massiveTestConfig from "../config/massiveTestConfig"
import CounterMap from "./collection/CounterMap"
// eslint-disable-next-line node/no-extraneous-import
import {Engine, ShoeOutcome} from "baccarat-engine"
import CliTable from "../report/Table"
import util from "../tool/util"

const engine = new Engine()
const samael = require('samael')
const shoeAmount = 3000
const round = 1
const table = new CliTable({
	head: ['total', 'B', 'P', 'tie'],
	colWidths: [20, 20, 20, 20],
	style: {"compact": false, 'padding-left': 1},
})

let result: { tie: number; banker: number; player: number; streakAfterPingpong: number[]; reserved: CounterMap<number> } = {
	tie: 0,
	banker: 0,
	player: 0,
	streakAfterPingpong: [],
	reserved: new CounterMap<number>(),

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
			streakAfterPingpong: [],
			reserved: new CounterMap<number>(),
		}
		const date = new Date()
		const path = "/Users/luochao/Desktop/projects/slayer/src/baccaratology/reportCache/mm.txt"
		let prom = samael.writeToFile(path, `${date.toLocaleString()}\n  \n`).catch((e: Error) => console.log("錯誤", e))
		for (let i = 0; i < shoeAmount; i++) {
			const shoeComeout: ShoeOutcome = engine.playOneShoe()
			const info = shoeComeout.getStatisticInfo()
			let str = `${shoeComeout.getShoeIndex()}\t${info.banker}\t${info.player}\t${info.tie}\n`
			str = ""
			prom = prom.then(() => samael.appendToFile(path, str))
			this.showRoad(shoeComeout)

			result.banker += info.banker
			result.player += info.player
			result.tie += info.tie
		}
		const totalResult: number = result.tie + result.banker + result.player
		table.push([totalResult, result.banker, result.player, result.tie],
			[`100 %`, util.percentize(result.banker / totalResult) + " %",
				util.percentize(result.player / totalResult) + " %", util.percentize(result.tie / totalResult) + " %"])
	},
	showRoad(shoeComeout:ShoeOutcome) {
		const road: BigRoad = shoeComeout.getBigRoad()
		let streak = road.getFirstStreak()
		// 遍歷streak,忽略最後一個
		while (streak?.getNextStreak()) {
			if (streak.getLength() > 1) {
				let prev = streak.getPreviousStreak()
				let length = 0
				while (prev?.getLength() === 1) {
					length++
					prev = prev.getPreviousStreak()
				}
				if (length > 9) {
					result.streakAfterPingpong.push(streak.getLength())
				}
			}
			streak = streak.getNextStreak()
		}
	},
	run() {
		for (let i = 0; i < round; i++) {
			this.work()
		}
		engine.shutdown()
	},
	report() {
		table.print(`莊閒分佈： `)
		const totalStreak = result.streakAfterPingpong.reduce((a, b)=>a + b)
		console.log(`平均長度：`, totalStreak / result.streakAfterPingpong.length)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 單挑之後的第一個龍，平均長度： 2.97，沒有bias

 */
