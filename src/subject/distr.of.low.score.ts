import {Card} from "cardation"

// eslint-disable-next-line node/no-extraneous-import
import {Engine, HandOutcome, HandResult} from "baccarat-engine"
import CounterMap from "./collection/CounterMap"
import CliTable from "../report/Table"
import util from "../tool/util"


const engine = new Engine()
const shoeAmount = 2000
const round = 3
const table = new CliTable({
	head: ['total', 'B', 'P', 'tie'],
	colWidths: [20, 20, 20, 20],
	style: {"compact": false, 'padding-left': 1},
})

const result:{[key: string]:any} = {
	tie: 0,
	banker: 0,
	player: 0,
	cardPoint: new CounterMap<number>(),
}


const testCase = {
	init() {
		engine.powerOn()
	},
	work() {
		result.tie = 0
		result.banker = 0
		result.player = 0
		for (let i = 0; i < shoeAmount; i++) {
			engine.playOneShoe(undefined, (handResult: HandOutcome)=>{
				const bScore = handResult.bankerHand.getScore()
				const pScore = handResult.playerHand.getScore()
				if (bScore < 4 && pScore < 4) {
					if (handResult.result === HandResult.Tie) {
						result.tie++
					} else if (handResult.result === HandResult.BankerWins) {
						result.banker++
					} else {
						result.player++
					}
					handResult.bankerHand.getDuplicatedCardArray().forEach((card: Card) => {
						const point = card.getCardPoint()
						result.cardPoint.count(point)
					})
					handResult.playerHand.getDuplicatedCardArray().forEach((card: Card) => {
						const point = card.getCardPoint()
						result.cardPoint.count(point)
					})
				}
			})
		}
		const totalResult: number = result.tie + result.banker + result.player
		table.push([totalResult, result.banker, result.player, result.tie],
			[`100 %`, util.percentize(result.banker / totalResult) + " %", util.percentize(result.player / totalResult) + " %", util.percentize(result.tie / totalResult) + " %"])
		// table.push([100, util.percentize(result.banker / totalResult), util.percentize(result.player / totalResult), util.percentize(result.tie / totalResult)])
	},
	run() {
		for (let i = 0; i < round; i++) {
			this.work()
		}
		engine.shutdown()
	},
	report() {
		table.print(`低點數（0->3）莊閒分佈：`)
		const table2 = new CliTable({
			head: ['A', '2', '3', "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
			colWidths: [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
			style: {"compact": false, 'padding-left': 0},
		})
		const cardpoint = result.cardPoint
		const arr = []
		for (let i = 1; i < 14; i++) {
			arr.push(cardpoint.get(i))
		}
		table2.push(arr)
		table2.print('低點數（0->3）牌的分佈：')
	},
}

testCase.init()
testCase.run()
testCase.report()


/**
 * 1. 和的幾率大大增加，佔到四分之一（因為莊和閒，都在0到3點的範圍，所以這個結果沒有意義）
 * 2. 莊贏的幾率略高於閒贏的幾率
 * 3.   4 5 6 7 四張牌最少， 反之不成立，去掉這四張牌，對莊閒的概率無影響
 */
