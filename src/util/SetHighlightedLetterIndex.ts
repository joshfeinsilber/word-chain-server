import GameRoom from "../GameRoom"
import BroadcastHighlightedLetterIndex from "../broadcast/HighlightedLetterIndex"

const SetHighlightedLetterIndex = (game: GameRoom, index: number) => {
  game.state.highlightedLetterIndex = index
  game.state.firstLetterOfWordIndex = index
  BroadcastHighlightedLetterIndex(game)
}

export default SetHighlightedLetterIndex
