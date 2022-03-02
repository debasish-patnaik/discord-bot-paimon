import { addMinutes } from "date-fns"
import { TextBasedChannel } from "discord.js"
import fastify from "fastify"
import schedule from "node-schedule"

import { onInteraction } from "./events/onInteraction"
import { onReady } from "./events/onReady"
import { getClient } from "./utils/getClient"
import { BOT } from "./utils/getDiscordClient"


async function initNotifications() {
  const client = getClient()

  // get the db records
  const resins = await client.resins.findMany({
    where: {
      shouldNotify: true,
    }
  })

  // loop through the records and schedule a job for each
  resins.forEach(resin => {
    const lastUpdatedAt = resin.updatedAt
    const minutesRemaining = Math.round((160 - resin.count) / 0.125)
    const approximateFullAt = addMinutes(lastUpdatedAt, minutesRemaining)

    schedule.scheduleJob(approximateFullAt, async function () {
      if (resin.shouldNotify) {
        const channel = BOT.channels.cache.get(process.env.NOTIFICATION_CHANNEL) as TextBasedChannel
        const user = BOT.users.cache.get(resin.userId)
        if (channel) {
          channel.send(`<@${resin.userId}> Your resin is about to be completely refilled!`)
          console.info(`Notifying ${user?.username} that resin is about to be refilled`)
          await client.resins.update({
            where: {
              userId: resin.userId,
            },
            data: {
              shouldNotify: false,
              notifiedAt: new Date()
            }
          })
        }
      }
    })

  })

}

(async () => {
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

  // init the notifications
  initNotifications()

})()
