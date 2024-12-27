import { Engine, HandOutcome, HandResult } from 'bac-motor'
import CliTable from '../report/Table'
import util from '../tool/util'

const engine = new Engine()
const shoeAmount = 5000
const round = 3
const table = new CliTable({
	head: ['total', 'two', 'three'],
	colWidths: [20, 20, 20],
	style: { compact: false, 'padding-left': 1 },
})

const result = {
	two: 0,
	three: 0,
}

const testCase = {
	init(){
		engine.powerOn()
	},
	work(){
		result.two = 0
		result.three = 0
		const xxxx = (handResult: HandOutcome): void=> {
			if (handResult.result == HandResult.BancoWins){
				if (handResult.bancoHand.getLength() === 2){
					result.two++
				} else {
					result.three++
				}
			}
		}
		for (let i = 0; i < shoeAmount; i++){
			engine.playOneShoe(undefined, xxxx)
		}
		const total = result.two + result.three
		table.push([
			`${total}`,
			`${result.two} / ${util.percentize(result.two / total)}%`,
			`${result.three} / ${util.percentize(result.three / total)}%`,
		])
	},
	run(){
		for (let i = 0; i < round; i++){
			this.work()
		}
		engine.shutdown()
	},
	report(){
		table.print('莊贏，牌的張數：')
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 結論：
 * 1. 莊家贏，banco hand多以兩張牌取勝，是三張牌的機會的兩倍
 */
