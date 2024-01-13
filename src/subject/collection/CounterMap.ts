class CounterMap<KeyType> extends Map<KeyType, number>{
	count(key: KeyType): void{
		const number = this.get(key)
		this.set(key, (number || 0) + 1)
	}

	private _sort(): [KeyType[], number[], {key: KeyType; value: number}[]]{
		const keys = [...this.keys()]
		keys.sort((a, b) => +a - +b)
		const values: number[] = []
		const entities: {key: KeyType; value: number}[] = []
		keys.forEach((key) => {
			const value = this.get(key) || 0
			values.push(value)
			entities.push({ key: key, value: value })
		})
		return [keys, values, entities]
	}

	printSorted(title: string): void{
		console.log(title)
		const [keys, values] = this._sort()
		for (let i = 0, len = keys.length; i < len; i++){
			console.log(`${keys[i]}\t=>\t${values[i]}`)
		}
	}

	getSortedKeys(): KeyType[]{
		const [keys] = this._sort()
		return keys
	}

	getSortedEntities(): {key: KeyType; value: number}[]{
		// eslint-disable-next-line prefer-destructuring
		const entities = this._sort()[2]
		return entities
	}
}

export default CounterMap
