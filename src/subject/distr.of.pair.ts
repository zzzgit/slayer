import CounterMap from './collection/CounterMap'
import { Engine, HandOutcome } from 'bac-motor'
import CliTable from '../report/Table'
import util from '../tool/util'
import { Card, Pair } from 'cardation'

const engine = new Engine()
const shoeAmount = 5000
const round = 1
const table_distribution = new CliTable({
	head: ['total', 'pair', 'pair %'],
	colWidths: [20, 20, 20],
	style: { compact: false, 'padding-left': 1 },
})
// const table_score = new CliTable({
// 	head: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
// 	colWidths: [8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
// 	style: { compact: false, 'padding-left': 1 },
// })
type ResultType = { indexMap: CounterMap<number>, occurenceMap: CounterMap<number>, pairMap: CounterMap<number>, all: number, pair: number}
const result: ResultType = {
	indexMap: new CounterMap<number>(),
	occurenceMap: new CounterMap<number>(),
	pairMap: new CounterMap<number>(),
	all: 0,
	pair: 0,
}

const testCase = {
	init(){
		engine.powerOn()
	},
	work(){
		result.all = 0
		result.pair = 0
		result.indexMap.clear()
		result.occurenceMap.clear()
		result.pairMap.clear()
		const afterbet = (): ((hcome: HandOutcome) => void) | undefined=> {
			return (handResult: HandOutcome)=> {
				result.all++
				const bhand = handResult.bancoHand.getDuplicatedCardArray()
				const phand = handResult.puntoHand.getDuplicatedCardArray()
				bhand.length = 2
				phand.length = 2
				if (Pair.isPair(bhand)){
					result.pair++
					newFunction(handResult, bhand)
				}
				if (Pair.isPair(phand)){
					result.pair++
					newFunction(handResult, phand)
				}
			}
		}
		for (let i = 0; i < shoeAmount; i++){
			const outcome = engine.playOneShoe(undefined, afterbet())
			// const firstboard = outcome.getBeadRoad()getFirstEntity() as BeadEntity
			// const hasPair = firstboard.hasAnyPair()
			const pair = outcome.getStatisticInfo().pair.total
			result.occurenceMap.count(pair)
		}
		table_distribution.push([
			result.all,
			result.pair,
			util.percentize(result.pair / result.all) + ' %',
		])

		function newFunction(handResult: HandOutcome, hand: Card[]){
			result.indexMap.count(handResult.handIndex)
			result.pairMap.count(hand[0].getRank())
		}
	},
	run(){
		for (let i = 0; i < round; i++){
			this.work()
		}

		engine.shutdown()
	},
	report(){
		table_distribution.print('對子統計：')

		// console.log(`對子位置分佈：`)
		// const asciichart = require('asciichart')
		// console.log(asciichart.plot(result.index.map((item: number)=>item || 0)))

		// result.indexMap.printSorted("對子出現的位置分佈：")
		result.occurenceMap.printSorted('對子occurence分佈：')
		result.pairMap.printSorted('對子點數分佈：')
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 左右對子出現總幾率14.9%()，而tie是9.55%
 * 1.5 (32-1)/(416-1) = 31/415 = 7.47%
 * 1.6 不押any pair，不划算，不押完美對子，不划算
 * 2. 對子出現的牌，8，6，4，9，7，2...
 * 3. 對子本身的點數，應該是平均分佈（A-K），實際上，6好像略低
 * 4. tie的EV-0.143596, pair的EV-0.1036
 * 5. 買pair比買tie好，因為賠率更高，即使出現的機率更低
 *
 *
* 無對子的概率：
 * 6張牌：0.155
 * 5張牌：0.284
 * 4張牌：0.457
 *
 */
