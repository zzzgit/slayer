
// eslint-disable-next-line node/no-extraneous-import
import {Engine, HandOutcome} from "bac-motor"
import CliTable from "../report/Table"
import CounterMap from "./collection/CounterMap"


const engine = new Engine()
const shoeAmount = 9000
const colWith = 7

const tableDistribution = new CliTable({
	head: ['last draw/score', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	colWidths: [15, colWith, colWith, colWith, colWith, colWith, colWith, colWith, colWith, colWith, colWith],
	style: {"compact": false, 'padding-left': 1},
})


let result = {
	fivePlayerMap: new CounterMap<number>(),
	fiveBankerMap: new CounterMap<number>(),
	sixMap: new CounterMap<number>(),
}


const testCase = {
	init() {
		engine.powerOn()
	},
	run() {
		result = {
			fivePlayerMap: new CounterMap<number>(),
			fiveBankerMap: new CounterMap<number>(),
			sixMap: new CounterMap<number>(),
		}
		for (let i = 0; i < shoeAmount; i++) {
			const afterPlay = (handResult: HandOutcome): void => {
				const bHand = handResult.bankerHand.getDuplicatedCardArray()
				const pHand = handResult.playerHand.getDuplicatedCardArray()
				const cardAmount = bHand.length + pHand.length
				if (cardAmount === 5) {
					if (pHand.length === 3) {
						const lastCardScore = pHand[2].getCardScore()
						result.fivePlayerMap.count(lastCardScore)
					} else {
						const lastCardScore = bHand[2].getCardScore()
						result.fiveBankerMap.count(lastCardScore)
					}
				} else if (cardAmount === 6) {
					const lastCardScore = bHand[2].getCardScore()
					result.sixMap.count(lastCardScore)
				}
			}
			engine.playOneShoe(undefined, afterPlay)
		}
		const {fivePlayerMap} = result
		const {fiveBankerMap} = result
		const {sixMap} = result
		const arr1 = []
		const arr2 = []
		const arr3 = []
		for (let i = 0; i < 10; i++) {
			arr1.push(fivePlayerMap.get(i) || 0)
			arr2.push(fiveBankerMap.get(i) || 0)
			arr3.push(sixMap.get(i) || 0)
		}
		tableDistribution.push(["P draw one", ...arr1])
		tableDistribution.push(["B draw one", ...arr2])
		tableDistribution.push(["P B draw each", ...arr3])
		engine.shutdown()
	},
	report() {
		tableDistribution.print(`distribution of the score of last draw：`)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 最後一張補牌，幾乎是隨機，幾乎是機會均等，除了0點
 * 2. 五張牌的情況，閒家鋪牌次數比莊家多，說明補牌對閒家有利
 */

