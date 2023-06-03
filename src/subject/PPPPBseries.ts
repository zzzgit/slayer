import {Blackhole, LosingEntity, WinningEntity} from "@zzznpm/orphan"
import Engine from "bac-motor"

const engine = new Engine()
const shoeAmount = 200
const round = 1
const bhole = new Blackhole()

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
				// 斬莊還是斬閒
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
						bhole.addEntity(new WinningEntity(true))
					} else {
						bhole.addEntity(new LosingEntity(true))
						if (length === 5) {
							// 必須存在這一行，不然邏輯有誤
						} else if (length === 6) {
							bhole.addEntity(new WinningEntity(true))
						} else {
							bhole.addEntity(new LosingEntity(true))
						}
					}
				} else {
					// the last treak
					if (length === 4) {
						//
					} else {
						bhole.addEntity(new LosingEntity(true))
						if (length === 5) {
							//
						} else if (length === 6) {
							//
						} else {
							bhole.addEntity(new LosingEntity(true))
						}
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
		const info = bhole.getOutcome(true)
		console.log(info.bet)
		console.log(info.statistics)
		console.log(info.strategy)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 斬閒龍，必輸，w2l低於105%，也就是說扣除佣金後，沒有利潤
 * 2. 斬莊還是斬閒，都是輸
 */
