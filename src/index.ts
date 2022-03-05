import { onInteraction } from "./events/onInteraction"
import { onReady } from "./events/onReady"
import { initRoutes } from "./routes"
import { BOT } from "./utils/getDiscordClient"
import { initNotifications } from "./utils/initNotifications"


(async () => {
  BOT.on("ready", async () => await onReady(BOT))

  BOT.on(
    "interactionCreate",
    async (interaction) => await onInteraction(interaction),
  )

  await BOT.login(process.env.BOT_TOKEN)

  // init the server routes
  initRoutes()

  // init the notifications
  initNotifications()

})()
