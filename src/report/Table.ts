const Table = require('cli-table3')

type CellContent = string | number

// eslint-disable-next-line @typescript-eslint/no-type-alias
type Config = {
	head: string[]
	colWidths: number[]
	style: {[key: string]: any}
}

class CliTable{
	private table

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
