import { shuffle } from "lodash"

export enum ChallengeCategory {
  letterCount = "letterCount",
  partOfSpeech = "partOfSpeech",
  containsLetter = "containsLetter",
  endsWithLetter = "endsWithLetter",
  doesNotContainLetter = "doesNotContainLetter"
}

export interface Challenge {
  category: ChallengeCategory
  values: any[]
  textDescription: string
}

const categories = [
  ChallengeCategory.letterCount,
  ChallengeCategory.partOfSpeech,
  ChallengeCategory.containsLetter,
  ChallengeCategory.endsWithLetter,
  ChallengeCategory.doesNotContainLetter
]

export const validLetterCounts = [3, 4, 5, 6]
export const validPartsOfSpeech = ["verb", "adjective"]
export const validContainsLetter = ["s", "t", "l", "m", "n", "p"]
export const validEndsWithLetter = ["s", "t", "l", "m", "n", "p"]
export const validDoesNotContainLetter = ["a", "e", "i", "o", "u"]

export const getChallenge = (existingChallenge?: Challenge) => {
  let challenge: Challenge = {
    category: null,
    values: [],
    textDescription: ""
  }

  const category = shuffle(
    categories.filter(c => {
      if (!existingChallenge) {
        return true
      }
      return existingChallenge.category !== c
    })
  )[0]
  challenge.category = category

  if (category === ChallengeCategory.letterCount) {
    const letterCount = shuffle(validLetterCounts)[0]
    challenge.values.push(letterCount)
    challenge.textDescription = `at least ${letterCount} letters`
  }

  if (category === ChallengeCategory.partOfSpeech) {
    const partOfSpeech = shuffle(validPartsOfSpeech)[0]
    challenge.values.push(partOfSpeech)
    challenge.textDescription = `${partOfSpeech}`
  }
  if (category === ChallengeCategory.containsLetter) {
    const containingLetter = shuffle(validContainsLetter)[0]
    challenge.values.push(containingLetter)
    challenge.textDescription = `contains "${containingLetter}"`
  }
  if (category === ChallengeCategory.endsWithLetter) {
    const endsWithLetter = shuffle(validEndsWithLetter)[0]
    challenge.values.push(endsWithLetter)
    challenge.textDescription = `ends with "${endsWithLetter}"`
  }
  if (category === ChallengeCategory.doesNotContainLetter) {
    const doesNotContainLetter = shuffle(validDoesNotContainLetter)[0]
    challenge.values.push(doesNotContainLetter)
    challenge.textDescription = `does not contain "${doesNotContainLetter}"`
  }

  return challenge
}
