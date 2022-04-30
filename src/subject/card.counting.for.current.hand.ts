import CliTable from "../report/Table"
import util from "../tool/util"
import tool from "../tool/tool"
import massiveTestConfig from "../config/massiveTestConfig"
import Engine, {HandOutcome, HandResult} from "bac-motor"

const engine = new Engine()
const shoeAmount = 6000

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
			const afterPlay = (handResult: HandOutcome): void => {
				const pointValue = tool.countBankerScore(handResult)
				if (pointValue > 3200) { // 2500..3000c
					if (handResult.result == HandResult.BancoWins) {
						result.banker.win++
					} else if (handResult.result == HandResult.PuntoWins) {
						result.banker.lose++
					} else {
						result.banker.tie++
					}
				}
				if (pointValue < -3200) {
					if (handResult.result == HandResult.BancoWins) {
						result.player.lose++
					} else if (handResult.result == HandResult.PuntoWins) {
						result.player.win++
					} else {
						result.player.tie++
					}
				}
			}
			engine.playOneShoe(undefined, afterPlay)
		}
		const pResult = result.player
		const bResult = result.banker
		tableDistribution.push(
			["bet on P", pResult.win, pResult.lose, pResult.tie],
			["bet on B", bResult.win, bResult.lose, bResult.tie],
			["total", pResult.win + bResult.win, pResult.lose + bResult.lose, pResult.tie + bResult.tie],

		)

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
 * 1. 莊家，最優值1.15，閒家，最優值1.35，看上去都有利可圖，莊家除掉佣金，還能賺0.05以上
 * 2. 莊家的優勢，沒法再優化，儘管調高閥值
 */

