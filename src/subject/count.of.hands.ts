import {Engine} from "bac-motor"
import massiveTestConfig from "../config/massiveTestConfig"
import CliTable from "../report/Table"
import CounterMap from "./collection/CounterMap"


const engine = new Engine()
const shoeAmount = 5000

const tableDistribution = new CliTable({
	head: ["games", "77", '78', '79', '80', '81'],
	colWidths: [15, 15, 15, 15, 15, 15],
	style: {"compact": false, 'padding-left': 1},
})


let result = {
	hands: new CounterMap<number>(),
	total: 0,
}

const testCase = {
	init() {
		const config = Object.assign({}, massiveTestConfig, {shouldGenerateRoad: false, shouldCutShoe: true})
		engine.powerOn(config)
	},
	run() {
		result = {
			hands: new CounterMap<number>(),
			total: 0,
		}
		for (let i = 0; i < shoeAmount; i++) {
			const shoeOutcome = engine.playOneShoe(undefined, undefined)
			const {total} = shoeOutcome.getStatisticInfo()
			result.hands.count(total)
			result.total += total
		}
		const h = result.hands
		tableDistribution.push(["occurrence", h.get(77) + "", h.get(78) + "", h.get(79) + "", h.get(80) + "", h.get(81) + ""])
		engine.shutdown()
	},
	report() {
		tableDistribution.print(`occurrence of count of games in a shoe：`)
		console.log(`平均每shoe: ${result.total / shoeAmount} games`)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 目前的機制，平均一shoe是79個game，偏高
 *
 */
