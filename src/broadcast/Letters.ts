import GameRoom from "../GameRoom"

const BroadcastLetters = (game: GameRoom) => {
  game.broadcast("LETTERS", game.state.letters)
}

export default BroadcastLetters
