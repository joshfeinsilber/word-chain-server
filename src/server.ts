import * as express from "express"
import * as blueboat from "blueboat"
import GameRoom from "./GameRoom"
import * as faker from "faker"

const start = () => {
  const app = express()
  const server = new blueboat.Server({
    app,
    storage: blueboat.MemoryStorage(),
    pubsub: blueboat.EventEmitterPubSub(),
    redis: {
      host: "localhost",
      port: 6379,
      password: ""
    },
    customRoomIdGenerator: () => {
      return faker.random.number(999).toString()
    },
    admins: { admin: "password" }
  })
  server.registerRoom("WordChain", GameRoom)
  const port = Number(process.env.PORT || 4000)
  server.listen(port, () => console.log(`Server listening on port ${port}`))
}

start()
