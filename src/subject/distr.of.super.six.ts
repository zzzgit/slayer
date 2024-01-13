import CounterMap from './collection/CounterMap'
import { Engine, SuperSix, HandResult, HandOutcome } from 'bac-motor'
import CliTable from '../report/Table'
import util from '../tool/util'

const engine = new Engine()
const shoeAmount = 5000
const round = 1
const table = new CliTable({
	head: ['occurrence / shoe', 'shoes', 'percentage'],
	colWidths: [20, 10, 10],
	style: { compact: false, 'padding-left': 1 },
})

const result: {
	super: CounterMap<number>
	prevB: number
	prevP: number
	tie: number
	allB: number
	allP: number
} = {
	super: new CounterMap<number>(),
	prevB: 0,
	prevP: 0,
	tie: 0,
	allB: 0,
	allP: 0,
}

const testCase = {
	init(){
		engine.powerOn()
	},
	work(){
		result.super = new CounterMap<number>()
		result.prevB = 0
		result.prevP = 0
		result.tie = 0
		result.allB = 0
		result.allP = 0
		let two = 0
		let three = 0
		for (let i = 0; i < shoeAmount; i++){
			let super6 = 0
			engine.playOneShoe(undefined, (outcome: HandOutcome) => {
				const isSuper6 = outcome.tagArray.some((item) => {
					return item instanceof SuperSix
				})
				if (isSuper6){
					super6++
					const tag: SuperSix = outcome.tagArray.find(
						(item) => item instanceof SuperSix
					) as SuperSix
					if (tag.withCards == 3){
						three++
					} else {
						two++
					}
					// 沒有剔除幸運六本身
					if (
						outcome.getPreviousHandOutcome()?.result == HandResult.BancoWins
					){
						result.prevB++
					} else if (
						outcome.getPreviousHandOutcome()?.result == HandResult.PuntoWins
					){
						result.prevP++
					} else {
						// 包括了第一手就是幸運六
						result.tie++
					}
				}
				if (outcome.result == HandResult.BancoWins){
					result.allB++
				} else if (outcome.result == HandResult.PuntoWins){
					result.allP++
				}
			})
			result.super.count(super6)
		}
		console.log(`兩張牌${two}， 三張牌${three}`)
	},
	run(){
		for (let i = 0; i < round; i++){
			this.work()
		}
		engine.shutdown()
	},
	report(){
		const arr = result.super.getSortedEntities()
		let total = 0
		arr.forEach((item) => {
			total = total + item.value + 0
		})
		arr.forEach((item) => {
			table.push([
				item.key + '',
				item.value,
				util.percentize(item.value / total),
			])
		})
		table.push(['total', total, '100'])
		table.print('幸運6分佈：')
		const map = new Map()
		map.set('six after B', result.prevB)
		map.set('six after P', result.prevP)
		map.set('six after tie', result.tie)
		console.log('幸運六前一手：', map)
		console.log(
			'幸運六在閒後，百分比：',
			(result.prevP / (result.prevP + result.prevB)) * 100
		)
		console.log(
			'所有結果中閒，百分比：',
			(result.allP / (result.allP + result.allB)) * 100
		)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 結論：
 * 1. 平均每shoe 3.85次（有空重新計算一下）
 * 2. 2到5，共佔71.5%
 * 3. 1到7，共佔94.5%
 * 4. 最少0次，最多13次
 * 5. 兩張牌/三張牌： 2.25
 * 6. 幸運六出現在和的概率比較高，10%到11之間，高出和本身出現的概率（9.5%）
 * 7.
 */
