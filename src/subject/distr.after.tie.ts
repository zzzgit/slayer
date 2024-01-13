import { Engine } from 'bac-motor'
import { BeadEntity } from 'marga'
import CliTable from '../report/Table'
import util from '../tool/util'

const engine = new Engine()
const shoeAmount = 2000
const round = 4
const table_distribution = new CliTable({
	head: ['total', 'B', 'P'],
	colWidths: [20, 20, 20],
	style: { compact: false, 'padding-left': 1 },
})

const result: {[key: string]: any} = {
	all: 0,
	tie: 0,
	b: 0,
	p: 0,
}

const testCase = {
	init(){
		engine.powerOn()
	},
	work(){
		result.all = 0
		result.tie = 0
		result.b = 0
		result.p = 0
		for (let i = 0; i < shoeAmount; i++){
			const shoeOutcome = engine.playOneShoe(undefined, undefined)
			const beadRoad = shoeOutcome.getBeadRoad()
			let previous = beadRoad.getFirstEntity() as BeadEntity
			let current = previous?.getNextEntity() as BeadEntity
			while (current){
				if (!current.isTie()){
					if (previous.isTie()){
						result.all++
						if (current.isBancoWon()){
							result.b++
						} else {
							result.p++
						}
					}
				}
				previous = current
				current = current.getNextEntity() as BeadEntity
			}
		}
		table_distribution.push([result.all, result.b, result.p])
		table_distribution.push([
			'100%',
			util.percentize(result.b / result.all) + '%',
			util.percentize(result.p / result.all) + '%',
		])
	},
	run(){
		for (let i = 0; i < round; i++){
			this.work()
		}
		engine.shutdown()
	},
	report(){
		table_distribution.print('和局之後的莊閒分佈：')
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 毫無驚奇
 */
