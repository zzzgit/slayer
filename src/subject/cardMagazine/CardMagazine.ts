import {AceCard, Card, CardFactory, Club, FaceCard, Heart, NumberCard} from "cardation"

class CardMagazine {
	static getCardsFromArbitraryNum(): Card[] {
		const cards: Card[] = []
		const club = new Club()
		const remainCount = [0, 7, 8, 14, 24, 5, 2, 3, 3, 4]

		remainCount.forEach((count, index) => {
			if (index === 0) {
				for (let i = 0; i < count; i++) {
					cards.push(CardFactory.createFaceCard(club, 11, 0))
				}
			} else if (index === 1) {
				for (let i = 0; i < count; i++) {
					cards.push(CardFactory.createAceCard(club, 1))
				}
			} else {
				for (let i = 0; i < count; i++) {
					if (index) {cards.push(CardFactory.createNumberCard(club, index, index))}
				}
			}
		})
		return cards
	}

	static getCardsFromPie(): Card[] {
		const cards: Card[] = []
		const pie = "314157926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679"
		for (const element of pie) {
			cards.push(creatCard(+element))
		}
		const eip = [...pie].reverse()
			.join('')
		for (const element of eip) {
			cards.push(creatCard(+element))
		}
		return cards
	}

	static getCardsFollow123456(): Card[] {
		const cards: Card[] = []
		cards.push(creatCard(1))
		for (let i = 2; i < 7; i++) {
			cards.push(creatCard(i))
		}
		return cards
	}
}

const creatCard = (score: number): Card => {
	if (score == 1) {
		return new AceCard(new Heart())
	}
	if (score == 0) {
		return new FaceCard(new Heart(), 11, 0)
	}
	return new NumberCard(new Heart(), score)
}

export default CardMagazine
