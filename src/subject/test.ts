import q4 from "../history_data/q1"

const test1 = (arr: number[]): number[]=>{
	let result = 0
	let state = 0
	for (const item of arr) {
		result += item
		if (item === -1) {
			state--
		} else {
			state++
		}
		if (state === 2) {
			state = 0
		}
	}
	console.log(result)
	return []
}

const bb = q4
test1(bb)

//
