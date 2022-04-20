
// import util from "../tool/util"
// import massiveTestConfig from "../config/massiveTestConfig"
// import {BigRoad, Streak, BeadRoad, BankerBigEntity, GreenBeadEntity, RedBeadEntity, BeadEntity} from "marga"
// import {Engine, ShoeOutcome} from "bac-motor"
// import CliTable from "../report/Table"

// const engine = new Engine()
// const shoeAmount = 3000
// const round = 1
// const table = new CliTable({
// 	head: ['total', 'B', 'P', 'tie'],
// 	colWidths: [20, 20, 20, 20],
// 	style: {"compact": false, 'padding-left': 1},
// })

// let result: { [key:string] :any} = {
// 	bbp: 0,
// 	bbb: 0,
// 	bpp: 0,
// 	bpb: 0,
// 	pbp: 0,
// 	pbb: 0,
// 	ppp: 0,
// 	ppb: 0,
// }
// const varianceArr:number[] = []


// const testCase = {
// 	init() {
// 		const config = Object.assign({}, massiveTestConfig, {shouldGenerateRoad: true, shouldCutShoe: true})
// 		engine.powerOn(config)
// 	},
// 	work() {
// 		result = {
// 			bbp: 0,
// 			bbb: 0,
// 			bpp: 0,
// 			bpb: 0,
// 			pbp: 0,
// 			pbb: 0,
// 			ppp: 0,
// 			ppb: 0,
// 		}
// 		for (let i = 0; i < shoeAmount; i++) {
// 			const shoeOutcome: ShoeOutcome = engine.playOneShoe()
// 			const info = shoeOutcome.getStatisticInfo()
// 			const road: BeadRoad = shoeOutcome.get
// 			let first = road.getFirstEntity()
// 			while (first) {
// 				let
// 				if (first.getNextEntity()?.getNextEntity()) {
// 					let str = ""
// 					if (!(first instanceof GreenBeadEntity)) {
// 						str = str + this.bbbbbbbbb(first)
// 					}
// 				}
// 				first = first.getNextEntity()
// 			}
// 			// console.log(`shoe${shoeOutcome.getShoeIndex()}:\t${capital}`)
// 			result.banco += info.banco
// 			result.punto += info.punto
// 			result.tie += info.tie
// 		}
// 		const totalResult: number = result.tie + result.banco + result.punto
// 		table.push([totalResult, result.banco, result.punto, result.tie],
// 			[`100 %`, util.percentize(result.banco / totalResult) + " %",
// 				util.percentize(result.punto / totalResult) + " %", util.percentize(result.tie / totalResult) + " %"])
// 	},
// 	bbbbbbbbb(entity:BeadEntity) :string {
// 		if (entity instanceof RedBeadEntity) {
// 			return "b"
// 		} else {
// 			return "p"
// 		}
// 	},
// 	run() {
// 		for (let i = 0; i < round; i++) {
// 			this.work()
// 		}
// 		engine.shutdown()
// 	},
// 	report() {
// 		table.print(`莊閒分佈：`)
// 		// console.log("平均方差：", varianceArr.reduce((a, b)=>a + b) / varianceArr.length)
// 	},
// }

// testCase.init()
// testCase.run()
// testCase.report()

// /**
//  * 1. 遇莊打閒，隨時可能輸到內褲都沒有
//  * 2. 莊比閒多會輸，裝比閒少也會輸,e.g. 莊31:	閒41
//  * 3. 如果不要求莊比閒少，最多可以輸13手（只是測試結果而已，實際可能更多）
//  * 4.
//  */
