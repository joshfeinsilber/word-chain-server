import * as blueboat from "blueboat"
import State, { Player, Stage } from "./State"
import BroadcastPlayers from "./broadcast/Players"
import SetGameStage from "./util/SetGameStage"
import RemoveLetter from "./util/RemoveLetter"
import AddLetter, { allowedLetters } from "./util/AddLetter"
import { shuffle } from "lodash"
import BroadcastLetters from "./broadcast/Letters"
import MakeChallenge from "./util/MakeChallenge"
import OnCompletion from "./util/OnCompletion"
import Powers, { PowerIds } from "./const/Powers"

export default class GameRoom extends blueboat.Room<State> {
  public async onCreate() {
    this.setState(new State())
    const firstLetter = shuffle(allowedLetters)[0]
    this.state.letters = [firstLetter]
  }

  public onJoin(client: blueboat.Client, options: { name: string }) {
    this.state.players[client.id] = new Player()
    this.state.players[client.id] = {
      ...this.state.players[client.id],
      id: client.id,
      name: options.name
    }
    BroadcastPlayers(this)
    BroadcastLetters(this)
    this.state.turnRotation.push(client.id)
    client.send("SECONDS_PER_CHALLENGE", 15)
    client.send("POWERS", Powers)
  }

  public async canClientJoin(
    simpleClient: blueboat.SimpleClient,
    options: { name: string }
  ) {
    if (!options.name) {
      throw "No name"
    }
  }

  public onMessage(client: blueboat.Client, action: string, data?: any) {
    if (action === "START_GAME") {
      MakeChallenge(this)
      SetGameStage(this, Stage.game)
      this.clock.setInterval(() => {
        if (this.state.winnerName) {
          return
        }
        Object.keys(this.state.players).forEach(player => {
          if (this.state.players[player]) {
            this.state.players[player].points += this.state.players[
              player
            ].pointsGainedPerInterval60
          }
        })
        BroadcastPlayers(this)
      }, 60000)
      return
    }
    if (action === "KEY") {
      if (!data) {
        return
      }
      if (
        !this.state.players[client.id].turnIsActive ||
        this.state.confirmingWord ||
        this.state.winnerName
      ) {
        return
      }
      if (data.action === "remove") {
        RemoveLetter(this)
        return
      }
      if (data.action === "add") {
        AddLetter(this, data.value)
        return
      }
      if (data.action === "confirm") {
        OnCompletion(this.state.currentChallengeIndex, client.id, this)
        return
      }
      return
    }

    if (action === "PURCHASE_POWER") {
      const id: string = data
      if (!id) {
        return
      }
      const power = Powers.find(p => p.id === id)
      if (!power) {
        return
      }
      const cost = Math.round(
        power.cost * this.state.players[client.id].powerPriceMultiplier
      )
      if (cost > this.state.players[client.id].points) {
        return
      }
      this.state.players[client.id].points -= cost
      if (power.id === PowerIds.autoPoint) {
        this.state.players[client.id].pointsGainedPerInterval60 += 25
      }
      if (power.id === PowerIds.extraLife) {
        this.state.players[client.id].livesLeft += 1
        if (this.state.players[client.id].outOfGame) {
          this.state.players[client.id].outOfGame = false
          this.state.turnRotation.push(client.id)
        }
      }
      if (power.id === PowerIds.lessExpensive) {
        this.state.players[client.id].powerPriceMultiplier *= 0.9
      }
      if (power.id === PowerIds.makeExpensive) {
        Object.keys(this.state.players).forEach(p => {
          if (p === client.id) {
            return
          }
          this.state.players[p].powerPriceMultiplier *= 1.1
        })
      }
      if (power.id === PowerIds.pointFromWin) {
        this.state.players[client.id].pointsFromOthers += 10
      }
      if (power.id === PowerIds.pointsPerLetter) {
        this.state.players[client.id].pointsPerLetter += 1
      }
      BroadcastPlayers(this)
      return
    }
  }
  public async onLeave(client: blueboat.Client) {
    //
  }
}
