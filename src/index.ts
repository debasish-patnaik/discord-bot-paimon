import { Client } from "discord.js"
import { IntentOptions } from "./config/IntentOptions"

(async () => {

  const BOT = new Client({ intents: IntentOptions })  // 32767 = all intents

  BOT.on("ready", () => {
    console.log("Contected to Discord!")
  })

  await BOT.login(process.env.BOT_TOKEN)

})()