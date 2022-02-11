

import {Heart, NumberCard, FaceCard, Card, AceCard} from "cardation"
// eslint-disable-next-line node/no-extraneous-import
import {Engine, Config} from "bac-motor"
import CliTable from "../report/Table"
import util from "../tool/util"

const engine = new Engine()
const shoeAmount = 10000
const round = 1
const table = new CliTable({
	head: ['total', 'B', 'P', 'tie'],
	colWidths: [20, 20, 20, 20],
	style: {"compact": false, 'padding-left': 1},
})

const result = {
	tie: 0,
	banker: 0,
	player: 0,
}


const testCase = {
	init() {
		const cards:Card[] = []
		cards.push(new AceCard(new Heart(), 1))

		cards.push(new NumberCard(new Heart(), 2, 2))
		cards.push(new NumberCard(new Heart(), 3, 3))
		cards.push(new NumberCard(new Heart(), 4, 4))
		cards.push(new NumberCard(new Heart(), 5, 5))
		cards.push(new NumberCard(new Heart(), 6, 6))
		cards.push(new NumberCard(new Heart(), 7, 7))
		cards.push(new NumberCard(new Heart(), 8, 8))
		cards.push(new NumberCard(new Heart(), 9, 9))

		cards.push(new FaceCard(new Heart(), 11, 0))
		cards.push(new FaceCard(new Heart(), 11, 0))
		cards.push(new FaceCard(new Heart(), 11, 0))
		cards.push(new FaceCard(new Heart(), 11, 0))

		cards.push(new FaceCard(new Heart(), 12, 0))
		cards.push(new FaceCard(new Heart(), 12, 0))
		cards.push(new FaceCard(new Heart(), 12, 0))
		cards.push(new FaceCard(new Heart(), 12, 0))

		cards.push(new FaceCard(new Heart(), 13, 0))
		cards.push(new FaceCard(new Heart(), 13, 0))
		cards.push(new FaceCard(new Heart(), 13, 0))
		cards.push(new FaceCard(new Heart(), 13, 0))

		const config:Config = {
			customizedShoe: cards,
			shouldCutShoe: false,
			shouldUseBlackCard: false,
			shouldShuffleWhileCollectBankerHand: false,
		}
		engine.powerOn(config)
	},
	work() {
		result.tie = 0
		result.banker = 0
		result.player = 0
		for (let i = 0; i < shoeAmount; i++) {
			const shoeComeout = engine.playOneShoe()
			const info = shoeComeout.getStatisticInfo()
			result.banker = result.banker + info.banker
			result.player = result.player + info.player
			result.tie = result.tie + info.tie
			//
		}

		const totalResult: number = result.tie + result.banker + result.player
		table.push([totalResult, result.banker, result.player, result.tie], [`100 %`, util.percentize(result.banker / totalResult) + " %", util.percentize(result.player / totalResult) + " %", util.percentize(result.tie / totalResult) + " %"])
		// table.push([100, util.percentize(result.banker / totalResult), util.percentize(result.player / totalResult), util.percentize(result.tie / totalResult)])
	},
	run() {
		for (let i = 0; i < round; i++) {
			this.work()
		}
		engine.shutdown()
	},
	report() {
		table.print(`莊閒分佈：`)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. card張數超過10，基本上就沒有什麼意義，超過20，則完全沒有bias
 */
