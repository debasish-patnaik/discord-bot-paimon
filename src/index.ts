import { Client } from "discord.js"

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
})()
