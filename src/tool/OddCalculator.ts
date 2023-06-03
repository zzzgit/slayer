class OddCalculator {
	private perfect_banber: number = 0.458597

	private perfect_player: number = 0.446247

	private perfect_tie: number = 0.095156

	private _banber: number

	private _player: number

	private _tie: number

	private _betOnBanco: boolean

	private _totalSmall: number

	private _totalBig: number

	static from(
		bancoWins: number,
		puntoWins: number,
		tie: number,
		betOnBanco: boolean
	): OddCalculator {
		return new OddCalculator(bancoWins, puntoWins, tie, betOnBanco)
	}

	constructor(
		bancoWins: number,
		puntoWins: number,
		tie: number,
		betOnBanco: boolean
	) {
		this._banber = bancoWins
		this._player = puntoWins
		this._tie = tie
		this._betOnBanco = betOnBanco
		this._totalSmall = bancoWins + puntoWins
		this._totalBig = this._totalSmall + tie
	}

	getw2l(): number {
		if (this._betOnBanco) {
			return this._banber / this._player
		}
		return this._player / this._banber
	}

	getReward(isTieIncluded: boolean): number {
		const total = isTieIncluded ? this._totalBig : this._totalSmall
		if (this._betOnBanco) {
			return (this._banber * 0.95 - this._player) / total
		}
		return (this._player - this._banber) / total
	}

	getBancoHitOccurence(): number {
		return this._banber / this._totalBig
	}

	getPuntoHitOccurence(): number {
		return this._player / this._totalBig
	}

	getTieHitOccurence(): number {
		return this._tie / this._totalBig
	}

	getPerfectw2l(): number {
		if (this._betOnBanco) {
			return this.perfect_banber / this.perfect_player
		}
		return this.perfect_player / this.perfect_banber
	}

	getBreakEvenw2l(): number {
		if (this._betOnBanco) {
			return this.perfect_banber / (0.95 * this.perfect_banber)
		}
		return 1
	}

	getPerfectReward(isTieIncluded: boolean): number {
		const total = isTieIncluded ? 1 : 1 - this.perfect_tie
		if (this._betOnBanco) {
			return (this.perfect_banber * 0.95 - this.perfect_player) / total
		}
		return (this.perfect_player - this.perfect_banber) / total
	}
}

export default OddCalculator
