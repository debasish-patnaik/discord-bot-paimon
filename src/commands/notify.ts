import { SlashCommandBuilder } from "@discordjs/builders";
import addMinutes from "date-fns/addMinutes";
import format from "date-fns/format";
import { CommandInteraction } from "discord.js";
import schedule from "node-schedule"

import { ICommand } from "../interfaces/command";
import { getClient } from "../utils/getClient";

export const notify: ICommand = {
  data: new SlashCommandBuilder()
    .setName("notify")
    .setDescription("Notify when resin is about to be completely refilled"),

  run: async (interaction: CommandInteraction) => {

    const DEFAULT_TIME_OFFFSET_MINUTES = 5

    await interaction.deferReply()
    const { user, channel } = interaction

    const client = getClient()

    try {
      const resin = await client.resins.findUnique({
        where: {
          userId: user.id,
        }
      })


      if (resin) {
        const lastUpdatedAt = resin.updatedAt
        const minutesRemaining = Math.round((160 - resin.count) / 0.125)
        if (minutesRemaining === 0) {
          await interaction.editReply(`Your resin is already full!`)
          await client.resins.update({
            where: {
              userId: user.id,
            },
            data: {
              shouldNotify: false,
              notifiedAt: new Date(),
            }
          })
          return
        }

        const approximateFullAt = addMinutes(lastUpdatedAt, minutesRemaining)

        if (approximateFullAt < addMinutes(new Date, DEFAULT_TIME_OFFFSET_MINUTES)) {
          await interaction.editReply(`Your resin is almost full!`)
          await client.resins.update({
            where: {
              userId: user.id,
            },
            data: {
              shouldNotify: false,
              notifiedAt: new Date(),
            }
          })
          return
        }

        await client.resins.update({
          where: {
            userId: user.id,
          },
          data: {
            shouldNotify: true,
            notifiedAt: null,
          }
        })


        await interaction.editReply(`You will be notified when resin is about to be completely refilled.`)

        console.log(`Scheduling notification for ${user.username} at ${format(approximateFullAt, "MM/dd/yyyy HH:mm")}`)

        schedule.scheduleJob(approximateFullAt, async function () {
          console.info(`Notifying ${user.username} that resin is about to be refilled`)
          const resin = await client.resins.findUnique({
            where: {
              userId: user.id,
            }
          })
          if (resin && resin.shouldNotify) {
            if (channel) {
              channel.send(`<@${user.id}> Your resin is about to be completely refilled!`)
              console.info(`Notified ${user.username} that resin is about to be refilled`)
              await client.resins.update({
                where: {
                  userId: user.id,
                },
                data: {
                  shouldNotify: false,
                  notifiedAt: new Date(),
                }
              })

            }
          }
        })

      } else {
        await interaction.editReply({
          content: `You don't have a saved resin count. Use the command \`reset\` to update your resin count`,
        })
      }
    } catch (err) {
      console.error(err)
      await interaction.editReply({
        content: `Error setting notifications`,
      })
    }
  }
}