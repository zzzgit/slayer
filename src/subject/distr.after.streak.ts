import { Engine, ShoeOutcome } from 'bac-motor'
import { BigEntity, Streak, TieBadge } from 'marga'
import util from '../tool/util'

const engine = new Engine()
const shoeAmount = 500
const round = 1
// const width = 8
// const table = new CliTable({
// 	head: ['categ', "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"],
// 	colWidths: [width, width, width, width, width, width, width, width, width, width, width, width, width],
// 	style: {"compact": false, 'padding-left': 1},
// })

const statistics = {
	b: 0,
	p: 0,
	yes: 0,
	no: 0,
}

const isPure = (streak: Streak): boolean=> {
	let entity = streak.getFirstEntity()
	while (entity){
		// 未實現，在marga項目中
		const badge = entity.getTagArray().some(b=> b instanceof TieBadge)
		if (badge){
			return false
		}
		entity = entity.getNextEntity() as BigEntity
	}
	return true
}

const testCase = {
	init(){
		engine.powerOn()
	},
	work(){
		statistics.b = 0
		statistics.p = 0
		for (let i = 0; i < shoeAmount; i++){
			const shoeoutcome: ShoeOutcome = engine.playOneShoe(undefined, undefined)
			const road = shoeoutcome.getBigRoad()
			let streak = road.getFirstStreak()
			while (streak){
				//  龍
				if (streak.getFirstEntity()?.isPunto){
					if (streak.getLength() > 6 && isPure(streak)){
						let nextStreak = streak.getNextStreak()
						if (nextStreak){
							// if (nextStreak.getLength() === 2) {
							// 	statistics.yes++
							// } else if (nextStreak.getLength() > 2) {
							// 	statistics.no++
							// }
						}
						let nextEntity = nextStreak
							?.getFirstEntity()
							// 龍擺尾第二手
							?.getNextEntity() as BigEntity
						let counter = 0
						while (counter < 2){
							if (!nextEntity){
								nextStreak = nextStreak?.getNextStreak()
								if (!nextStreak){
									break
								}
								nextEntity = nextStreak.getFirstEntity() as BigEntity
							}
							if (nextEntity.isBanco){
								statistics.b++
							} else {
								statistics.p++
							}
							counter++
							nextEntity = nextEntity.getNextEntity() as BigEntity
						}
					}
				}
				streak = streak.getNextStreak()
			}
		}
	},
	run(){
		for (let i = 0; i < round; i++){
			this.work()
		}
		engine.shutdown()
	},
	report(){
		const {
			b, p, yes, no,
		} = statistics
		const perct = util.percentize(b / p, 3)
		const percts = util.percentize(yes / no, 3)
		console.log(b, p, perct)
		console.log(yes, no, percts)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 考察龍擺尾之後，第二手到第四手，兩萬和四萬shoe的數據，根本不穩定
 * 2. 龍之後，龍擺尾是否適合斬龍，也不穩定
 * 3. 幾乎毫無參考價值
 * 4. 龍的長度設置越長，測試數據越不穩定，結果數據非常令人沮喪
 * 5. 並沒有考慮排除和局的情況（程序未實現，懶得做）
 * 6.

 */
