import {Engine, HandResult, HandOutcome} from "bac-motor"
import CliTable from "../report/Table"
import util from "../tool/util"
import CounterMap from "./collection/CounterMap"


const engine = new Engine()
const shoeAmount = 5000

const tableDistributionHoz = new CliTable({
	head: [' ', '4', '5', '6'],
	colWidths: [15, 15, 15, 15],
	style: {"compact": false, 'padding-left': 1},
})

const tableDistributionVer = new CliTable({
	head: [' ', 'B', 'P', 'T'],
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
	fourMap: new CounterMap<number>(),
	fiveMap: new CounterMap<number>(),
	fiveforbankerdrawMap: new CounterMap<number>(),
	fiveforplayerdrawMap: new CounterMap<number>(),
	sixMap: new CounterMap<number>(),
}
let streak = 0


const testCase = {
	init() {
		// const cards: Card[] = CardMagazine.getCardsWithHighRank()
		// const config: Config = {
		// 	customizedShoe: cards,
		// 	shouldCutShoe: false,
		// 	shouldUseBlackCard: false,
		// 	shouldBurnCard: true,
		// 	shouldShuffle: true,
		// 	shouldGenerateRoad: false,
		// 	shouldShuffleWhileCollectBancoHand: false,
		// }
		engine.powerOn()
	},
	_statistic() {
		const {totalMap, tieMap, bMap, pMap} = result
		let four = totalMap.get(4) || 0
		let five = totalMap.get(5) || 0
		let six = totalMap.get(6) || 0
		let total = four + five + six
		tableDistributionHoz.push(["overall", four, five, six])
		tableDistributionHoz.push(["100%", util.percentize(four / total) + "%", util.percentize(five / total) + "%", util.percentize(six / total) + "%"])
		// tie
		four = tieMap.get(4) || 0
		five = tieMap.get(5) || 0
		six = tieMap.get(6) || 0
		total = four + five + six
		tableDistributionHoz.push(["tie", four, five, six])
		tableDistributionHoz.push(["T--100%", util.percentize(four / total) + "%", util.percentize(five / total) + "%", util.percentize(six / total) + "%"])
		// 莊家贏
		four = bMap.get(4) || 0
		five = bMap.get(5) || 0
		six = bMap.get(6) || 0
		total = four + five + six
		tableDistributionHoz.push(["B", four, five, six])
		tableDistributionHoz.push(["B--100%", util.percentize(four / total) + "%", util.percentize(five / total) + "%", util.percentize(six / total) + "%"])
		// 閒家贏
		four = pMap.get(4) || 0
		five = pMap.get(5) || 0
		six = pMap.get(6) || 0
		total = four + five + six
		tableDistributionHoz.push(["P", four, five, six])
		tableDistributionHoz.push(["P--100%", util.percentize(four / total) + "%", util.percentize(five / total) + "%", util.percentize(six / total) + "%"])

		const {fourMap, fiveMap, fiveforbankerdrawMap: fiveforbankerMap, fiveforplayerdrawMap: fiveforplayerMap, sixMap} = result
		// 四張牌
		let banker = fourMap.get(1) || 0
		let player = fourMap.get(2) || 0
		let tie = fourMap.get(0) || 0
		total = banker + player + tie
		tableDistributionVer.push(["4", banker, player, tie])
		tableDistributionVer.push(["4-100%", util.percentize(banker / total) + "%", util.percentize(player / total) + "%", util.percentize(tie / total) + "%"])
		// 五張牌
		banker = fiveMap.get(1) || 0
		player = fiveMap.get(2) || 0
		tie = fiveMap.get(0) || 0
		total = banker + player + tie
		tableDistributionVer.push(["5", banker, player, tie])
		tableDistributionVer.push(["5-100%", util.percentize(banker / total) + "%", util.percentize(player / total) + "%", util.percentize(tie / total) + "%"])
		// 六張牌
		banker = sixMap.get(1) || 0
		player = sixMap.get(2) || 0
		tie = sixMap.get(0) || 0
		total = banker + player + tie
		tableDistributionVer.push(["6", banker, player, tie])
		tableDistributionVer.push(["6-100%", util.percentize(banker / total) + "%", util.percentize(player / total) + "%", util.percentize(tie / total) + "%"])
		// 五張牌 莊家
		banker = fiveforbankerMap.get(1) || 0
		player = fiveforbankerMap.get(2) || 0
		tie = fiveforbankerMap.get(0) || 0
		total = banker + player + tie
		tableDistributionVer.push(["5b draw", banker, player, tie])
		tableDistributionVer.push(["5b-100%", util.percentize(banker / total) + "%", util.percentize(player / total) + "%", util.percentize(tie / total) + "%"])
		// 五張牌 閒家
		banker = fiveforplayerMap.get(1) || 0
		player = fiveforplayerMap.get(2) || 0
		tie = fiveforplayerMap.get(0) || 0
		total = banker + player + tie
		tableDistributionVer.push(["5p draw", banker, player, tie])
		tableDistributionVer.push(["5p-100%", util.percentize(banker / total) + "%", util.percentize(player / total) + "%", util.percentize(tie / total) + "%"])
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
			fourMap: new CounterMap<number>(),
			fiveMap: new CounterMap<number>(),
			fiveforbankerdrawMap: new CounterMap<number>(),
			fiveforplayerdrawMap: new CounterMap<number>(),
			sixMap: new CounterMap<number>(),
		}
		streak = 0
		const afterPlay = (handResult: HandOutcome): void => {
			const bHand = handResult.bancoHand.getDuplicatedCardArray()
			const pHand = handResult.puntoHand.getDuplicatedCardArray()
			const cardAmount = bHand.length + pHand.length
			let numberMap
			let specilFiveMpa = undefined
			if (cardAmount === 5) {
				if (bHand.length === 3) {
					specilFiveMpa = result.fiveforbankerdrawMap
				} else {
					specilFiveMpa = result.fiveforplayerdrawMap
				}
			}
			if (cardAmount === 4) {
				numberMap = result.fourMap
			} else if (cardAmount === 5) {
				numberMap = result.fiveMap
			} else {
				numberMap = result.sixMap
			}
			result.totalMap.count(cardAmount)
			if (handResult.result == HandResult.Tie) {
				result.tieMap.count(cardAmount)
				numberMap.count(0)
				specilFiveMpa?.count(0)
			} else if (handResult.result == HandResult.BancoWins) {
				result.bMap.count(cardAmount)
				numberMap.count(1)
				specilFiveMpa?.count(1)
			} else if (handResult.result == HandResult.PuntoWins) {
				result.pMap.count(cardAmount)
				numberMap.count(2)
				specilFiveMpa?.count(2)
			}
			//
			let map
			if (cardAmount === 4) {
				map = result.fourCardMap
			} else if (cardAmount === 5) {
				map = result.fiveCardMap
			} else {
				map = result.sixCardMap
			}

			// streak，算法很多錯誤，和沒有被排除，沒次洗牌，沒有重新計算，這個所謂積分函數，到底代表什麼，沒有搞清楚。另外還需要計算strek的平均長度
			if (cardAmount === 6) {
				streak++
			} else {
				if (streak != 0) {
					result.naturalMap.count(streak)
					streak = 0
				}
			}
			for (const card of [...bHand, ...pHand]) {
				map.count(card.getPoint())
			}
		}
		for (let i = 0; i < shoeAmount; i++) {
			engine.playOneShoe(undefined, afterPlay)
		}
		this._statistic()
		engine.shutdown()
	},
	report() {
		// console.log("四張牌：", result.fourCardMap)
		// console.log("五張牌：", result.fiveCardMap)
		// console.log("六張牌：", result.sixCardMap)

		// result.naturalMap.printSorted("連續四張牌(包括叉燒)：")
		console.log("計算積分：")
		const arr:number[] = []
		for (let i = 0; i < 10; i++) {
			arr.push(result.naturalMap.get(i + 1) || 0)
		}
		// util.getAbyss(arr)

		tableDistributionHoz.print(`五千shoe，每手牌的張數分佈：`)
		tableDistributionVer.print(`五千shoe，每手牌的莊閒分佈：`)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 平均每手牌的張數4.94，平均每手的hand value 5.11
 *
 * 2. 總體上，4張37.8%，5張30.3%，6張31.8%，也就是說4張最多，5張6張相當
 * 3. 莊的優勢，四張，五張，六張，遞減，說明補牌不利於莊家(這是錯誤，2023年2月10日發現)
 * 3.5 閒家的優勢，並不是隨著補牌而遞增，反而是五張牌時，閒家勝出的可能性最小（相對於4張6張）（不完全正確， 2023年2月10日發現）
 * 3.6 五張牌，莊家補牌，閒家補牌，可以再分開研究（2023.2.10 重新研究了）
 * 3.7 補第五張牌，總體上對莊家有利，第六張，對閒家與和有利
 * 4. 和，四張牌，跟全局的概率一樣，在五張牌時出現的可能性偏低，在六張牌時，偏高
 * 5. 和，五張牌時，bad 幾率降低兩個百分點 pad，跟全局相當
 * 8. 大小的賠率，參考控制台的比例（63%）來計算EV
 * 9.
 *
 * 10. 五張牌，莊的優勢完全在處得以展現
 * 11. 四張牌，閒家略多於總體四張牌的比例，莊家略少於總體四張牌的比例
 * 11.1 最終效果，買莊虧錢，買閒不贏錢，因為莊閒基本持平（P莊*37.45%==P閒*38.37%）
 * 12. 六張牌，閒的優勢主要在這裡，買閒W2l 118到119(計算：用P6/B6)
 *
 * 13. 五張牌，莊家補牌/閒家補牌 0.63
 * 14. console.log("計算積分："),這個需要進一步研究，看看是否有利用價值。
 *
 */
