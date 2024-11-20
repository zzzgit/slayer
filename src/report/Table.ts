/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Table from 'cli-table3'

type CellContent = string | number

type Config = {
	head: string[]
	colWidths: number[]
	style: {[key: string]: any }
}

class CliTable{

	private table: any

	constructor(config: Config){
		this.table = new Table(config)
	}

	push(...arr: CellContent[][]): any{
		return this.table.push(...arr)
	}

	print(title: string): void{
		console.log(title)
		console.log(this.table.toString())
	}

}

export default CliTable
