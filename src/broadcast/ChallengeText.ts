import GameRoom from "../GameRoom"

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const BroadcastChallengeText = (game: GameRoom) => {
  let text = ``
  game.state.currentChallenge.forEach((challenge, index) => {
    if (index > 0) {
      text += `, `
    }
    text += challenge.textDescription
  })
  text = capitalizeFirstLetter(text)
  game.broadcast("CHALLENGE_TEXT", text)
}

export default BroadcastChallengeText