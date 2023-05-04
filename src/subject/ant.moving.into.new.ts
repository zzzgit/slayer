import {Engine, HandOutcome, Bet, FreeMun as Free, BancoMun as Banker, PuntoMun as Player} from "bac-motor"
import HandOutcomeOrUndefined from "../model/strategy/type/HandOutcomeOrUndefined"
import BetOrUndefined from "../model/strategy/type/BetOrUndefined"
import AntBetProgression from "./strategy/AntBetProgression"
import AntStrategy from "./strategy/AntStrategy"
import CliTable from "../report/Table"
import * as samael from "samael"

const engine = new Engine()
const shoeAmount = 2000
const capital = 1000
let balance = capital
const profitGoal = 1000
const stopLoss = 10
let round = 0


const tableDistribution = new CliTable({
	head: ['round/statistics', 'bet money', 'betting times', 'commision', 'balance'],
	colWidths: [15, 15, 15, 15, 15],
	style: {"compact": false, 'padding-left': 1},
})


const result = {
	bettingTimes: 0,
	betMoney: 0,
	commision: 0,
}

const takeChance = (isBanco: boolean): boolean=>{
	if (isBanco) {
		// 理論0.5068，breakeven 100/195，當前加到0.52
		return samael.chance(2676, 100000)
	}
	// 理論0.493，breakeven 0.5，當前加到0.51  x/
	return samael.chance(333, 10000)
}

const testCase = {
	init() {
		engine.powerOn()
	},
	run() {
		for (let i = 0; i < shoeAmount; i++) {
			let isFree = false
			const seq = new AntBetProgression()
			const system = new AntStrategy(seq)
			let bet: Bet
			const beforePlay = (prevBet: BetOrUndefined, prevComeout: HandOutcomeOrUndefined): Bet => {
				// / https://github.com/zzzgit/bac-motor/blob/7cbe9b35a4f0e32515dc58c6c364b514d60f215c/src/Engine.ts#L123
				// 上面一行被comment, 所以prevBet永遠為空
				system.setBalance(balance)
				bet = system.figureOutBet(prevBet, prevComeout as HandOutcome)
				isFree = bet.getMun() instanceof Free ? true : false
				if (!isFree) {
					const wager = bet.getWager()
					balance = balance - wager
					result.bettingTimes++
					result.betMoney += wager
				}
				return bet
			}
			const afterPlay = (handResult: HandOutcome): void => {
				if (isFree) {
					return undefined
				}
				handResult
				let payout = handResult.getPayout()
				// 輸了，增加勝率-------------------------
				if (payout === 0) {
					if (bet.getMun() instanceof Banker) {
						if (takeChance(true)) {
							payout = handResult.getWager() * 1.95
						}
					}
					if (bet.getMun() instanceof Player) {
						if (takeChance(false)) {
							payout = handResult.getWager() * 2
						}
					}
				}
				balance = balance + payout
				if (bet.getMun() instanceof Banker) {
					// if (handResult.tagArray.find(item => item instanceof SuperSix)) {
					result.commision += handResult.getWager() * .05
					// }
				}
				// console.log(`${handResult.getWager()}\t${payout}\t${balance}`)
				if (balance >= capital + profitGoal) {
					tableDistribution.push([++round, result.betMoney, result.bettingTimes, result.commision, balance])
					balance = capital
					result.betMoney = 0
					result.bettingTimes = 0
					result.commision = 0
					if (round == 4) {
						engine.shutdown()
					}
				} else if (balance < stopLoss) {
					engine.shutdown()
					console.log(`輸光了！第${handResult.getShoeIndex()}shoe`, balance)
				}
			}
			try {
				engine.playOneShoe(beforePlay, afterPlay)
			} catch (e) {
				console.log(222, 333)
				break
			}
		}
		engine.shutdown()
	},
	report() {
		tableDistribution.print(`20 shoes，螞蟻🐜搬家打法：`)
		// console.log(`balance: ${balance }`)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 返傭，讓莊閒的rv都為0
 * 2. 返傭，讓莊閒的rv都為0.01，有機會賺錢
 * 3. 註碼法並不重要，重要的是rv，和止盈點
 * 4. 另類測試，反轉輸贏，因為改代碼麻煩，沒有進行
 */
