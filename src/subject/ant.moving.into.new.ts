import HandOutcomeOrUndefined from "../model/strategy/type/HandOutcomeOrUndefined"
import BetOrUndefined from "../model/strategy/type/BetOrUndefined"
import AntBetSequence from "./strategy/AntBetSequence"
import AntStrategy from "./strategy/AntStrategy"
// eslint-disable-next-line node/no-extraneous-import
import {Engine, HandOutcome, Bet, FreeMun as Free, SuperSixMun as SuperSix, BankerMun as Banker} from "baccarat-engine"
import CliTable from "../report/Table"

const engine = new Engine()
const shoeAmount = 20
const capital = 1000
let balance = capital
const profitGoal = 100
const stopLoss = 10
let round = 0


const tableDistribution = new CliTable({
	head: ['round/statistics', 'bet', 'betting times', 'commision'],
	colWidths: [15, 15, 15, 15],
	style: {"compact": false, 'padding-left': 1},
})


const result = {
	bettingTimes: 0,
	bet: 0,
	commision: 0,
}


const testCase = {
	init() {
		engine.powerOn()
	},
	run() {
		for (let i = 0; i < shoeAmount; i++) {
			let isFree = false
			const seq = new AntBetSequence()
			const system = new AntStrategy(seq)
			let bet: Bet
			const beforePlay = (prevBet: BetOrUndefined, prevComeout: HandOutcomeOrUndefined): Bet => {
				system.setBalance(balance)
				bet = system.figureOutBet(prevBet, prevComeout as HandOutcome)
				isFree = bet.getMun() instanceof Free ? true : false
				if (!isFree) {
					const wager = bet.getWager()
					balance = balance - wager
					result.bettingTimes++
					result.bet += wager
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
					if (handResult.tagArray.find(item => item instanceof SuperSix)) {
						result.commision += handResult.getWager() * .95
					}
				}
				// console.log(`${handResult.getWager()}\t${payout}\t${balance}`)
				if (balance >= capital + profitGoal) {
					tableDistribution.push([++round, result.bet, result.bettingTimes, result.commision])
					balance = capital
					result.bet = 0
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
		console.log(`balance: ${balance }`)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1.
 * 2.
 */
