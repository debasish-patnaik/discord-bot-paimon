import { SlashCommandBuilder } from "@discordjs/builders";
import addMinutes from "date-fns/addMinutes";
import { CommandInteraction, TextBasedChannel } from "discord.js";

import { ICommand } from "../interfaces";
import { BOT, getClient, scheduleJob, DEFAULT_TIME_OFFFSET_MINUTES } from "../utils";

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


      const minutesRemaining = Math.round((160 - count) / 0.125)
      const approximateFullAt = addMinutes(currentDate, minutesRemaining - DEFAULT_TIME_OFFFSET_MINUTES)
      scheduleJob(user.id, approximateFullAt, async function () {
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

