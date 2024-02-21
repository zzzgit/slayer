import { BancoNatural, Engine, HandOutcome, Natural } from 'bac-motor'
import CliTable from '../report/Table'
import CounterMap from './collection/CounterMap'

const engine = new Engine()
const shoeAmount = 5000
const round = 3
const table = new CliTable({
	head: ['category', 'eight', 'nine'],
	colWidths: [20, 20, 20],
	style: { compact: false, 'padding-left': 1 },
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
	init(){
		engine.powerOn()
	},
	work(){
		result.banker8 = 0
		result.banker9 = 0
		result.player8 = 0
		result.player9 = 0
		cardMap = {
			p: new CounterMap<number>(),
			b: new CounterMap<number>(),
		}
		const afterShoe = (handComeout: HandOutcome): void => {
			const tags: Natural[] = handComeout.tagArray.filter((item) => {
				return item instanceof Natural
			}) as Natural[]
			if (!tags.length){
				return undefined
			}
			tags.forEach((tag) => {
				const bHand = handComeout.bancoHand.getDuplicatedCardArray()
				const pHand = handComeout.puntoHand.getDuplicatedCardArray()
				let first
				let second
				let map
				if (tag instanceof BancoNatural){
					if (tag.score === 8){
						result.banker8++
					} else {
						result.banker9++
					}
					[first, second] = bHand
					map = cardMap.b
				} else {
					if (tag.score === 8){
						result.player8++
					} else {
						result.player9++
					}
					[first, second] = pHand
					map = cardMap.p
				}
				map.count(first.getPoint())
				map.count(second.getPoint())
			})
		}
		for (let i = 0; i < shoeAmount; i++){
			engine.playOneShoe(undefined, afterShoe)
		}
		table.push(
			['B', result.banker8, result.banker9],
			['P', result.player8, result.player9]
		)
	},
	run(){
		for (let i = 0; i < round; i++){
			this.work()
		}
		cardMap.b.printSorted('莊家天牌，兩張card：')
		cardMap.p.printSorted('閒家天牌，兩張card：')

		engine.shutdown()
	},
	report(){
		table.print('天牌分佈：')
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 結論：
 * 1. 莊閒開天牌的機會相當。（2022年3月因為代碼錯誤，認為閒家開天牌的機會更多，2023年2月14日修復）
 * 2. hand value，九點八點都沒有明顯的優勢（儘管rank八點，被莊三點的補牌規則吃掉一點）
 * 3. 不論莊還是閒，天牌中0 8 9三張牌的可能性最大
 * 4.
 *
 *
 * 一shoe中，天牌的出現次數？以及比例（應該小於37%）
 */
