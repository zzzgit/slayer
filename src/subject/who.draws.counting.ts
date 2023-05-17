import CliTable from "../report/Table"
import util from "../tool/util"
import massiveTestConfig from "../config/massiveTestConfig"
import Engine, {HandOutcome, HandResult} from "bac-motor"

const engine = new Engine()
const shoeAmount = 6000
const isBetOnBanco = true

const tableDistribution = new CliTable({
	head: ['bet/result', 'win', 'loss', 'tie'],
	colWidths: [15, 15, 15, 15],
	style: {"compact": false, 'padding-left': 1},
})


let result = {
	total: 0,
	counter: {
		bancowins: 0,
		puntowins: 0,
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
			counter: {
				bancowins: 0,
				puntowins: 0,
				tie: 0,
			},
		}
		const afterPlay = (handResult: HandOutcome): void => {
			const banco_cards = handResult.bancoHand.getLength()
			const punto_cards = handResult.puntoHand.getLength()
			const testScheme = 5
			if (banco_cards + punto_cards == testScheme) {
				if (banco_cards == 2) {
					if (handResult.result == HandResult.BancoWins) {
						result.counter.bancowins++
					} else if (handResult.result == HandResult.PuntoWins) {
						result.counter.puntowins++
					} else {
						result.counter.tie++
					}
				}
			}
		}
		for (let i = 0; i < shoeAmount; i++) {
			engine.playOneShoe(undefined, afterPlay)
		}
		const {counter} = result
		result.total = result.counter.bancowins + result.counter.puntowins + result.counter.tie
		const {total} = result
		tableDistribution.push(
			["bet times", counter.bancowins, counter.puntowins, counter.tie],
			["bet perct", util.percentize(counter.bancowins / total), util.percentize(counter.puntowins / total), util.percentize(counter.tie / total)],

		)

		engine.shutdown()
	},
	report() {
		tableDistribution.print(`六千靴牌，大小牌算牌法，輸贏：`)
		const count = result.counter
		const cal = util.getOddCal(count.bancowins, count.puntowins, count.tie, isBetOnBanco)
		console.log(`W/L:			${ cal.getw2l() }`)
		console.log(`EV(已減佣金)算和:	${ cal.getReward(true) }`)
		console.log(`EV(已減佣金)不算:	${ cal.getReward(false) }`)
		// -0.01235 -0.0136
		// -0.0106 -0.0117
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 四張牌，閒家的EV在-0.5% to 0.5%之間徘徊，沒有優勢，買莊抽水，絕對輸錢
 * 2. 六張牌，買閒W/L: 119，EV: 0.085（不算和）,0.076(算上和)
 * 3. 五張牌，買莊勝率W/L高達130到131。EV高達0.105以上（不算和），0.095以上（算和），
 * 3.1 莊3閒2，W/L高達380，買閒的ev：0.58（不算和），0.54 (算上和)
 * 3.2 莊2閒3，W/L高達將近400。買莊的ev： 0.55（不算和）， 0.50(算上和)
 * 3.3 閒家補牌，買莊，這種情況雖然勝率更高，但是扣除佣金，EV反而低
 *
 *
 */

