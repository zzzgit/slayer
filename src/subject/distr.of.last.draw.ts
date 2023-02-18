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
	fourMap: new CounterMap<number>(),
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
			fourMap: new CounterMap<number>(),
		}
		const afterPlay = (handResult: HandOutcome): void => {
			const bHand = handResult.bancoHand.getDuplicatedCardArray()
			const pHand = handResult.puntoHand.getDuplicatedCardArray()
			const cardAmount = bHand.length + pHand.length
			if (cardAmount === 4) {
				const lastCardScore = bHand[1].getPoint()
				result.fourMap.count(lastCardScore)
			} else if (cardAmount === 5) {
				if (pHand.length === 3) {
					// 把莊家6點排除在外
					if (handResult.bancoHand.getPoint() != 6) {
						const lastCardScore = pHand[2].getPoint()
						result.fivePlayerMap.count(lastCardScore)
					}
				} else {
					const lastCardScore = bHand[2].getPoint()
					result.fiveBankerMap.count(lastCardScore)
				}
			} else if (cardAmount === 6) {
				const lastCardScore = bHand[2].getPoint()
				result.sixMap.count(lastCardScore)
			}
		}
		for (let i = 0; i < shoeAmount; i++) {
			engine.playOneShoe(undefined, afterPlay)
		}
		const {fivePlayerMap, fiveBankerMap, sixMap, fourMap: fourPlayerMap} = result
		const arr1 = []
		const arr2 = []
		const arr3 = []
		const arr4 = []
		for (let i = 0; i < 10; i++) {
			arr1.push(fivePlayerMap.get(i) || 0)
			arr2.push(fiveBankerMap.get(i) || 0)
			arr3.push(sixMap.get(i) || 0)
			arr4.push(fourPlayerMap.get(i) || 0)
		}
		tableDistribution.push(["P draw one", ...arr1])
		tableDistribution.push(["B draw one", ...arr2])
		tableDistribution.push(["P B draw each", ...arr3])
		tableDistribution.push(["B draw for 4", ...arr4])
		engine.shutdown()
	},
	report() {
		tableDistribution.print(`distribution of the point value of last draw：`)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 6789對6789，012對012，莊閒對比，應該機會均等
 * 2. 最後一張補牌，閒家一方，除了0點之外，8點最多，9點1點次之，2點3點次之，4點5點次之，6點7點次之
 * 3. 最後一張補牌，如果雙方都補牌，除了0點之外，幾乎是隨機，機會均等
 * 2. 這項研究可以用來預測邊註（大小），而大小，可以用來預測莊閒
 * 5. 4張牌，除了0，89出現最多，67次之
 */

