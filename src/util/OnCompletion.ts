import GameRoom from "../GameRoom"
import { Challenge, ChallengeCategory } from "../Challenges"
import SetHighlightedLetterIndex from "./SetHighlightedLetterIndex"
import MakeChallenge from "./MakeChallenge"
import BroadcastConfirmingWord from "../broadcast/ConfirmingWord"
import BroadcastPlayers from "../broadcast/Players"
import BroadcastWinnerName from "../broadcast/WinnerName"
import { shuffle } from "lodash"
import BroadcastLetters from "../broadcast/Letters"
const spellcheck = require("spellchecker")
const WordPOS = require("wordpos")

const letters = "abcdefghijklmnopqrstuvwxyz".split("")

const wordpos = new WordPOS()

const properSpelling = (word: string): boolean => !spellcheck.isMisspelled(word)

const isValidPartOfSpeech = (word: string, partOfSpeech: string) => {
  return new Promise(resolve => {
    if (partOfSpeech === "adjective") {
      wordpos.isAdjective(word, (result: boolean) => resolve(result))
      return
    }
    if (partOfSpeech === "verb") {
      wordpos.isVerb(word, (result: boolean) => resolve(result))
      return
    }
    resolve(true)
  })
}

const PassesChallenge = async (word: string, challenge: Challenge) => {
  try {
    if (challenge.category === ChallengeCategory.letterCount) {
      if (word.length < challenge.values[0]) {
        throw "Incorrect length"
      }
    }
    if (challenge.category === ChallengeCategory.partOfSpeech) {
      const valid = await isValidPartOfSpeech(word, challenge.values[0])
      if (!valid) {
        throw "Not valid part of speech"
      }
    }
    if (challenge.category === ChallengeCategory.containsLetter) {
      if (!word.includes(challenge.values[0])) {
        throw `Does not contain "${challenge.values[0]}"`
      }
    }
    if (challenge.category === ChallengeCategory.doesNotContainLetter) {
      const wordWithoutFirstLetter = word.substring(1)
      if (wordWithoutFirstLetter.includes(challenge.values[0])) {
        throw `Word includes the letter "${challenge.values[0]}"`
      }
    }
    if (challenge.category === ChallengeCategory.endsWithLetter) {
      if (!word.endsWith(challenge.values[0])) {
        throw `Word does not end with '${challenge.values[0]}'`
      }
    }
  } catch (e) {
    throw e
  }
}

const OnCompletion = (index: number, playerId: string, game: GameRoom) => {
  if (game.state.confirmingWord) {
    return
  }

  if (index !== game.state.currentChallengeIndex) {
    return
  }

  if (game.state.winnerName) {
    return
  }

  const player = game.state.players[playerId]
  if (!player || !player.turnIsActive) {
    return
  }

  game.state.confirmingWord = true
  BroadcastConfirmingWord(game)

  let word = ``
  word += game.state.letters[game.state.firstLetterOfWordIndex]
  game.state.letters.forEach((letter, index) => {
    if (index > game.state.firstLetterOfWordIndex) {
      word += letter
    }
  })

  const both = (callback?: () => any) => {
    game.clock.setTimeout(() => {
      if (callback) {
        callback()
      }
      SetHighlightedLetterIndex(game, game.state.letters.length - 1)
      MakeChallenge(game)
      game.state.confirmingWord = false
      BroadcastConfirmingWord(game)
    }, 1000)
  }

  const notCorrect = () => {
    const callback = () => {
      game.state.letters.push(shuffle(letters)[0])
      BroadcastLetters(game)

      game.state.players[playerId].livesLeft = Math.max(
        game.state.players[playerId].livesLeft - 1,
        0
      )
      const outOfGame = game.state.players[playerId].livesLeft === 0
      if (outOfGame) {
        game.state.players[playerId].outOfGame = true
        game.state.turnRotation = game.state.turnRotation.filter(
          id => id !== playerId
        )
      }

      const gameIsOver = game.state.turnRotation.length === 0
      BroadcastPlayers(game)
      if (outOfGame) {
        if (gameIsOver) {
          if (Object.keys(game.state.players).length === 1) {
            game.state.turnRotation = [playerId]
          }
          let winnerId = ""
          let recordPoints = 0
          Object.keys(game.state.players).forEach(p => {
            const currentPlayer = game.state.players[p]
            if (currentPlayer && currentPlayer.points > recordPoints) {
              recordPoints = currentPlayer.points
              winnerId = p
            }
          })
          if (game.state.players[winnerId]) {
            const name = game.state.players[winnerId].name
            game.state.winnerName = name
            BroadcastWinnerName(game)
          }
        }
        game.broadcast("PLAY_SOUND", gameIsOver ? "FANFARE" : "OUT_OF_GAME")
      } else {
        game.broadcast("PLAY_SOUND", "INCORRECT_ANSWER")
      }
    }
    both(callback)
  }

  const correct = () => {
    const callback = () => {
      const wordLength = word.length
      Object.keys(game.state.players).forEach(p => {
        if (p === playerId) {
          game.state.players[playerId].points +=
            wordLength * game.state.players[playerId].pointsPerLetter
        } else {
          game.state.players[playerId].points +=
            game.state.players[playerId].pointsFromOthers
        }
      })
      game.state.players[playerId].wordsUsed.push(word)
      game.broadcast("PLAY_SOUND", "CORRECT_ANSWER")
    }
    both(callback)
  }

  if (!properSpelling(word) || word.length === 0 || word.length === 1) {
    notCorrect()
    return
  }

  if (game.state.players[playerId].wordsUsed.includes(word)) {
    notCorrect()
    return
  }

  Promise.all(
    game.state.currentChallenge.map(challenge =>
      PassesChallenge(word, challenge)
    )
  )
    .then(() => {
      correct()
    })
    .catch(() => notCorrect())
}

export default OnCompletion
