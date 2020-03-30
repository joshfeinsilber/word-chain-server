import GameRoom from "../GameRoom"

const BroadcastPlayers = (game: GameRoom) => {
  game.broadcast(
    "PLAYERS",
    Object.keys(game.state.players).map(key => {
      return {
        ...game.state.players[key],
        wordsUsed: [] // no need to send all the words
      }
    })
  )
}

export default BroadcastPlayers