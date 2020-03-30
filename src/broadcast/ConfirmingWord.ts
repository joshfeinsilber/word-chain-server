import GameRoom from "../GameRoom"

const BroadcastConfirmingWord = (game: GameRoom) => {
  game.broadcast("CONFIRMING_WORD", game.state.confirmingWord)
}

export default BroadcastConfirmingWord
