import {Engine, Config} from "bac-motor"
import CliTable from "../report/Table"
import util from "../tool/util"

const conf:Config = {
	shouldShuffleWhileCollectBankerHand: false,
	shouldCutShoe: false,
	shouldBurnCard: false,
}
console.log(conf)
const engine = new Engine()
const shoeAmount = 1000
const round = 3
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
		engine.powerOn(conf)
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
 * 1. 和局幾率9.5%
 * 2. 莊家贏比閒家贏略高
 */
