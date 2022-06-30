/* eslint-disable no-constant-condition */
import CliTable from "../report/Table"
import util from "../tool/util"
import tool from "../tool/tool"
import massiveTestConfig from "../config/massiveTestConfig"
import Engine, {HandOutcome, HandResult} from "bac-motor"

const engine = new Engine()
const shoeAmount = 9000
// let bscore = 0
let pscore = 0
let lastHandScore = 0
let drawCards_int = 0

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
		const afterPlay = (hOutcome: HandOutcome): void => {
			const actualScore = pscore / ((416 - drawCards_int) / 416)
			if (actualScore > 20000) {	// 30000，相當於每10手打一手，2000，相當於沒5手打一手
				if (true || lastHandScore > 2200) {
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
			if (actualScore < -20000) {
				if (true || lastHandScore < -2200) {
					result.total++
					if (hOutcome.result === HandResult.BancoWins) {
						result.player.lose++
					} else if (hOutcome.result === HandResult.PuntoWins) {
						result.player.win++
					} else {
						result.player.tie++
					}
				}
			}
			lastHandScore = tool.countPlayerScore(hOutcome)
			// bscore +=lastScore
			pscore += lastHandScore
			drawCards_int += [...hOutcome.bancoHand.getDuplicatedCardArray(), ...hOutcome.puntoHand.getDuplicatedCardArray()].length
			// console.log(bscore, pscore, drawCards)
		}
		for (let i = 0; i < shoeAmount; i++) {
			engine.playOneShoe(undefined, afterPlay)
			pscore = 0
			lastHandScore = 0
			drawCards_int = 0
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
		console.log("買莊， W/L:", util.percentize(result.banker.win / result.banker.lose, 2))
		console.log("買閒， W/L:", util.percentize(result.player.win / result.player.lose, 2))
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 不穩定，即使，同時限定2個條件：總的分數，上一手的分數
 * 2. 第三個條件，只在shoe的末尾下注，基本上沒有影響，無需考慮
 * 3. 由於不穩定，所以可以肯定，算牌無效
 * 4. 還未加入燒牌的計算
 */
