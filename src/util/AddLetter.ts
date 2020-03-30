import GameRoom from "../GameRoom"
import BroadcastAddedLetter from "../broadcast/AddedLetter"

export const allowedLetters = "abcdefghijklmnopqrstuvwxyz".split("")

const AddLetter = (game: GameRoom, letter: string) => {
  const formattedLetter = letter.toLowerCase()
  if (!allowedLetters.includes(formattedLetter)) {
    return
  }
  game.state.letters.push(formattedLetter)
  BroadcastAddedLetter(game)
}

export default AddLetter
