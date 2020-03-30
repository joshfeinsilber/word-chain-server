import GameRoom from "../GameRoom"

const BroadcastHighlightedLetterIndex = (game: GameRoom) => {
  game.broadcast("HIGHLIGHTED_LETTER_INDEX", game.state.highlightedLetterIndex)
}

export default BroadcastHighlightedLetterIndex
