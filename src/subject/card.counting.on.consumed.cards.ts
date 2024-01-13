/* eslint-disable no-constant-condition */
import { LosingEntity, Blackhole, WinningEntity } from '@zzznpm/orphan'
import massiveTestConfig from '../config/massiveTestConfig'
import Engine, { HandOutcome, HandResult } from 'bac-motor'
import CliTable from '../report/Table'
import tool from '../tool/tool'
import { Card } from 'cardation'

const engine = new Engine()
const shoeAmount = 6000
const road = new Blackhole()
let longAccumulatedScore = 0
let lastHandScore = 0
let shorAccumulatedScore = 0
let drawCards_int = 0

const tableDistribution = new CliTable({
	head: ['bet/result', 'win', 'loss', 'tie'],
	colWidths: [15, 15, 15, 15],
	style: { compact: false, 'padding-left': 1 },
})

let result = {
	total: 0,
	tie: {
		banker: 0,
		player: 0,
	},
	distr: {
		banco: 0,
		punto: 0,
		tie: 0,
	},
}

const testCase = {
	init(){
		const config = Object.assign({}, massiveTestConfig, {
			shouldGenerateRoad: false,
			shouldCutShoe: true,
		})
		engine.powerOn(config)
	},
	run(){
		result = {
			total: 0,
			tie: {
				banker: 0,
				player: 0,
			},
			distr: {
				banco: 0,
				punto: 0,
				tie: 0,
			},
		}
		const afterPlay = (hOutcome: HandOutcome): void => {
			const longWeightedScore =
				longAccumulatedScore / ((416 - drawCards_int) / 416)
			const threshold_for_short = 3500
			if (longWeightedScore > 25000){
				// 30000，相當於每10手打一手，2000，相當於每5手打一手
				if (shorAccumulatedScore > threshold_for_short){
					result.total++
					if (hOutcome.result === HandResult.BancoWins){
						road.addEntity(new WinningEntity(true))
					} else if (hOutcome.result === HandResult.PuntoWins){
						road.addEntity(new LosingEntity(true))
					} else {
						result.tie.banker++
					}
				}
			}
			if (longWeightedScore < -30000){
				if (lastHandScore < -threshold_for_short){
					// result.total++
					if (hOutcome.result === HandResult.BancoWins){
						// road.addEntity(new LosingEntity(false))
					} else if (hOutcome.result === HandResult.PuntoWins){
						// road.addEntity(new WinningEntity(false))
					} else {
						result.tie.player++
					}
				}
			}
			lastHandScore = tool.countHandScore(hOutcome)
			shorAccumulatedScore = tool.countHandScore(hOutcome, true)
			longAccumulatedScore += lastHandScore
			drawCards_int +=
				hOutcome.bancoHand.getLength() + hOutcome.puntoHand.getLength()
		}
		const beforeShoe = (card: Card | undefined): void => {
			card?.getPoint()
			lastHandScore = 448
			longAccumulatedScore += lastHandScore
			drawCards_int = 1
		}
		for (let i = 0; i < shoeAmount; i++){
			const shoeOutcome = engine.playOneShoe(undefined, afterPlay, beforeShoe)
			const statistics = shoeOutcome.getStatisticInfo()
			result.distr.banco += statistics.banco
			result.distr.punto += statistics.punto
			result.distr.tie += statistics.tie
		}

		const { distr } = result
		tableDistribution.push(
			['distro', distr.banco, distr.punto, distr.tie]
			// ["bet on P", bet.punto.win, bet.punto.lose, result.tie.player],
		)

		engine.shutdown()
	},
	report(){
		const info = road.getOutcome(false)
		tableDistribution.print('三千靴牌，大小牌算牌法，輸贏：')

		console.log(info.statistics)
		console.log(info.bet)
		// console.log(info.strategy)

		const { distr } = result
		const pRate = (distr.banco / distr.punto) * 100
		const bRate = (distr.punto / distr.banco) * 100
		console.log('B/P:', pRate.toFixed(4))
		console.log('P/B:', bRate.toFixed(4))
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. sample不夠大，結果就不穩定，最少需要50000shoe
 * 2. 莊的策略，相對於宏觀數據的優勢，比較穩定。閒，不穩定，幾乎沒有作用
 * 2.5 穩定性，相對於波動性，還是太小，波動可以遠遠超出穩定性
 * 2.6 莊比較穩定，可能是因為大小牌的比例，5:8
 * 3. 莊的策略，對於玩家，依然沒有edge
 * 4. 還未加入燒牌的計算(只有一張明牌，作用有限)
 * 5.
 * 6.
 * 7. 根據遊戲規則，莊的概率0.458597(計算和)，0.5068(不計算和)
 * 8. 要想持平，莊家概率需要達到0.464(計算和)，0.51282(不計算和)
 * 9. 根據遊戲規則：全部買莊w2l為：1.027675，全部買閒w2l為0.973
 * 10.   想要持平：全部買莊w2l為：1.0526，  全部買閒w2l為1.0
 *
 * 11. 用盡各種辦法，數據不穩定，也就是說，沒有穩定的結果
 */
