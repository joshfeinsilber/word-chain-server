import GameRoom from "../GameRoom"
import { getChallenge } from "../Challenges"
import BroadcastChallengeText from "../broadcast/ChallengeText"
import e = require("express")
import BroadcastPlayers from "../broadcast/Players"
import OnCompletion from "./OnCompletion"

const MakeChallenge = (game: GameRoom) => {
  game.state.currentChallengeIndex += 1
  const newChallenge = getChallenge()
  game.state.currentChallenge = [newChallenge]
  BroadcastChallengeText(game)

  let completingChallengePlayerId = ""

  let existingCompletingChallengePlayerId = ""
  Object.keys(game.state.players).forEach(key => {
    if (game.state.players[key].turnIsActive) {
      existingCompletingChallengePlayerId = key
    }
  })

  if (existingCompletingChallengePlayerId) {
    game.state.players[existingCompletingChallengePlayerId].turnIsActive = false
    const indexOfPlayerInRotation = game.state.turnRotation.findIndex(
      playerId => playerId === existingCompletingChallengePlayerId
    )

    completingChallengePlayerId =
      game.state.turnRotation[indexOfPlayerInRotation + 1] ||
      game.state.turnRotation[0]
  } else {
    completingChallengePlayerId = game.state.turnRotation[0]
  }

  if (game.state.players[completingChallengePlayerId]) {
    game.state.players[completingChallengePlayerId].turnIsActive = true
    const challengeIndex = parseInt(game.state.currentChallengeIndex.toString())
    game.clock.setTimeout(
      () => OnCompletion(challengeIndex, completingChallengePlayerId, game),
      15000
    )
  }

  BroadcastPlayers(game)
}

export default MakeChallenge
