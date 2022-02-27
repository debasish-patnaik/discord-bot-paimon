import { Client } from "discord.js"
import fastify from "fastify"

import { IntentOptions } from "./config/IntentOptions"
import { onInteraction } from "./events/onInteraction"
import { onReady } from "./events/onReady"

(async () => {
  const BOT = new Client({ intents: IntentOptions }) // 32767 = all intents

  BOT.on("ready", async () => await onReady(BOT))

  BOT.on(
    "interactionCreate",
    async (interaction) => await onInteraction(interaction),
  )

  await BOT.login(process.env.BOT_TOKEN)


  // define a route for health checking
  const server = fastify({ logger: true })
  server.get("/", async () => {
    return { name: "Paimon", description: "Traveller's best friend" }
  })

  const start = async () => {
    try {
      await server.listen(8080, "0.0.0.0")
    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }
  }
  start()

})()
