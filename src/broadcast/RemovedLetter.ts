import GameRoom from "../GameRoom"

const BroadcastRemovedLetter = (game: GameRoom) => {
  game.broadcast("REMOVED_LETTER")
}

export default BroadcastRemovedLetter
