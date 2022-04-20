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
				const bHand = handResult.bancoHand.getDuplicatedCardArray()
				const pHand = handResult.puntoHand.getDuplicatedCardArray()
				const cardAmount = bHand.length + pHand.length
				result.totalMap.count(cardAmount)
				if (handResult.result == HandResult.Tie) {
					result.tieMap.count(cardAmount)
				} else if (handResult.result == HandResult.BancoWins) {
					result.bMap.count(cardAmount)
				} else if (handResult.result == HandResult.PuntoWins) {
					result.pMap.count(cardAmount)
				}
				if (cardAmount === 4) {
					const map = result.fourCardMap
					let cardScore = bHand[0].getPoint()
					map.count(cardScore)
					cardScore = bHand[1].getPoint()
					map.count(cardScore)
					cardScore = pHand[0].getPoint()
					map.count(cardScore)
					cardScore = pHand[1].getPoint()
					map.count(cardScore)
					//
					naturalStreak++
				} else if (cardAmount === 5) {
					const map = result.fiveCardMap
					let cardScore = bHand[0].getPoint()
					map.count(cardScore)
					cardScore = bHand[1].getPoint()
					map.count(cardScore)
					cardScore = pHand[0].getPoint()
					map.count(cardScore)
					cardScore = pHand[1].getPoint()
					map.count(cardScore)
					cardScore = (pHand[2] || bHand[2]).getPoint()
					map.count(cardScore)

					if (naturalStreak != 0) {
						result.naturalMap.count(naturalStreak)
						naturalStreak = 0
					}
				} else {
					const map = result.sixCardMap
					let cardScore = bHand[0].getPoint()
					map.count(cardScore)
					cardScore = bHand[1].getPoint()
					map.count(cardScore)
					map.count(cardScore)
					cardScore = bHand[2].getPoint()
					cardScore = pHand[0].getPoint()
					map.count(cardScore)
					cardScore = pHand[1].getPoint()
					map.count(cardScore)
					cardScore = pHand[2].getPoint()
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
		// console.log("四張牌：", result.fourCardMap)
		// console.log("五張牌：", result.fiveCardMap)
		// console.log("六張牌：", result.sixCardMap)
		result.naturalMap.printSorted("連續四張牌(包括叉燒)：")
		console.log("計算積分：")
		const arr:number[] = []
		for (let i = 0; i < 10; i++) {
			arr.push(result.naturalMap.get(i + 1) || 0)
		}
		util.getAbyss(arr)
		tableDistribution.print(`五千shoe，每手牌的張數分佈：`)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 平均每手4.9656張牌(bug修復後，4.94)
 * 2. 總體上，4張37.6，5張28.2%，6張34.2%（錯）
 * 3. 莊的優勢明顯，四張，五張，六張，遞減
 * 4. 和，在五張牌時出現的可能性偏低，在四張六張牌時，比例想當
 * 5. 和，閒補牌，莊補牌，可以分開研究
 * 6. 連續出天牌，連續14🤚是極限
 * 7. 天牌的平均長度是1.73手（時間久了，已經不知道意思，叉燒是否算在裡面）
 */
