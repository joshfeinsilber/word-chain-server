import GameRoom from "../GameRoom"

const BroadcastGameStage = (game: GameRoom) => {
  game.broadcast("GAME_STAGE", game.state.stage)
}

export default BroadcastGameStage