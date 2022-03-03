import { addMinutes } from "date-fns"
import format from "date-fns/format"
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
  const DEFAULT_TIME_OFFFSET_MINUTES = 5

  // loop through the records and schedule a job for each
  resins.forEach(resin => {
    const lastUpdatedAt = resin.updatedAt
    const minutesRemaining = Math.round((160 - resin.count) / 0.125)
    const approximateFullAt = addMinutes(lastUpdatedAt, minutesRemaining - DEFAULT_TIME_OFFFSET_MINUTES)

    const user = BOT.users.cache.get(resin.userId)

    console.log(`Scheduling notification for ${user?.username} at ${format(approximateFullAt, "MM/dd/yyyy HH:mm")}`)

    schedule.scheduleJob(approximateFullAt, async function () {
      const updatedResin = await client.resins.findUnique({ where: { userId: resin.userId } })
      if (updatedResin && updatedResin.shouldNotify) {
        const channel = BOT.channels.cache.get(process.env.NOTIFICATION_CHANNEL) as TextBasedChannel

        if (channel) {
          channel.send(`<@${updatedResin.userId}> Your resin is about to be completely refilled!`)
          console.info(`Notifying ${user?.username} that resin is about to be refilled`)
          await client.resins.update({
            where: {
              userId: updatedResin.userId,
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
