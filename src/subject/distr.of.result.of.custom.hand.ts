import {Engine, Config, HandOutcome} from "bac-motor"
import {Card} from "cardation"
import CliTable from "../report/Table"
import util from "../tool/util"
import CardMagazine from "./cardMagazine/CardMagazine"

const engine = new Engine()
const shoeAmount = 1000
let cardsAmount = 0
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

const getResult = (handResult: HandOutcome): number[]=>{
	const banco = handResult.bancoHand
	const punto = handResult.puntoHand
	const bancoScore = banco.getPoint()
	const puntoScore = punto.getPoint()
	const result = [bancoScore, puntoScore, -1]
	banco.getDuplicatedCardArray().forEach((ele) => {
		result.push(ele.getPoint())
	})
	result.push(-1)
	punto.getDuplicatedCardArray().forEach((ele) => {
		result.push(ele.getPoint())
	})
	return result
}

const testCase = {
	init() {
		const cards: Card[] = CardMagazine.getCards66666667777777()
		cardsAmount = cards.length
		const config:Config = {
			customizedShoe: cards,
			shouldCutShoe: false,
			shouldUseBlackCard: false,
			shouldShuffle: true,
			shouldShuffleWhileCollectBancoHand: false,
		}
		engine.powerOn(config)
	},
	work() {
		result.tie = 0
		result.banker = 0
		result.player = 0
		const afterPlay = (handResult: HandOutcome): void => {
			const detail = getResult(handResult)
			let str = ""
			detail.forEach((ele) => {
				if (ele == -1) {
					str += "\t"
				} else {
					str += ele
				}
			})
			console.log(str)
		}
		console.log(!!afterPlay)
		for (let i = 0; i < shoeAmount; i++) {
			const shoeComeout = engine.playOneShoe(undefined, undefined)
			const info = shoeComeout.getStatisticInfo()
			result.banker = result.banker + info.banco
			result.player = result.player + info.punto
			result.tie = result.tie + info.tie
		}

		const totalResult: number = result.tie + result.banker + result.player
		table.push([totalResult, result.banker, result.player, result.tie], [`100 %`, util.percentize(result.banker / totalResult) + " %", util.percentize(result.player / totalResult) + " %", util.percentize(result.tie / totalResult) + " %"])
		// table.push([100, util.percentize(result.banker / totalResult), util.percentize(result.punto / totalResult), util.percentize(result.tie / totalResult)])
	},
	run() {
		for (let i = 0; i < round; i++) {
			this.work()
		}
		engine.shutdown()
	},
	report() {
		console.log(`cards in shoe: ${cardsAmount}`)
		table.print(`莊閒分佈：`)
	},
}


testCase.init()
testCase.run()
testCase.report()


/**
 * 1.
 * 2.
 */
