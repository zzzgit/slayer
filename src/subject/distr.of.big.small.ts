import {Engine, HandResult, HandOutcome} from "bac-motor"
import CliTable from "../report/Table"
import util from "../tool/util"
import CounterMap from "./collection/CounterMap"


const engine = new Engine()
const shoeAmount = 5000

const tableDistribution = new CliTable({
	head: [' ', '4', '5', '6'],
	colWidths: [15, 15, 15, 15],
	style: {"compact": false, 'padding-left': 1},
})


let result = {
	totalMap: new CounterMap<number>(),
	tieMap: new CounterMap<number>(),
	bMap: new CounterMap<number>(),
	pMap: new CounterMap<number>(),
	fourCardMap: new CounterMap<number>(),
	fiveCardMap: new CounterMap<number>(),
	sixCardMap: new CounterMap<number>(),
	naturalMap: new CounterMap<number>(),
}
let naturalStreak = 0


const testCase = {
	init() {
		engine.powerOn()
	},
	run() {
		result = {
			totalMap: new CounterMap<number>(),
			tieMap: new CounterMap<number>(),
			bMap: new CounterMap<number>(),
			pMap: new CounterMap<number>(),
			fourCardMap: new CounterMap<number>(),
			fiveCardMap: new CounterMap<number>(),
			sixCardMap: new CounterMap<number>(),
			naturalMap: new CounterMap<number>(),
		}
		for (let i = 0; i < shoeAmount; i++) {
			naturalStreak = 0
			const afterPlay = (handResult: HandOutcome): void => {
				const bHand = handResult.bankerHand.getDuplicatedCardArray()
				const pHand = handResult.playerHand.getDuplicatedCardArray()
				const cardAmount = bHand.length + pHand.length
				result.totalMap.count(cardAmount)
				if (handResult.result == HandResult.Tie) {
					result.tieMap.count(cardAmount)
				} else if (handResult.result == HandResult.BankerWins) {
					result.bMap.count(cardAmount)
				} else if (handResult.result == HandResult.PlayerWins) {
					result.pMap.count(cardAmount)
				}
				if (cardAmount === 4) {
					const map = result.fourCardMap
					let cardScore = bHand[0].getCardScore()
					map.count(cardScore)
					cardScore = bHand[1].getCardScore()
					map.count(cardScore)
					cardScore = pHand[0].getCardScore()
					map.count(cardScore)
					cardScore = pHand[1].getCardScore()
					map.count(cardScore)
					//
					naturalStreak++
				} else if (cardAmount === 5) {
					const map = result.fiveCardMap
					let cardScore = bHand[0].getCardScore()
					map.count(cardScore)
					cardScore = bHand[1].getCardScore()
					map.count(cardScore)
					cardScore = pHand[0].getCardScore()
					map.count(cardScore)
					cardScore = pHand[1].getCardScore()
					map.count(cardScore)
					cardScore = (pHand[2] || bHand[2]).getCardScore()
					map.count(cardScore)

					if (naturalStreak != 0) {
						result.naturalMap.count(naturalStreak)
						naturalStreak = 0
					}
				} else {
					const map = result.sixCardMap
					let cardScore = bHand[0].getCardScore()
					map.count(cardScore)
					cardScore = bHand[1].getCardScore()
					map.count(cardScore)
					map.count(cardScore)
					cardScore = bHand[2].getCardScore()
					cardScore = pHand[0].getCardScore()
					map.count(cardScore)
					cardScore = pHand[1].getCardScore()
					map.count(cardScore)
					cardScore = pHand[2].getCardScore()
					map.count(cardScore)
					if (naturalStreak != 0) {
						result.naturalMap.count(naturalStreak)
						naturalStreak = 0
					}
				}
			}
			engine.playOneShoe(undefined, afterPlay)
		}
		const {totalMap} = result
		const {tieMap} = result
		const {bMap} = result
		const {pMap} = result
		let four = totalMap.get(4) || 0
		let five = totalMap.get(5) || 0
		let six = totalMap.get(6) || 0
		let total = four + five + six
		tableDistribution.push(["overall", four, five, six])
		tableDistribution.push([" ", util.percentize(four / total) + "%", util.percentize(five / total) + "%", util.percentize(six / total) + "%"])
		four = tieMap.get(4) || 0
		five = tieMap.get(5) || 0
		six = tieMap.get(6) || 0
		total = four + five + six
		tableDistribution.push(["tie", four, five, six])
		tableDistribution.push([" ", util.percentize(four / total) + "%", util.percentize(five / total) + "%", util.percentize(six / total) + "%"])
		four = bMap.get(4) || 0
		five = bMap.get(5) || 0
		six = bMap.get(6) || 0
		total = four + five + six
		tableDistribution.push(["B", four, five, six])
		tableDistribution.push([" ", util.percentize(four / total) + "%", util.percentize(five / total) + "%", util.percentize(six / total) + "%"])
		four = pMap.get(4) || 0
		five = pMap.get(5) || 0
		six = pMap.get(6) || 0
		total = four + five + six
		tableDistribution.push(["P", four, five, six])
		tableDistribution.push([" ", util.percentize(four / total) + "%", util.percentize(five / total) + "%", util.percentize(six / total) + "%"])

		engine.shutdown()
	},
	report() {
		// console.log("????????????", result.fourCardMap)
		// console.log("????????????", result.fiveCardMap)
		// console.log("????????????", result.sixCardMap)
		result.naturalMap.printSorted("???????????????(????????????)???")
		console.log("???????????????")
		const arr:number[] = []
		for (let i = 0; i < 10; i++) {
			arr.push(result.naturalMap.get(i + 1) || 0)
		}
		util.getAbyss(arr)
		tableDistribution.print(`??????shoe??????????????????????????????`)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. ????????????4.9656??????(bug????????????4.94)
 * 2. ????????????4???37.6???5???28.2%???6???34.2%?????????
 * 3. ??????????????????????????????????????????????????????
 * 4. ????????????????????????????????????????????????????????????????????????????????????
 * 5. ????????????????????????????????????????????????
 * 6. ????????????????????????14?????????????
 * 7. ????????????????????????1.73????????????????????????????????????????????????????????????????????????
 */
