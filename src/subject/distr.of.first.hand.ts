import massiveTestConfig from '../config/massiveTestConfig'
import CounterMap from './collection/CounterMap'
import { Engine, HandResult, ShoeOutcome } from 'bac-motor'
import CliTable from '../report/Table'
import util from '../tool/util'
import * as samael from 'samael'

const engine = new Engine()
const shoeAmount = 90
const round = 1
const table = new CliTable({
	head: [' ', 'B', 'P'],
	colWidths: [20, 20, 20],
	style: { compact: false, 'padding-left': 1 },
})

let result: {firstHand: CounterMap<string>; banker: number; player: number} = {
	firstHand: new CounterMap<string>(),
	banker: 0,
	player: 0,
}

const testCase = {
	init(){
		const config = Object.assign({}, massiveTestConfig, {
			shouldGenerateRoad: false,
			shouldCutShoe: true,
		})
		engine.powerOn(config)
	},
	work(){
		result = {
			firstHand: new CounterMap<string>(),
			banker: 0,
			player: 0,
		}
		const date = new Date()
		const path = '/Users/luochao/Desktop/projects/slayer/src/baccaratology/reportCache/mm.txt'
		let prom = samael
			.writeToFile(path, `${date.toLocaleString()}\n  \n`)
			.catch((e: Error)=> console.log('錯誤', e))
		for (let i = 0; i < shoeAmount; i++){
			const shoeComeout: ShoeOutcome = engine.playOneShoe()
			const info = shoeComeout.getStatisticInfo()
			let str = `${shoeComeout.getShoeIndex()}\t${info.banco}\t${info.punto}\t${
				info.tie
			}\n`
			str = ''
			prom = prom.then(()=> samael.appendToFile(path, str))
			let first = shoeComeout.getFirstHandOutcome()
			while (first?.result == HandResult.Tie){
				first = first.getNextHandOutcome()
			}
			const isBankerWin = first?.result == HandResult.BancoWins
			const isPlayerWin = first?.result == HandResult.PuntoWins
			if (isBankerWin){
				result.firstHand.count('B')
			}
			if (isPlayerWin){
				result.firstHand.count('P')
			}
			result.banker += info.banco
			result.player += info.punto
		}
		const totalResult: number = result.banker + result.player
		const firstB = result.firstHand.get('B') as number
		const firstP = result.firstHand.get('P') as number
		const totalFisrt = firstB + firstP
		table.push(['total', result.banker, result.player], [
			'100 %',
			util.percentize(result.banker / totalResult) + ' %',
			util.percentize(result.player / totalResult) + ' %',
		], ['first hand', firstB, firstP], [
			'100 %',
			util.percentize(firstB / totalFisrt) + ' %',
			util.percentize(firstP / totalFisrt) + ' %',
		])
	},
	run(){
		for (let i = 0; i < round; i++){
			this.work()
		}
		engine.shutdown()
	},
	report(){
		table.print('莊閒分佈：')
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 第一手，沒有bias
 *
 *
 */
