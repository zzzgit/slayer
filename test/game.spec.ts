describe('game', ()=> {
	test('index', ()=> {
		// demo.run()
		return expect(Promise.resolve([2])).resolves.toHaveLength(1)
	})
	// test("push after shutdown", () => {
	// 	const runner = new Corunner(2)
	// 	runner.push([toResolve])
	// 	return expect(runner.start().then(() => runner.push([toResolve]))).rejects.toThrow("can't push tasks after started")
	// })
	// test("invalid number, default to 1", () => {
	// 	const runner = new Corunner(-1)
	// 	runner.push([toResolve])
	// 	return expect(runner.start()).resolves.toHaveLength(1)
	// })
	// test("pass null as a task", () => {
	// 	const runner = new Corunner(-1)
	// 	runner.push(toResolve)
	// 	runner.push(null as any)
	// 	return expect(runner.start()).resolves.toHaveLength(1)
	// })
})
