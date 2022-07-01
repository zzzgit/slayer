import {LosingEntity, Road, WinningEntity} from "@zzznpm/orphan"
import Engine from "bac-motor"

const engine = new Engine()
const shoeAmount = 300
const round = 1
const road = new Road()

const testCase = {
	init() {
		engine.powerOn()
	},
	work() {
		for (let i = 0; i < shoeAmount; i++) {
			const outcome = engine.playOneShoe()
			const bigRoad = outcome.getBigRoad()
			let streak = bigRoad.getFirstStreak()
			while (streak) {
				if (streak.getFirstEntity()?.isBanco) {
					streak = streak.getNextStreak()
					continue
				}
				const length = streak.getLength()
				if (length < 4) {
					streak = streak.getNextStreak()
					continue
				}
				if (streak.getNextStreak()) {
					if (length === 4) {
						road.addEntity(new WinningEntity(true))
					} else if (length === 5) {
						road.addEntity(new WinningEntity(true))
					} else if (length === 6) {
						road.addEntity(new LosingEntity(true))
						road.addEntity(new WinningEntity(true))
					} else {
						road.addEntity(new LosingEntity(true))
						road.addEntity(new LosingEntity(true))
					}
				} else {	// the last treak
					if (length === 4) {
						// road.addEntity(new WinningEntity(true))
					} else if (length === 5) {
						road.addEntity(new LosingEntity(true))
					} else if (length === 6) {
						road.addEntity(new LosingEntity(true))
					} else {
						road.addEntity(new LosingEntity(true))
						road.addEntity(new LosingEntity(true))
					}
				}
				streak = streak.getNextStreak()
			}
		}
	},
	run() {
		for (let i = 0; i < round; i++) {
			this.work()
		}
		engine.shutdown()
	},
	report() {
		const info = road.getOutcome()
		console.log(info.bet)
		console.log(info.statistics)
	},
}

testCase.init()
testCase.run()
testCase.report()


/**
 * 1.
 * 2.
 */
