// import {Hand} from "cardation"
// import util from "../tool/util"
// import {Engine, HandOutcome, HandResult} from "baccarat-engine"
// import CliTable from "../report/Table"

// const engine = new Engine()
// const shoeAmount = 40000
// const round = 1

// let losingStreak = 0
// const table = new CliTable({
// 	head: ['total', 'win', 'loss'],
// 	colWidths: [20, 20, 20],
// 	style: {"compact": false, 'padding-left': 1},
// })
// const tableSteak = new CliTable({
// 	head: ['7', '8', '9', '10', '11', '12', '13', '14', '15'],
// 	colWidths: [8, 8, 8, 8, 8, 8, 8, 8, 8],
// 	style: {"compact": false, 'padding-left': 1},
// })

// const result:{[key: string]:any} = {
// 	win: 0,
// 	loss: 0,
// 	arrlosingStreak: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// }


// const testCase = {
// 	init() {
// 		engine.powerOn()
// 	},
// 	// index是珠盤路的，並非大路
// 	_checkbbbpPattern(hcomeout: HandOutcome): boolean {
// 		if (hcomeout.handIndex % 4 !== 3) {
// 			return false
// 		}
// 		if (hcomeout.result != HandResult.BankerWins) {
// 			return false
// 		}
// 		let redBead = 1
// 		let prev = hcomeout.getPreviousHandComeout()
// 		while (prev && prev.result != HandResult.PlayerWins && redBead < 3) {
// 			if (prev.result != HandResult.Tie) {
// 				redBead++
// 			}
// 			prev = prev.getPreviousHandComeout()
// 		}
// 		return redBead === 3
// 	},
// 	work() {
// 		result.win = 0
// 		result.loss = 0
// 		result.arrlosingStreak = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 		for (let i = 0; i < shoeAmount; i++) {
// 			// 改用四珠路
// 			engine.prepareShoe()
// 			let handResult: HandOutcome
// 			do {
// 				const prev = engine.getPreviousHandComeout()
// 				if (!prev) {
// 					engine.playOneHand()
// 					continue
// 				}
// 				const tempHand = Hand.from(...[prev.bankerHand, prev.playerHand])
// 				const score = util.countScore(tempHand.getCardArray())
// 				if (score > -2) {
// 					// engine.playOneHand()
// 					// continue
// 				}
// 				const shouldBetOnP = this._checkbbbpPattern(prev)
// 				handResult = engine.playOneHand()
// 				if (shouldBetOnP) {
// 					if (handResult.result == HandResult.PlayerWins) {
// 						result.win++
// 						result.arrlosingStreak[losingStreak] = result.arrlosingStreak[losingStreak] + 1
// 						losingStreak = 0
// 					}
// 					if (handResult.result == HandResult.BankerWins) {
// 						result.loss++
// 						losingStreak++
// 					}
// 				}
// 			} while (!engine.isShoeExhausted)
// 			engine.recycleCardToShoe()
// 		}
// 		const totalResult: number = result.win + result.loss
// 		table.push([totalResult, result.win, result.loss],
// 			[`100 %`, util.percentize(result.win / totalResult) + " %", util.percentize(result.loss / totalResult) + " %"])
// 		const arr = result.arrlosingStreak
// 		tableSteak.push([arr[7], arr[8], arr[9], arr[10], arr[11], arr[12], arr[13], arr[14], arr[15]])
// 	},
// 	run() {
// 		for (let i = 0; i < round; i++) {
// 			this.work()
// 		}
// 		engine.shutdown()
// 	},
// 	report() {
// 		table.print(`BBBP pattern 輸贏：`)
// 		tableSteak.print(`BBBP pattern 連輸：`)
// 	},
// }

// testCase.init()
// testCase.run()
// testCase.report()


// /**
//  * 1. 連輸，導致以大博小的利潤全部輸掉
//  * 2. 投注機會少，一靴牌只有兩次投注機會
//  */
