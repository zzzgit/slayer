import {Heart, NumberCard, FaceCard, Card, AceCard} from "cardation"
import {Engine, Config, HandOutcome} from "bac-motor"
import CliTable from "../report/Table"
import util from "../tool/util"

const engine = new Engine()
const shoeAmount = 1
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

const creatCard = (score:number): Card=>{
	if (score == 1) {
		return new AceCard(new Heart())
	}
	if (score == 0) {
		return new FaceCard(new Heart(), 11, 0)
	}
	return new NumberCard(new Heart(), score)
}

const getResult = (handResult: HandOutcome): number[]=>{
	const banco = handResult.bankerHand
	const punto = handResult.playerHand
	const bancoScore = banco.getScore()
	const puntoScore = punto.getScore()
	const result = [bancoScore, puntoScore, -1]
	banco.getDuplicatedCardArray().forEach((ele) => {
		result.push(ele.getCardScore())
	})
	result.push(-1)
	punto.getDuplicatedCardArray().forEach((ele) => {
		result.push(ele.getCardScore())
	})
	return result
}

const testCase = {
	init() {
		const cards:Card[] = []
		cards.push(new AceCard(new Heart(), 1))

		const pie = "314157926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679"
		for (const element of pie) {
			cards.push(creatCard(+element))
		}
		const eip = [...pie].reverse()
			.join('')
		for (const element of eip) {
			cards.push(creatCard(+element))
		}

		const config:Config = {
			customizedShoe: cards,
			shouldCutShoe: false,
			shouldUseBlackCard: false,
			shouldShuffle: false,
			shouldShuffleWhileCollectBankerHand: false,
		}
		engine.powerOn(config)
	},
	work() {
		result.tie = 0
		result.banker = 0
		result.player = 0
		for (let i = 0; i < shoeAmount; i++) {
			const shoeComeout = engine.playOneShoe(undefined, (handResult: HandOutcome): void => {
				// getResult(handResult)
				const kkkk = getResult(handResult)
				let str = ""
				kkkk.forEach((ele)=>{
					if (ele == -1) {
						str += "\t"
					} else {
						str += ele
					}
				})
				console.log(str)
			})

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
