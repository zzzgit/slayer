
import {BigRoad, Streak} from "marga"
import massiveTestConfig from "../config/massiveTestConfig"
import {Engine, ShoeOutcome} from "bac-motor"
import CliTable from "../report/Table"
import util from "../tool/util"
import samael from "samael"

const engine = new Engine()
const shoeAmount = 3000
const round = 1
const table = new CliTable({
	head: ['total', 'B', 'P', 'tie'],
	colWidths: [20, 20, 20, 20],
	style: {"compact": false, 'padding-left': 1},
})
let capital = 50

let result: { tie: number; banker: number; player: number; pStreakLen: number[]; bStreakLen: number[] } = {
	tie: 0,
	banker: 0,
	player: 0,
	pStreakLen: [],
	bStreakLen: [],
}
const varianceArr:number[] = []


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
			pStreakLen: [],
			bStreakLen: [],
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
			const road: BigRoad = shoeOutcome.getBigRoad()
			let streak = road.getFirstStreak()
			const originalCapital = capital
			while (streak) {
				if (streak.getFirstEntity()?.isBanco) {
					if (streak.getLength() > 1) {
						capital--
					} else {
						if (streak.getNextStreak()) {
							capital++
						}
					}
				}
				streak = streak.getNextStreak()
			}
			const profit = capital - originalCapital
			if (profit < 0) {
				// this.printArray(shoeOutcome.getBigRoad().print() as string[][])
				// console.log(`${info.banco}:\t${info.punto}`)
				// this.statistics(shoeOutcome.getBigRoad())
			}
			// console.log(`shoe${shoeOutcome.getShoeIndex()}:\t${capital}`)
			result.banco += info.banco
			result.punto += info.punto
			result.tie += info.tie
		}
		const totalResult: number = result.tie + result.banco + result.punto
		table.push([totalResult, result.banco, result.punto, result.tie],
			[`100 %`, util.percentize(result.banco / totalResult) + " %",
				util.percentize(result.punto / totalResult) + " %", util.percentize(result.tie / totalResult) + " %"])
	},
	statistics(road: BigRoad) {
		const arr = []
		let streak = road.getFirstStreak() as Streak
		while (streak) {
			if (streak.getFirstEntity()?.isBanco) {
				arr.push(streak.getLength())
			}
			streak = streak.getNextStreak() as Streak
		}
		const variance = util.getVariance(arr)
		varianceArr.push(variance)
	},
	printArray(arr: string[][]) :void {
		console.log("---------------")
		for (let i = 0, len = arr.length; i < len; i++) {
			const row = arr[i]
			let str = ""
			for (let j = 0, lenth = row.length; j < lenth; j++) {
				str = str + row[j]
			}
			console.log(str)
		}
	},
	run() {
		for (let i = 0; i < round; i++) {
			this.work()
		}
		engine.shutdown()
	},
	report() {
		table.print(`莊閒分佈：`)
		// console.log("平均方差：", varianceArr.reduce((a, b)=>a + b) / varianceArr.length)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 遇莊打閒，隨時可能輸到內褲都沒有
 * 2. 莊比閒多會輸，裝比閒少也會輸,e.g. 莊31:	閒41
 * 3. 如果不要求莊比閒少，最多可以輸13手（只是測試結果而已，實際可能更多）
 * 4. 在贏錢的案例中，閒旺的shoe比莊旺的多，在輸錢的案例中，莊旺的shoe比閒旺的多
 */
