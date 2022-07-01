/* eslint-disable no-constant-condition */
import CliTable from "../report/Table"
import util from "../tool/util"
import tool from "../tool/tool"
import massiveTestConfig from "../config/massiveTestConfig"
import Engine, {HandOutcome, HandResult} from "bac-motor"
import {LosingEntity, Road, WinningEntity} from "@zzznpm/orphan"

const engine = new Engine()
const shoeAmount = 9000
// Road 改名
const road = new Road()
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
	tie: {
		banker: 0,
		player: 0,
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
			tie: {
				banker: 0,
				player: 0,
			},
		}
		const afterPlay = (hOutcome: HandOutcome): void => {
			const actualScore = pscore / ((416 - drawCards_int) / 416)
			if (actualScore > 30000) {		// 30000，相當於每10手打一手，2000，相當於沒5手打一手
				if (true || lastHandScore > 2200) {
					result.total++
					if (hOutcome.result === HandResult.BancoWins) {
						road.addEntity(new WinningEntity(true))
					} else if (hOutcome.result === HandResult.PuntoWins) {
						road.addEntity(new LosingEntity(true))
					} else {
						result.tie.banker++
					}
				}
			}
			if (actualScore < -30000) {
				if (true || lastHandScore < -2200) {
					result.total++
					if (hOutcome.result === HandResult.BancoWins) {
						road.addEntity(new LosingEntity(false))
					} else if (hOutcome.result === HandResult.PuntoWins) {
						road.addEntity(new WinningEntity(false))
					} else {
						result.tie.player++
					}
				}
			}
			lastHandScore = tool.countPlayerScore(hOutcome)
			// bscore += lastHandScore
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

		const {bet} = road.getOutcome()
		tableDistribution.push(
			["bet on B", bet.banco.win, bet.banco.lose, result.tie.banker],
			["bet on P", bet.punto.win, bet.punto.lose, result.tie.player],
			["total", bet.banco.win + bet.punto.win, bet.banco.lose + bet.punto.lose, result.tie.banker + result.tie.player],
		)
		// [100 + "%", util.percentize(result.bankerTimes / totalHands) + "%", util.percentize(result.playerTimes / totalHands) + "%", util.percentize(result.tieTiems / totalHands) + "%"],
		// ["scor/hand", (result.bankerScore / result.bankerTimes).toFixed(2), (result.playerScore / result.playerTimes).toFixed(2), (result.tieScore / result.tieTiems).toFixed(2)])
		engine.shutdown()
	},
	report() {
		const info = road.getOutcome()
		tableDistribution.print(`三千靴牌，大小牌算牌法，輸贏：`)
		console.log("買莊， W/L:", util.percentize(info.bet.banco.win / info.bet.banco.lose, 2))
		console.log("買閒， W/L:", util.percentize(info.bet.punto.win / info.bet.punto.lose, 2))
		console.log(info.statistics)
		console.log(info.bet)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 不穩定，即使，同時限定2個條件：總的分數，上一手的分數
 * 2. 第三個條件，只在shoe的末尾下注，基本上沒有影響，無需考慮
 * 3. 由於不穩定，所以可以肯定，算牌無效
 * 4. 還未加入燒牌的計算(只有一張明牌，作用有限)
 */
