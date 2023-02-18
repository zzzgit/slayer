import {Card} from "cardation"
import OddCalculator from "./OddCalculator"

const util = {
	percentize(num: number, position: number = 2) {
		return (num * 100).toFixed(position)
	},
	sum(arr: number[]):number {
		let result = 0
		arr.forEach((item)=>{
			result += +item
		})
		return result
	},
	// Average absolute deviation
	aad(arr: number[]) {
		const sum = this.sum(arr)
		const avg = sum / arr.length
		let deviationSum = 0
		arr.forEach((item)=>{
			deviationSum += Math.abs(item - avg)
		})
		return deviationSum / arr.length
	},
	min(arr: number[]) {
		if (arr.length == 0) {
			throw new Error("不能為空")
		}
		let min = Infinity
		for (const element of arr) {
			const elem = +element
			if (elem < min) {
				min = elem
			}
		}
		return min
	},
	max(arr: number[]) {
		if (arr.length == 0) {
			throw new Error(" 不能為空")
		}
		let max = -Infinity
		for (const element of arr) {
			const elem = +element
			if (elem > max) {
				max = elem
			}
		}
		return max
	},
	range(arr:number[]) {
		return this.max(arr) - this.min(arr)
	},
	mean(arr: number[]) {
		if (arr.length == 0) {
			return null
		}
		return this.sum(arr) / arr.length
	},
	median(arr: number[]) {
		if (arr.length == 0) {
			return null
		}
		const sorted = arr.sort((a, b)=>{
			return a - b
		})
		const mid = Math.floor(sorted.length / 2)
		if (sorted.length % 2 == 1) {
			return +sorted[mid]
		}
		const top = +sorted[mid]
		const bot = +sorted[mid - 1]
		return (top + bot) / 2
	},
	fillArray(arr: any[]) {
		for (let i = 0, len = arr.length; i < len; i++) {
			if (arr[i] == null) {
				arr[i] = 0
			}
		}
	},
	countScore(cards: Card[]): number {
		let totalScore = 0
		cards.forEach((card: Card) => {
			const cardScore = card.getPoint()
			if (0 < cardScore && cardScore < 3) {
				totalScore += 1
			} else if (cardScore === 3) {
				totalScore += 2
			} else if (cardScore === 4) {
				totalScore += 3
			} else if (4 < cardScore && cardScore < 8) {
				totalScore += -2
			} else if (cardScore === 8) {
				totalScore += -1
			}
		})
		return totalScore
	},
	getAbyss(data: number[]): void {
		const rowIndex = []
		const rowValue = []
		const rowIntegral = []
		for (let i = 0, len = data.length; i < len; i++) {
			rowIndex.push(i)
			rowValue.push(data[i])
			rowIntegral.push(this._getIntegralOffirst(data, i))
		}
		for (let i = 0, len = data.length; i < len; i++) {
			console.log(`${i}\t${rowValue[i]}\t${rowIntegral[i]}`)
		}
	},
	_getIntegralOffirst(data: number[], index: number = 0): number {
		const total = this._getTotal(data, index)
		const first = data[index]
		const num = first / total * 100
		const result = num.toFixed(2)
		return +result
	},
	_getTotal(data: number[], index: number = 0): number {
		const total = data.reduce((a, b, currentIndex: number) => {
			if (currentIndex < index) {
				return 0
			}
			if (currentIndex === index) {
				return b
			}
			return a + b
		})
		return total
	},
	getVariance(list:number[] = []) :number {
		const total = list.reduce((a, b) => a + b)
		const mean = total / list.length
		const varianceArr = list.map(value => (value - mean) ** 2)
		const result = varianceArr.reduce((a, b) => a + b) / list.length
		return result
	},
	getOddCal(bancoWins: number, puntoWins: number, tie: number, betOnBanco: boolean):OddCalculator {
		return OddCalculator.from(bancoWins, puntoWins, tie, betOnBanco)
	},
}

export default util
