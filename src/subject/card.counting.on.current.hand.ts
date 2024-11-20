import CliTable from '../report/Table'
import util from '../tool/util'
import tool from '../tool/tool'
import massiveTestConfig from '../config/massiveTestConfig'
import Engine, { HandOutcome, HandResult } from 'bac-motor'

const engine = new Engine()
const shoeAmount = 10000

const tableDistribution = new CliTable({
	head: ['bet/result', 'win', 'loss', 'tie'],
	colWidths: [15, 15, 15, 15],
	style: { compact: false, 'padding-left': 1 },
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
		const afterPlay = (handResult: HandOutcome): void=> {
			const banco_cards = handResult.bancoHand.getLength()
			const punto_cards = handResult.puntoHand.getLength()
			const total_cards = banco_cards + punto_cards
			// 四張牌不論
			if (total_cards === 4){
				return undefined
			}
			const shouldBetonBanco = total_cards === 5 && banco_cards === 2
			const pointValue = tool.countHandScore(handResult)
			/**
			 * 3200好像是最優值，對於莊來說，4200和2200，都會讓命中率降低
			 */
			if (shouldBetonBanco && pointValue > 2500){
				// 2500..3000c  注意，在結合牌的張數的策略時，2500導致勝率大大降低
				if (handResult.result == HandResult.BancoWins){
					result.banker.win++
				} else if (handResult.result == HandResult.PuntoWins){
					result.banker.lose++
				} else {
					result.banker.tie++
				}
			}
			if (!shouldBetonBanco && pointValue < -2500){
				if (handResult.result == HandResult.BancoWins){
					result.player.lose++
				} else if (handResult.result == HandResult.PuntoWins){
					result.player.win++
				} else {
					result.player.tie++
				}
			}
		}
		for (let i = 0; i < shoeAmount; i++){
			engine.playOneShoe(undefined, afterPlay)
		}
		const bResult = result.banker
		const pResult = result.player
		const bTotal = result.banker.win + result.banker.lose + result.banker.tie
		const pTotal = result.player.win + result.player.lose + result.player.tie
		tableDistribution.push(['bet on B', bResult.win, bResult.lose, bResult.tie], [
			'bet on B-%',
			util.percentize(bResult.win / bTotal),
			util.percentize(bResult.lose / bTotal),
			util.percentize(bResult.tie / bTotal),
		], ['bet on P', pResult.win, pResult.lose, pResult.tie], [
			'bet on P-%',
			util.percentize(pResult.win / pTotal),
			util.percentize(pResult.lose / pTotal),
			util.percentize(pResult.tie / pTotal),
		], [
			'total',
			pResult.win + bResult.win,
			pResult.lose + bResult.lose,
			pResult.tie + bResult.tie,
		])
		// ["total", util.percentize(pResult.win / pTotal), util.percentize(pResult.lose / pTotal), util.percentize(pResult.tie / pTotal)],
		engine.shutdown()
	},
	report(){
		tableDistribution.print('六千靴牌，大小牌算牌法，輸贏：')
		// 百家樂理論值：1.02767525608，想要贏錢：1.05254515599
		let cal = util.getOddCal(result.banker.win, result.banker.lose, 3, true)
		console.log('買莊， W/L:', util.percentize(cal.getw2l(), 2))
		cal = util.getOddCal(result.player.lose, result.player.win, 3, false)
		console.log('買閒， W/L:', util.percentize(cal.getw2l(), 2))
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 0. 只考慮點數score（閥值在3000處最優）:
 * 1. 莊家，最優值120，閒家，最優值135，看上去都有利可圖。莊家除掉佣金，還能賺0.05以上
 * 2. 莊家的優勢，沒法再優化，儘管調高閥值(試試另外一套算法，參看源代碼)
 *
 * 3: 兩種策略並行thorp and WDCC:
 * 4: 能下注的機會不多（一shoe只能下註0.8次，必須要把第一個策略的閥值調整到25000），莊家w2l 370（天花板效應），閒家w2l 220（有提升，藉助BAC的優勢？）
 */
