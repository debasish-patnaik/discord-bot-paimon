import addMinutes from "date-fns/addMinutes"
import format from "date-fns/format"
import { TextBasedChannel } from "discord.js"
import {
  Job,
  JobCallback,
  scheduleJob as nodeScheduleJob,
} from "node-schedule"

import { getClient } from "./getClient"
import { BOT } from "./getDiscordClient"

const NOTIFICATION_MAP: Record<string, Job | undefined> = {}

export function scheduleJob(userId: string, when: Date, job: JobCallback) {
  const user = BOT.users.cache.get(userId)

  console.info(`Scheduling notification for ${user?.username || userId} at ${format(when, "MM/dd/yyyy HH:mm")}`)
  const currentJob = nodeScheduleJob(when, job)

  // cancel last scheduled job
  const lastJob = NOTIFICATION_MAP[userId]
  if (lastJob) {
    console.info(`Cancelling previous notification for ${user?.username || userId}`)
    lastJob.cancel()
  }

  // update the map
  NOTIFICATION_MAP[userId] = currentJob
}

export async function initNotifications() {
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

    scheduleJob(resin.userId, approximateFullAt, async function () {
      const updatedResin = await client.resins.findUnique({ where: { userId: resin.userId } })
      if (updatedResin && updatedResin.shouldNotify) {
        const channel = BOT.channels.cache.get(process.env.NOTIFICATION_CHANNEL) as TextBasedChannel

        if (channel) {
          console.info(`Notifying ${user?.username} that resin is about to be refilled`)
          channel.send(`<@${updatedResin.userId}> Your resin is about to be completely refilled!`)
          await client.resins.update({
            where: {
              userId: updatedResin.userId,
            },
            data: {
              shouldNotify: false,
              notifiedAt: new Date()
            }
          })
        } else {
          console.error(`Could not find notification channel ${process.env.NOTIFICATION_CHANNEL}`)
        }
      }
    })
  })
} 