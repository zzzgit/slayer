import {
	Engine,
	HandOutcome,
	Bet,
	FreeMun as Free,
	BancoMun as Banker,
} from "bac-motor"
import HandOutcomeOrUndefined from "../model/strategy/type/HandOutcomeOrUndefined"
import BetOrUndefined from "../model/strategy/type/BetOrUndefined"
import AntBetProgression from "./strategy/AntBetProgression"
import AntStrategy from "./strategy/AntStrategy"
import CliTable from "../report/Table"

const engine = new Engine()
const shoeAmount = 8000
const capital = 10000
let balance = capital
const profitGoal = 40
const stopLoss = 50
let currentRound = 0
const targetRound = 40

const tableDistribution = new CliTable({
	head: [
		"round/statistics",
		"bet money",
		"betting times",
		"commision",
		"balance",
	],
	colWidths: [15, 15, 15, 15, 15],
	style: {compact: false, "padding-left": 1},
})

const result = {
	bettingTimes: 0,
	betMoney: 0,
	commision: 0,
}

// 專門增加，用來為輸的情況，把一定比例的game變成贏
// const takeChance = (isBanco: boolean): boolean => {
// 	if (isBanco) {
// 		// 理論0.5068，breakeven 100/195，當前加到0.52
// 		return samael.chance(2676, 100000)
// 	}
// 	// 理論0.493，breakeven 0.5，當前加到0.51  x/
// 	return samael.chance(333, 10000)
// }

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
			const beforePlay = (
				prevBet: BetOrUndefined,
				prevComeout: HandOutcomeOrUndefined
			): Bet => {
				// / https://github.com/zzzgit/bac-motor/blob/7cbe9b35a4f0e32515dc58c6c364b514d60f215c/src/Engine.ts#L123
				// 上面一行被comment, 所以prevBet永遠為空
				system.setBalance(balance)
				bet = system.figureOutBet(prevBet, prevComeout as HandOutcome)
				isFree = bet.getMun() instanceof Free
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
				const payout = handResult.getPayout()
				balance = balance + payout
				if (bet.getMun() instanceof Banker) {
					// if (handResult.tagArray.find(item => item instanceof SuperSix)) {
					result.commision += handResult.getWager() * 0.05
					// }
				}
				// console.log(`${handResult.getWager()}\t${payout}\t${balance}`)
				if (balance >= capital + profitGoal) {
					tableDistribution.push([
						++currentRound,
						Math.round(result.betMoney),
						result.bettingTimes,
						Math.round(result.commision),
						Math.round(balance),
					])
					balance = capital
					result.betMoney = 0
					result.bettingTimes = 0
					result.commision = 0
					if (currentRound == targetRound) {
						console.log(`完成任務${targetRound}輪`)
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
				console.log("shutdown:", 2 || e)
				break
			}
		}
		engine.shutdown()
	},
	report() {
		tableDistribution.print(`20 shoes，螞蟻🐜搬家打法：`)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 返傭，讓莊閒的rv都為0
 * 2. 返傭，讓莊閒的rv都為0.01，有機會賺錢
 * 3. 註碼法並不重要，重要的是rv，和止盈點
 * 4.
 */
