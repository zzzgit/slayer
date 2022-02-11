
// eslint-disable-next-line node/no-extraneous-import
import {Engine, HandResult, HandOutcome} from "bac-motor"
import CliTable from "../report/Table"
import util from "../tool/util"

const engine = new Engine()
const shoeAmount = 5000
const round = 3
const table = new CliTable({
	head: ['total', 'two', 'three'],
	colWidths: [20, 20, 20],
	style: {"compact": false, 'padding-left': 1},
})

const result = {
	two: 0,
	three: 0,
}


const testCase = {
	init() {
		engine.powerOn()
	},
	work() {
		result.two = 0
		result.three = 0
		for (let i = 0; i < shoeAmount; i++) {
			engine.playOneShoe(undefined, (handResult: HandOutcome)=>{
				if (handResult.result == HandResult.PlayerWins) {
					if (handResult.playerHand.getDuplicatedCardArray().length === 2) {
						result.two++
					} else {
						result.three++
					}
				}
			})
		}
		const total = result.two + result.three
		table.push([`${total}`, `${result.two} / ${util.percentize(result.two / total)}%`,
			`${result.three} / ${util.percentize(result.three / total)}%`])
	},
	run() {
		for (let i = 0; i < round; i++) {
			this.work()
		}
		engine.shutdown()
	},
	report() {
		table.print(`閒贏，牌的張數：`)
	},
}

testCase.init()
testCase.run()
testCase.report()


/**
 * 結論：
 * 1. 閒家贏，多以兩張牌取勝，比三張牌的機會多13percent
 * 2. 莊閒對比，推論：牌越多，越利於開閒
 */
