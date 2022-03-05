import { SlashCommandBuilder } from "@discordjs/builders";
import addMinutes from "date-fns/addMinutes";
import { CommandInteraction, TextBasedChannel } from "discord.js";
import schedule from "node-schedule"

import { ICommand } from "../interfaces";
import { BOT, getClient, getScheduledNoficationForUser, setScheduleNotificationForUser } from "../utils";

const DEFAULT_TIME_OFFFSET_MINUTES = 5

export const reset: ICommand = {
  data: new SlashCommandBuilder()
    .setName("reset")
    .setDescription("Reset current resin count")
    .addIntegerOption((option) =>
      option
        .setName("count")
        .setDescription("Optional resin count to reset to")
    ),

  run: async (interaction: CommandInteraction) => {
    await interaction.deferReply()
    const { user } = interaction
    const count = interaction.options.getInteger("count") ?? 0

    const client = getClient()

    try {
      const currentDate = new Date()
      await client.resins.upsert({
        where: {
          userId: user.id,
        },
        update: {
          count: count,
          updatedAt: currentDate,
          shouldNotify: true,
          notifiedAt: null,
        },
        create: {
          userId: user.id,
          count: count,
          createdAt: currentDate,
          updatedAt: currentDate,
          shouldNotify: true,
        }
      })


      const minutesRemaining = Math.round(160 - count / 0.125)
      const approximateFullAt = addMinutes(currentDate, minutesRemaining - DEFAULT_TIME_OFFFSET_MINUTES)
      const notifyJob = schedule.scheduleJob(approximateFullAt, async function () {
        const channel = BOT.channels.cache.get(process.env.NOTIFICATION_CHANNEL) as TextBasedChannel

        if (channel) {
          console.info(`Notifying ${user.username} that resin is about to be refilled`)
          channel.send(`<@${user.id}> Your resin is about to be completely refilled!`)
          await client.resins.update({
            where: {
              userId: user.id,
            },
            data: {
              shouldNotify: false,
              notifiedAt: new Date()
            }
          })
        } else {
          console.error(`Could not find notification channel ${process.env.NOTIFICATION_CHANNEL}`)
        }
      })

      // cancel previous notification job, if any
      const previousJob = getScheduledNoficationForUser(user.id)
      if (previousJob) {
        previousJob.cancel()
      }

      // update resin notification job
      setScheduleNotificationForUser(user.id, notifyJob)

      await interaction.editReply({
        content: `Resetting resin count to ${count}.\nYou will be notified when resin is about to be completely refilled.`,
      })
    } catch (err) {
      console.error(err)
      await interaction.editReply({
        content: `Error resetting resin count to ${count}`,
      })
    }
  }
}

