import { Config, Engine } from 'bac-motor'
import { Card } from 'cardation'
import CliTable from '../report/Table'
import util from '../tool/util'
import CardMagazine from './cardMagazine/CardMagazine'

const engine = new Engine()
const shoeAmount = 5000
let cardsAmount = 0
const round = 1
const table = new CliTable({
	head: ['total', 'B', 'P', 'tie'],
	colWidths: [20, 20, 20, 20],
	style: { compact: false, 'padding-left': 1 },
})

const result = {
	tie: 0,
	banker: 0,
	player: 0,
}

const testCase = {
	init(){
		const cards: Card[] = CardMagazine.getCardsWithNo6()
		cardsAmount = cards.length
		const config: Config = {
			customizedShoe: cards,
			shouldCutShoe: false,
			shouldUseBlackCard: false,
			shouldBurnCard: false,
			shouldShuffle: true,
			shouldGenerateRoad: false,
			shouldShuffleWhileCollectBancoHand: false,
		}
		engine.powerOn(config)
	},
	work(){
		result.tie = 0
		result.banker = 0
		result.player = 0

		for (let i = 0; i < shoeAmount; i++){
			const shoeComeout = engine.playOneShoe(undefined, undefined)
			const info = shoeComeout.getStatisticInfo()
			result.banker = result.banker + info.banco
			result.player = result.player + info.punto
			result.tie = result.tie + info.tie
		}

		const totalResult: number = result.tie + result.banker + result.player
		table.push(
			[totalResult, result.banker, result.player, result.tie],
			[
				'100 %',
				util.percentize(result.banker / totalResult) + ' %',
				util.percentize(result.player / totalResult) + ' %',
				util.percentize(result.tie / totalResult) + ' %',
			]
		)
		// table.push([100, util.percentize(result.banker / totalResult), util.percentize(result.punto / totalResult), util.percentize(result.tie / totalResult)])
	},
	run(){
		for (let i = 0; i < round; i++){
			this.work()
		}
		engine.shutdown()
	},
	report(){
		console.log(`cards in shoe: ${cardsAmount}`)
		table.print('莊閒分佈：')
		const cal = util.getOddCal(result.banker, result.player, result.tie, false)
		console.log(`買莊EV: ${cal.getReward(true) * 100}%`)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 只保留5-9，買莊w2l 1.24，六張牌/五張牌 1.2
 * 2. 只保留0-4（沒有jkq），買閒w2l 1.24，五張牌/六張牌 1.11
 * 2.
 */
