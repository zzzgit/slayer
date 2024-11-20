import { BeadRoad, GreenBeadEntity, IEntity } from 'marga'
import {
	Engine, HandOutcome, Pair, ShoeOutcome, Tag,
} from 'bac-motor'
import CliTable from '../report/Table'
import CounterMap from './collection/CounterMap'

const engine = new Engine()
const shoeAmount = 10000
const round = 1
const table = new CliTable({
	head: ['total', 'B', 'P', 'tie'],
	colWidths: [20, 20, 20, 20],
	// style: { compact: false, 'padding-left': 1 },
})

let result = {
	tie: new CounterMap<number>(),
	pair: new CounterMap<number>(),
	distanceMap: new CounterMap<number>(),
	occurrenceMap: new CounterMap<number>(),
}

const testCase = {
	init(){
		const config = Object.assign({}, { shouldGenerateRoad: true })
		engine.powerOn(config)
	},
	work(){
		result = {
			tie: new CounterMap<number>(),
			pair: new CounterMap<number>(),
			distanceMap: new CounterMap<number>(),
			occurrenceMap: new CounterMap<number>(),
		}
		for (let i = 0; i < shoeAmount; i++){
			const shoeComeout: ShoeOutcome = engine.playOneShoe()
			this.analise(shoeComeout.getBeadRoad(), shoeComeout.getFirstHandOutcome())
		}
	},
	analise(road: BeadRoad, houtcome: HandOutcome | undefined){
		let curentId = 0
		let current: IEntity = road.getFirstEntity() as IEntity
		let currentOutcome = houtcome
		let triadOccurence = 0
		while (current.getGameId() < 50){
			const hasPair = currentOutcome?.hasPair
			if (current instanceof GreenBeadEntity || hasPair){
				//
				const newId = current.getGameId()
				result.distanceMap.count(newId - curentId)
				if (newId - curentId > 12){
					// console.log(newId - curentId)
				}
				curentId = newId
				//
				if (current instanceof GreenBeadEntity){
					triadOccurence++
				}
				if (hasPair){
					const found = currentOutcome?.tagArray.filter((tag: Tag)=> tag instanceof Pair)
					if (found){
						triadOccurence = triadOccurence + found.length
					}
				}
			}
			current = current.getNextEntity() as IEntity
			currentOutcome = currentOutcome?.getNextHandOutcome()
		}
		result.occurrenceMap.count(triadOccurence)
		return result
	},
	run(){
		for (let i = 0; i < round; i++){
			this.work()
		}
		engine.shutdown()
	},
	report(){
		table.print('莊閒分佈：')
		result.distanceMap.printSorted('triad距離(五十手):')
		result.occurrenceMap.printSorted('triad次數(五十手):')
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. triad的幾率9.55 + 7.47*2 = 0.245
 * 2. 在間隔比較的情況下，triad在本shoe中出現次數是否真的會比較少？
 * 3. 計算一下triad 的 ev
 */
