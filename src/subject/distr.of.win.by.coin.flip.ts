import {Engine, HandOutcome, HandResult} from "bac-motor"
import CliTable from "../report/Table"
import util from "../tool/util"
import CounterMap from "./collection/CounterMap"
import samael from "samael"


const engine = new Engine()
const shoeAmount = 40000
let losingStreakLength = 0

const tableDistribution = new CliTable({
	head: ['total', 'win', 'loss'],
	colWidths: [20, 20, 20],
	style: {"compact": false, 'padding-left': 1},
})
const length = 6
const tableStrek = new CliTable({
	head: ['8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
	colWidths: [length, length, length, length, length, length, length, length, length, length, length, length, length],
	style: {"compact": false, 'padding-left': 1},
})

let result = {
	win: 0,
	loss: 0,
	losingStreak: new CounterMap<number>(),
}

const testCase = {
	init() {
		engine.powerOn()
	},
	run() {
		result = {
			win: 0,
			loss: 0,
			losingStreak: new CounterMap<number>(),
		}
		for (let i = 0; i < shoeAmount; i++) {
			engine.playOneShoe(undefined, (handResult: HandOutcome)=>{
				const expectWinner = samael.flipCoin() ? HandResult.PuntoWins : HandResult.BancoWins
				if (handResult.result == HandResult.Tie) {
					return undefined
				}
				if (handResult.result == expectWinner) {
					result.loss++
					losingStreakLength++
				} else {
					result.win++
					result.losingStreak.count(losingStreakLength)
					losingStreakLength = 0
				}
				return undefined
			})
		}
		const totalBet: number = result.win + result.loss
		tableDistribution.push([totalBet + " hand", result.win, result.loss],
			[100 + "%", util.percentize(result.win / totalBet) + "%", util.percentize(result.loss / totalBet) + "%"])

		const map = result.losingStreak
		const arr = []
		for (let i = 8; i < 21; i++) {
			arr.push(map.get(i) || 0)
		}
		tableStrek.push(arr)
		engine.shutdown()
	},
	report() {
		tableDistribution.print(`拋硬幣輸贏分佈：`)
		tableStrek.print(`拋硬幣連輸：`)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 如果莊家不抽水，很難把錢輸光
 * 2. 連輸很嚴重，長纜不可取
 */
