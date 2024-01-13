import { Engine, HandOutcome } from 'bac-motor'
import massiveTestConfig from '../config/massiveTestConfig'
import CliTable from '../report/Table'
// import util from "../tool/util"
import CounterMap from './collection/CounterMap'

const engine = new Engine()
const shoeAmount = 5000

const tableDistribution = new CliTable({
	head: [' ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	colWidths: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
	style: { compact: false, 'padding-left': 1 },
})

const arr: number[] = []
let result = {
	hands: new CounterMap<number>(),
	totalValue: 0,
	totalGames: 0,
	gamesInOneShoe: new CounterMap<number>(),
	record: arr,
	acd_streak: new CounterMap<number>(),
}

const testCase = {
	init(){
		const config = Object.assign({}, massiveTestConfig, {
			shouldGenerateRoad: false,
			shouldCutShoe: true,
		})
		engine.powerOn(config)
	},
	run(){
		result = {
			hands: new CounterMap<number>(),
			totalValue: 0,
			totalGames: 0,
			gamesInOneShoe: new CounterMap<number>(),
			record: [],
			acd_streak: new CounterMap<number>(),
		}
		let acd_record = 0
		let acd_sequence = 0
		const afterPlay = (handResult: HandOutcome): void => {
			const bHand = handResult.bancoHand
			const pHand = handResult.puntoHand
			const bPoint = bHand.getPoint()
			const pPoint = pHand.getPoint()
			result.hands.count(bPoint)
			result.hands.count(pPoint)
			result.totalValue += bPoint + pPoint
			let condition = bHand.getLength() == 2 && pHand.getLength() == 3
			condition =
				condition || (bHand.getLength() == 3 && pHand.getLength() == 2)
			if (condition){
				acd_record++
				acd_sequence++
			} else {
				if (acd_sequence !== 0){
					result.acd_streak.count(acd_sequence)
					acd_sequence = 0
				}
			}
		}
		for (let i = 0; i < shoeAmount; i++){
			acd_record = 0
			acd_sequence = 0
			const shoeOutcome = engine.playOneShoe(undefined, afterPlay)
			const { total } = shoeOutcome.getStatisticInfo()
			result.gamesInOneShoe.count(total)
			result.totalGames += total
			// result.record.push(+util.percentize(noneACD_record / total, 1))
			result.record.push(acd_record)
		}
		const { hands: h } = result
		tableDistribution.push([
			'hand value',
			h.get(0) + '',
			h.get(1) + '',
			h.get(2) + '',
			h.get(3) + '',
			h.get(4) + '',
			h.get(5) + '',
			h.get(6) + '',
			h.get(7) + '',
			h.get(8) + '',
			h.get(9) + '',
		])
		engine.shutdown()
	},
	report(){
		tableDistribution.print('occurrence of hand value：')
		console.log(`每shoe的game數平均值:			${result.totalGames / shoeAmount} games`)
		console.log(
			`每個game的hand value 平均值:	${result.totalValue / result.totalGames / 2}`
		)
		console.log(Math.min(...result.record), Math.max(...result.record))
		console.log('acd streak:', result.acd_streak)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 目前的機制，平均一shoe是75個game，偏高
 * 2. 平均每手牌的hand value平均值5.11，中間值應該是4.5
 * 2.1 由於小牌可以補牌，所以平均值被提高到5.11
 * 2. hand value，6789最多，450在中間，123最少，補牌造成的
 * 3. 統計每shoe中的比例（結果表面，非常不穩定，既然不穩定，需要再研究streak）：
 * 3.1 noneACD的比例，最低16.7最高59.3，而理論值是37.5
 * 3.2 BothACD的比例，最低15.7最高55.4，而理論值是31.5
 * 3.3 五張牌的比例，  最低12.3最高50，而理論值是30.5
 *
 * 4. NoneACD，4張牌，每shoe出現次數，最低15，最大值48，百分比最低17，最高56
 * 5. BothACD，6張牌，每shoe出現次數，最低15，最大值37，百分比最低17，最高49
 * 6.
 *
 * 11. streak平均長度 NoneACD 1.6，BothACD 1.45，5張牌，1.4(五張牌分解之後，肯定更加短)
 *
 */

// 統計: BothAC 情況下，（一直出小牌），看看如果閒家能連續贏多少手（越長，那麼黑天鵝越嚴重）
