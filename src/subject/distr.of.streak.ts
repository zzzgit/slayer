
import {Engine, ShoeOutcome} from "bac-motor"
import CliTable from "../report/Table"
import util from "../tool/util"
import CounterMap from "./collection/CounterMap"

const engine = new Engine()
const shoeAmount = 20000
const round = 1
const width = 8
const table = new CliTable({
	head: ['categ', "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"],
	colWidths: [width, width, width, width, width, width, width, width, width, width, width, width, width],
	style: {"compact": false, 'padding-left': 1},
})

const result: { [key: string]: CounterMap<number> } = {
	bstreak: new CounterMap<number>(),
	pstreak: new CounterMap<number>(),
	firstStreak: new CounterMap<number>(),
}


const testCase = {
	init() {
		engine.powerOn()
	},
	work() {
		const mapB = result.bstreak
		const mapP = result.pstreak
		const mapfirst = result.firstStreak
		for (let i = 0; i < shoeAmount; i++) {
			const shoeoutcome: ShoeOutcome = engine.playOneShoe(undefined, undefined)
			const road = shoeoutcome.getBigRoad()
			let streak = road.getFirstStreak()
			// first streak
			// if (streak?.getFirstEntity()?.isBanco) {
			// }
			mapfirst.count(streak?.getLength() || 0)
			// 所有
			while (streak) {
				const first = streak.getFirstEntity()
				if (first?.isBanco) {
					mapB.count(streak.getLength())
				} else {
					mapP.count(streak.getLength())
				}
				streak = streak.getNextStreak()
			}
		}
		const arrB: any[] = []
		const arrP: any[] = []
		for (let i = 11; i < 23; i++) {
			arrB.push(mapB.get(i))
			arrP.push(mapP.get(i))
		}
		table.push(["B", ...arrB], ["P", ...arrP])
	},
	run() {
		for (let i = 0; i < round; i++) {
			this.work()
		}
		engine.shutdown()
	},
	report() {
		table.print(`七萬shoe長龍分佈：`)
		// let totalB = 0
		// let totalP = 0
		// result.bstreak.forEach((item)=>{totalB = totalB + item})
		// result.pstreak.forEach((item)=>{totalP = totalP + item})
		// console.log("莊、閒的條數：", totalB, totalP)
		util.getAbyss(result.bstreak.getSortedEntities().map(item => item.value))
		console.log("----上面是莊，下面是閒---------")
		util.getAbyss(result.pstreak.getSortedEntities().map(item => item.value))
		console.log("----下面是閒第一列，不論莊閒---------")
		util.getAbyss(result.firstStreak.getSortedEntities().map(item => item.value))
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 莊和閒的分佈，1000靴的樣例就夠了
 * 2. 電腦性能足夠的情況下，可以測試長龍的長度的極限，目前測試到的極限是22
 * 3. 莊、閒的條數，完全一樣，萬分之1以下的區別
 * 4. 硬件和軟件條件滿足時，可以統計長龍時出現的牌
 * 5. 由於，莊多閒少，導致，對閒進行斬龍比較划算
 * 6. 莊，不穩定，不宜斬龍
 * 7.
 * 8. 第一列，不穩定，不宜戰龍
 */
