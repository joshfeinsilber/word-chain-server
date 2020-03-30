import { EntityMap } from "blueboat"
import { Challenge } from "./Challenges"

export enum Stage {
  lobby = "lobby",
  game = "game",
  end = "end"
}

class State {
  public stage: Stage = Stage.lobby
  public letters: string[] = []
  public highlightedLetterIndex: number = 0
  public firstLetterOfWordIndex: number = 0
  public currentChallenge: Challenge[] = []
  public currentChallengeIndex: number = 0
  public confirmingWord: boolean = false
  public winnerName: string = ""
  public players: EntityMap<Player> = {}
  public turnRotation: string[] = []
}

export default State

export class Player {
  public id: string = ""
  public name: string = ""
  public points: number = 0
  public pointsPerLetter: number = 10
  public pointsFromOthers: number = 0
  public pointsGainedPerInterval60: number = 0
  public powerPriceMultiplier: number = 1
  public livesLeft: number = 3
  public turnIsActive: boolean = false
  public outOfGame: boolean = false
  public wordsUsed: string[] = []
}
