import {LogicFun, StateMachine} from "@zzznpm/samsara"
import State from "./State"


const func: LogicFun = (current: string | undefined, gotWon: boolean): string => { // undefined?
	if (typeof gotWon !== 'boolean') {
		throw new Error("not boolean")
	}
	if (current === State.Win1) {
		if (gotWon) {console.log("good")}
		return State.init
	}
	if (current === State.init) {
		return gotWon ? State.Win1 : State.Lose1
	}
	if (current === State.Lose1) {
		return gotWon ? State.init : State.Lose2
	}
	if (current === State.Lose2) {
		return gotWon ? State.Lose1 : State.Lose3
	}
	if (current === State.Lose3) {
		return gotWon ? State.Lose2 : State.Lose4
	}
	if (current === State.Lose4) {
		return gotWon ? State.Lose3 : State.Lose5
	}
	if (current === State.Lose5) {
		return gotWon ? State.Lose4 : State.Lose6
	}
	if (current === State.Lose6) {
		return gotWon ? State.Lose5 : State.Lose7
	}
	if (current === State.Lose7) {
		return gotWon ? State.Lose6 : State.Lose8
	}
	if (current === State.Lose8) {
		return gotWon ? State.Lose7 : State.Lose9
	}
	if (current === State.Lose9) {
		return gotWon ? State.Lose8 : State.Lose10
	}
	if (current === State.Lose10) {
		return gotWon ? State.Lose9 : State.Lose11
	}
	if (current === State.Lose11) {
		return gotWon ? State.Lose10 : State.Lose12
	}
	if (current === State.Lose12) {
		return gotWon ? State.Lose11 : State.Lose13
	}
	if (current === State.Lose13) {
		if (gotWon) {
			return State.Lose12
		}
		throw new Error(" sssssss")
	}

	return State.init
}


const machine = new StateMachine(Object.values(State), State.init, func)

machine.switchBy(true)
machine.switchBy(true)
machine.switchBy(true)
machine.switchBy(false)
machine.switchBy(false)
machine.switchBy(false)
console.log(machine.getCurrentState())
machine.switchBy(true)
console.log(machine.getCurrentState())
machine.switchBy(false)
machine.switchBy(false)
machine.switchBy(false)
machine.switchBy(false)
machine.switchBy(false)
machine.switchBy(false)

console.log(machine.getCurrentState())
// console.log(machine.getAllStates())
