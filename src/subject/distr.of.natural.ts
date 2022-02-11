
// eslint-disable-next-line node/no-extraneous-import
import {Engine, HandOutcome, Natural, BankerNatural} from "bac-motor"
import CliTable from "../report/Table"
import CounterMap from "./collection/CounterMap"


const engine = new Engine()
const shoeAmount = 9000
const round = 3
const table = new CliTable({
	head: ['category', 'eight', 'nine'],
	colWidths: [20, 20, 20],
	style: {"compact": false, 'padding-left': 1},
})

const result = {
	banker8: 0,
	banker9: 0,
	player8: 0,
	player9: 0,
}
let cardMap = {
	p: new CounterMap<number>(),
	b: new CounterMap<number>(),
}


const testCase = {
	init() {
		engine.powerOn()
	},
	work() {
		result.banker8 = 0
		result.banker9 = 0
		result.player8 = 0
		result.player9 = 0
		cardMap = {
			p: new CounterMap<number>(),
			b: new CounterMap<number>(),
		}
		for (let i = 0; i < shoeAmount; i++) {
			engine.playOneShoe(undefined, (handComeout:HandOutcome)=>{
				const tags: Natural[] = handComeout.tagArray.filter((item) => {
					return item instanceof Natural
				}) as Natural[]
				if (tags.length) {
					tags.forEach((tag) => {
						const bHand = handComeout.bankerHand.getDuplicatedCardArray()
						const pHand = handComeout.playerHand.getDuplicatedCardArray()
						if (tag instanceof BankerNatural) {
							if (tag.score === 8) {
								result.banker8++
							} else {
								result.banker9++
							}
							const [first, second] = bHand
							const bMap = cardMap.b
							bMap.count(first.getCardScore())
							bMap.count(second.getCardScore())
						} else {
							if (tag.score === 8) {
								result.player8++
							} else {
								result.player9++
							}
							const [first, second] = pHand
							const pMap = cardMap.p
							pMap.count(first.getCardScore())
							pMap.count(second.getCardScore())
						}
					})
				}
			})
		}
		table.push([`B`, result.banker8, result.banker9],
			["P", result.player8, result.player9])
	},
	run() {
		for (let i = 0; i < round; i++) {
			this.work()
		}
		cardMap.b.printSorted("莊家天牌，兩張card：")
		cardMap.b.printSorted("閒家天牌，兩張card：")
		engine.shutdown()
	},
	report() {
		table.print(`天牌分佈：`)
	},
}

testCase.init()
testCase.run()
testCase.report()


/**
 * 結論：
 * 1. 閒家出現天牌的可能性比莊家大（這點很難解釋，因為跟補牌利閒的結論矛盾）
 * 2. 九點比八點出現幾率稍大
 * 3. 不論莊還是閒，天牌中0 8 9三張牌的可能性最大
 * 4. 閒家天牌中，出現6 7的可能性小
 */
