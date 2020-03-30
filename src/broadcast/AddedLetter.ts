import GameRoom from "../GameRoom"

const BroadcastAddedLetter = (game: GameRoom) => {
  game.broadcast("ADDED_LETTER", game.state.letters[game.state.letters.length - 1])
}

export default BroadcastAddedLetter