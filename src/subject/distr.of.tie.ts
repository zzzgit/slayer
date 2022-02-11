
import CounterMap from "./collection/CounterMap"
// eslint-disable-next-line node/no-extraneous-import
import {Engine, HandResult, HandOutcome} from "bac-motor"
import CliTable from "../report/Table"
import util from "../tool/util"

const engine = new Engine()
const shoeAmount = 5000
const round = 3
const table_distribution = new CliTable({
	head: ['total', 'tie', 'tie %'],
	colWidths: [20, 20, 20],
	style: {"compact": false, 'padding-left': 1},
})
const table_score = new CliTable({
	head: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	colWidths: [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
	style: {"compact": false, 'padding-left': 1},
})

const result:{[key: string]: any} = {
	point: [],
	indexMap: new CounterMap<number>(),
	all: 0,
	tie: 0,
}


const testCase = {
	init() {
		engine.powerOn()
	},
	work() {
		result.all = 0
		result.tie = 0
		result.indexMap.clear()
		for (let i = 0; i < shoeAmount; i++) {
			engine.playOneShoe(undefined, (handResult:HandOutcome)=>{
				result.all++
				if (handResult.result === HandResult.Tie) {
					result.tie++
					const score = handResult.bankerHand.getScore()
					result.point[score] = (result.point[score] || 0) + 1
					result.indexMap.count(handResult.handIndex)
				}
			})
		}
		table_distribution.push([result.all, result.tie, util.percentize(result.tie / result.all) + " %"])
	},
	run() {
		for (let i = 0; i < round; i++) {
			this.work()
		}
		table_score.push(result.point)

		engine.shutdown()
	},
	report() {
		table_distribution.print(`和局統計：`)
		table_score.print(`和局點數分佈：`)

		// console.log(`和局位置分佈：`)
		// const asciichart = require('asciichart')
		// console.log(asciichart.plot(result.index.map((item: number)=>item || 0)))

		result.indexMap.printSorted("和局的位置分佈：")
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 和局的概率，9.5%
 * 2. 123點打和最少(17%)，67打和最多(41%)，89次之(21.7%)，45再次之，0又次之
 * 3. 123出現的概率，1最少，2多之，3更多
 */
