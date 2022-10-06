import {Engine, HandOutcome, ShoeOutcome} from "bac-motor"
import {BigEntity} from "marga"
import CliTable from "../report/Table"
import CounterMap from "./collection/CounterMap"

const engine = new Engine()
const shoeAmount = 1000
const round = 1
const width = 8
const table = new CliTable({
	head: ['categ', "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
	colWidths: [width, width, width, width, width, width, width, width, width, width, width, width, width, width],
	style: {"compact": false, 'padding-left': 1},
})

const result: { [key: string]: CounterMap<number> } = {
	counter: new CounterMap<number>(),
}


const testCase = {
	init() {
		engine.powerOn()
	},
	work() {
		const {counter} = result
		for (let i = 0; i < shoeAmount; i++) {
			// const tempMap = new Map<number, HandOutcome>()
			const shoeoutcome: ShoeOutcome = engine.playOneShoe(undefined, ()=>{
				// tempMap.set(handResult.handIndex, handResult)
			})
			const map = shoeoutcome.getOutcomeMap()
			const road = shoeoutcome.getBigRoad()
			let streak = road.getFirstStreak()

			while (streak) {
				if (streak.getLength() > 6) {
					let first = streak.getFirstEntity()
					// 只統計莊家贏
					if (first?.isBanco) {
						while (first) {
							const hOutcome = map.get(first.getGameId()) as HandOutcome
							for (const card of hOutcome.bancoHand.getDuplicatedCardArray()) {
								counter.count(card.getRank())
							}
							for (const card of hOutcome.puntoHand.getDuplicatedCardArray()) {
								counter.count(card.getRank())
							}
							first = first.getNextEntity() as BigEntity
						}
					}
				}
				streak = streak.getNextStreak()
			}
		}
		counter.printSorted("莊的長龍，單張牌出現機會分佈：")
		const arrB: any[] = []
		const arrP: any[] = []

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
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1.
 */
