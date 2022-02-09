
import {IEntity, BlueBeadEntity, RedBeadEntity, BeadRoad} from "marga"

// eslint-disable-next-line node/no-extraneous-import
import {Engine, ShoeOutcome} from "baccarat-engine"
import CliTable from "../report/Table"
import util from "../tool/util"

const engine = new Engine()
const samael = require('samael')
const shoeAmount = 12
const round = 1
const table = new CliTable({
	head: ['total', 'B', 'P', 'tie'],
	colWidths: [20, 20, 20, 20],
	style: {"compact": false, 'padding-left': 1},
})

let result = {
	tie: 0,
	banker: 0,
	player: 0,
}


const testCase = {
	init() {
		const config = Object.assign({}, {shouldGenerateRoad: true})
		engine.powerOn(config)
	},
	work() {
		result = {
			tie: 0,
			banker: 0,
			player: 0,
		}
		const date = new Date()
		const path = "/Users/luochao/Desktop/projects/cardation/src/baccaratology/reportCache/mm.txt"
		let prom = samael.writeToFile(path, `${date.toLocaleString()}\n  \n`).catch((e: Error) => console.log("錯誤", e))
		for (let i = 0; i < shoeAmount; i++) {
			const shoeComeout: ShoeOutcome = engine.playOneShoe()
			const info = shoeComeout.getStatisticInfo()
			prom = prom.then(() => samael.appendToFile(path, `${shoeComeout.getShoeIndex()}\t${info.banker}\t${info.player}\t${info.tie}\n`))
			this.showRoad(shoeComeout.getBeadRoad())

			result.banker += info.banker
			result.player += info.player
			result.tie += info.tie
		}
		const totalResult: number = result.tie + result.banker + result.player
		table.push([totalResult, result.banker, result.player, result.tie],
			[`100 %`, util.percentize(result.banker / totalResult) + " %",
				util.percentize(result.player / totalResult) + " %", util.percentize(result.tie / totalResult) + " %"])
	},
	showRoad(road: BeadRoad) {
		let result = ""
		let last:IEntity = road.getLastEntity() as IEntity
		while (last) {
			if (last instanceof RedBeadEntity) {
				result += " B"
			} else if (last instanceof BlueBeadEntity) {
				result += " P"
			} else {
				result += " T"
			}
			last = last.getPreviousEntity() as IEntity
		}
		console.log(`第${road.getShoeIndex()}靴: ${result}`)
	},
	run() {
		for (let i = 0; i < round; i++) {
			this.work()
		}
		engine.shutdown()
	},
	report() {
		table.print(`莊閒分佈：`)
	},
}

testCase.init()
testCase.run()
testCase.report()

/**
 * 1. 和局幾率9.5%
 * 2. 閒家贏比莊家贏略高
 */
