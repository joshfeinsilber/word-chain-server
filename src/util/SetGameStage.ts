import GameRoom from "../GameRoom"
import { Stage } from "../State"
import BroadcastGameStage from "../broadcast/GameStage"

const SetGameStage = (game: GameRoom, stage: Stage) => {
  game.state.stage = stage
  BroadcastGameStage(game)
}

export default SetGameStage
