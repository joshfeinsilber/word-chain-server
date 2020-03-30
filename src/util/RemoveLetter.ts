import GameRoom from "../GameRoom"
import BroadcastRemovedLetter from "../broadcast/RemovedLetter"

const RemoveLetter = (game: GameRoom) => {
  const index = game.state.letters.length - 1
  if (index <= game.state.firstLetterOfWordIndex) {
    return
  } // can't backspace the first letter of the word
  game.state.letters = game.state.letters.filter((letter, index) => {
    return index !== game.state.letters.length - 1
  })
  BroadcastRemovedLetter(game)
}

export default RemoveLetter
