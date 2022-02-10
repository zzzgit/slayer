
// eslint-disable-next-line node/no-extraneous-import
import {Engine, ShoeOutcome} from "baccarat-engine"
import {BigRoad} from "marga"
import massiveTestConfig from "../config/massiveTestConfig"
import CounterMap from "./collection/CounterMap"
import {Card} from "cardation"
import CliTable from "../report/Table"
import util from "../tool/util"


const engine = new Engine()
const samael = require('samael')
const shoeAmount = 30000
const round = 1
const table = new CliTable({
	head: ['total', 'B', 'P', 'tie'],
	colWidths: [20, 20, 20, 20],
	style: {"compact": false, 'padding-left': 1},
})

let result: { tie: number; banker: number; player: number; allStreakLen: number[]; pStreakLen: number[]; bStreakLen: number[]; lastBankB: CounterMap<number>; firstBankB: CounterMap<number>; afterLongStreak: CounterMap<number>; longStreak: number[]; firstStreak: any} = {
	tie: 0,
	banker: 0,
	player: 0,
	allStreakLen: [],
	pStreakLen: [],
	bStreakLen: [],
	lastBankB: new CounterMap<number>(),
	firstBankB: new CounterMap<number>(),
	afterLongStreak: new CounterMap<number>(),
	longStreak: [],
	firstStreak: {
		barray: [],
		parray: [],
		allarray: [],
	},
}


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
			allStreakLen: [],
			pStreakLen: [],
			bStreakLen: [],
			lastBankB: new CounterMap<number>(),
			firstBankB: new CounterMap<number>(),
			afterLongStreak: new CounterMap<number>(),
			longStreak: [],
			firstStreak: {
				barray: [],
				parray: [],
				allarray: [],
			},
		}
		const date = new Date()
		const path = "/Users/luochao/Desktop/projects/slayer/src/baccaratology/reportCache/mm.txt"
		let prom = samael.writeToFile(path, `${date.toLocaleString()}\n  \n`).catch((e: Error) => console.log("錯誤", e))
		for (let i = 0; i < shoeAmount; i++) {
			const shoeComeout: ShoeOutcome = engine.playOneShoe()
			const info = shoeComeout.getStatisticInfo()
			let str = `${shoeComeout.getShoeIndex()}\t${info.banker}\t${info.player}\t${info.tie}\n`
			str = ""
			prom = prom.then(() => samael.appendToFile(path, str))
			this.showRoad(shoeComeout)

			result.banker += info.banker
			result.player += info.player
			result.tie += info.tie
		}
		const totalResult: number = result.tie + result.banker + result.player
		table.push([totalResult, result.banker, result.player, result.tie],
			[`100 %`, util.percentize(result.banker / totalResult) + " %",
				util.percentize(result.player / totalResult) + " %", util.percentize(result.tie / totalResult) + " %"])
	},
	showRoad(shoeComeout:ShoeOutcome) {
		const road: BigRoad = shoeComeout.getBigRoad()
		let streak = road.getFirstStreak()
		// 統計龍頭和龍尾的牌，不統計最後一列
		if (streak?.getNextStreak() && streak?.getFirstEntity()?.isBanker) {
			// 龍尾
			let gameid = streak?.getLastEntity()?.getIndex()
			let comeout = shoeComeout.getOutcomeMap().get(gameid as number)
			let bhand = comeout?.bankerHand.getDuplicatedCardArray() as Card[]
			let [first, second, three] = bhand
			result.lastBankB.count(first.getCardScore())
			result.lastBankB.count(second.getCardScore())
			if (three) {
				result.lastBankB.count(first.getCardScore())
			}
			let phand = comeout?.playerHand.getDuplicatedCardArray() as Card[]
			[first, second, three] = phand
			result.lastBankB.count(first.getCardScore())
			result.lastBankB.count(second.getCardScore())
			if (three) {
				result.lastBankB.count(first.getCardScore())
			}
			// 龍頭
			gameid = streak?.getFirstEntity()?.getIndex()
			comeout = shoeComeout.getOutcomeMap().get(gameid as number)
			bhand = comeout?.bankerHand.getDuplicatedCardArray() as Card[]
			[first, second, three] = bhand
			result.firstBankB.count(first.getCardScore())
			result.firstBankB.count(second.getCardScore())
			if (three) {
				result.firstBankB.count(first.getCardScore())
			}
			phand = comeout?.bankerHand.getDuplicatedCardArray() as Card[]
			[first, second, three] = phand
			result.firstBankB.count(first.getCardScore())
			result.firstBankB.count(second.getCardScore())
			if (three) {
				result.firstBankB.count(first.getCardScore())
			}
		}
		// 研究第一列
		const resultFirstStreak = result.firstStreak
		const length = streak?.getLength()
		resultFirstStreak.allarray.push(length)
		if (streak?.getFirstEntity()?.isBanker) {
			resultFirstStreak.barray.push(length)
		} else {
			resultFirstStreak.parray.push(length)
		}
		// 遍歷streak,忽略最後一個
		while (streak?.getNextStreak()) {
			const longStreak = 9
			const len = streak.getLength()
			if (streak.getFirstEntity()?.isBanker) {
				result.bStreakLen.push(len)
			} else {
				result.pStreakLen.push(len)
			}
			result.allStreakLen.push(len)
			const prev = streak.getPreviousStreak()
			if (prev && prev.getLength() > longStreak) {
				result.longStreak.push(streak.getLength())
			}
			streak = streak.getNextStreak()
		}
	},
	run() {
		for (let i = 0; i < round; i++) {
			this.work()
		}
		engine.shutdown()
	},
	report() {
		table.print(`莊閒分佈： `)
		const alltotal = result.allStreakLen.reduce((a, b)=>a + b)
		const btotal = result.bStreakLen.reduce((a, b)=>a + b)
		const ptotal = result.pStreakLen.reduce((a, b)=>a + b)
		console.log(`平均長度：`, alltotal / result.allStreakLen.length)
		console.log(`莊平均長度：`, btotal / result.bStreakLen.length)
		console.log(`閒平均長度：`, ptotal / result.pStreakLen.length)
		// result.lastBankB.printSorted("banker龍尾的牌：")
		// result.firstBankB.printSorted("banker龍頭的牌：")
		console.log(`龍擺尾長度：`, result.longStreak.reduce((a, b) => a + b) / result.longStreak.length, result.longStreak.length)
		console.log(``)
		console.log(`第一列平均長度：`, result.firstStreak.allarray.reduce((a:number, b:number)=>a + b) / result.firstStreak.allarray.length)
		console.log(`第一列莊長度：`, result.firstStreak.barray.reduce((a:number, b:number)=>a + b) / result.firstStreak.barray.length)
		console.log(`第一列閒長度：`, result.firstStreak.parray.reduce((a: number, b: number) => a + b) / result.firstStreak.parray.length)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 平均長度： 1.970(不知有何用處？)
 * 2. 莊平均長度： 1.963 （原因是閒多莊少）
 * 3. 閒平均長度： 1.977
 * 4. 莊之所以短，是因為莊出現的次數少，而不是因為莊的條子少
 * 5. 長龍之後的streak，似乎並沒有bias
 * 6. 第一列，比平均長度長
 * 7. 最後一列，對於平均長度有負面影響
 */
