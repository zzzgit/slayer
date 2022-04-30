import CliTable from "../report/Table"
import util from "../tool/util"
import tool from "../tool/tool"
import massiveTestConfig from "../config/massiveTestConfig"
import Engine, {HandOutcome, HandResult} from "bac-motor"

const engine = new Engine()
const shoeAmount = 6000
// let bscore = 0
let pscore = 0
let lastScore = 0
let drawCards = 0

const tableDistribution = new CliTable({
	head: ['bet/result', 'win', 'loss', 'tie'],
	colWidths: [15, 15, 15, 15],
	style: {"compact": false, 'padding-left': 1},
})


let result = {
	total: 0,
	banker: {
		win: 0,
		lose: 0,
		tie: 0,
	},
	player: {
		win: 0,
		lose: 0,
		tie: 0,
	},
}


const testCase = {
	init() {
		const config = Object.assign({}, massiveTestConfig, {shouldGenerateRoad: false, shouldCutShoe: true})
		engine.powerOn(config)
	},
	run() {
		result = {
			total: 0,
			banker: {
				win: 0,
				lose: 0,
				tie: 0,
			},
			player: {
				win: 0,
				lose: 0,
				tie: 0,
			},
		}
		for (let i = 0; i < shoeAmount; i++) {
			const afterPlay = (hOutcome: HandOutcome): void => {
				const actualScore = pscore / ((416 - drawCards) / 416)
				// console.log(drawCards)
				if (actualScore > 100) {
					if (lastScore > 500) {
						result.total++
						if (hOutcome.result === HandResult.BancoWins) {
							result.banker.win++
						} else if (hOutcome.result === HandResult.PuntoWins) {
							result.banker.lose++
						} else {
							result.banker.tie++
						}
					}
				}
				if (actualScore > 1235) {
					result.total++
					if (hOutcome.result === HandResult.BancoWins) {
						result.player.lose++
					} else if (hOutcome.result === HandResult.PuntoWins) {
						result.player.win++
					} else {
						result.player.tie++
					}
				}
				// bscore += tool.countBankerScore(hOutcome)
				pscore += tool.countPlayerScore(hOutcome)
				lastScore = pscore
				drawCards += [...hOutcome.bancoHand.getDuplicatedCardArray(), ...hOutcome.puntoHand.getDuplicatedCardArray()].length
				// console.log(bscore, pscore, drawCards)
			}
			engine.playOneShoe(undefined, afterPlay)
		}
		const pResult = result.player
		const bResult = result.banker
		tableDistribution.push(
			["bet on B", bResult.win, bResult.lose, bResult.tie],
			["bet on P", pResult.win, pResult.lose, pResult.tie],
			["total", pResult.win + bResult.win, pResult.lose + bResult.lose, pResult.tie + bResult.tie],

		)
		// [100 + "%", util.percentize(result.bankerTimes / totalHands) + "%", util.percentize(result.playerTimes / totalHands) + "%", util.percentize(result.tieTiems / totalHands) + "%"],
		// ["scor/hand", (result.bankerScore / result.bankerTimes).toFixed(2), (result.playerScore / result.playerTimes).toFixed(2), (result.tieScore / result.tieTiems).toFixed(2)])

		engine.shutdown()
	},
	report() {
		tableDistribution.print(`三千靴牌，大小牌算牌法，輸贏：`)
		// 百家樂理論值：1.02767525608，想要贏錢：1.05254515599
		console.log("買莊， W/L:", util.percentize(result.banker.win / result.banker.lose, 2))
		console.log("買閒， W/L:", util.percentize(result.player.win / result.player.lose, 2))
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1.
 * 2.
 */
