
// eslint-disable-next-line node/no-extraneous-import
import {Engine, HandOutcome, HandResult} from "baccarat-engine"
import CliTable from "../report/Table"
import CounterMap from "./collection/CounterMap"


const engine = new Engine()
const shoeAmount = 900
const colWith = 7

const tableDistribution = new CliTable({
	head: ['last draw/score', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	colWidths: [15, colWith, colWith, colWith, colWith, colWith, colWith, colWith, colWith, colWith, colWith],
	style: {"compact": false, 'padding-left': 1},
})


let result = {
	tie: new CounterMap<number>(),
	banker: new CounterMap<number>(),
	player: new CounterMap<number>(),
	allMap: new CounterMap<string>(),
}


const testCase = {
	init() {
		engine.powerOn()
	},
	run() {
		result = {
			tie: new CounterMap<number>(),
			banker: new CounterMap<number>(),
			player: new CounterMap<number>(),
			allMap: new CounterMap<string>(),
		}
		for (let i = 0; i < shoeAmount; i++) {
			const afterPlay = (handResult: HandOutcome): void => {
				const prev = handResult.getPreviousHandOutcome()
				if (!prev) {
					return undefined
				}
				const bHand = prev.bankerHand.getScore()
				const pHand = prev.playerHand.getScore()
				if (bHand < 8 && bHand > 5 && pHand < 8 && pHand > 5) {
					if (handResult.result == HandResult.Tie) {
						result.allMap.count("tie")
					} else if (handResult.result == HandResult.BankerWins) {
						result.allMap.count("banker")
					} else {
						result.allMap.count("player")
					}
				}
			}
			engine.playOneShoe(undefined, afterPlay)
		}
		engine.shutdown()
	},
	report() {
		tableDistribution.print(` ：`)
		console.log(result.allMap)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 莊為6點或者7點，閒也為6點或者7點，後一手牌，結果沒有特殊性
 * 2.
 */

