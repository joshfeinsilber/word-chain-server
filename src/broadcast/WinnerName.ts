import GameRoom from "../GameRoom"

const BroadcastWinnerName = (game: GameRoom) => {
  game.broadcast("WINNER_NAME", game.state.winnerName)
}

export default BroadcastWinnerName
