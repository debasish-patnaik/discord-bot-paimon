import { SlashCommandBuilder } from "@discordjs/builders";
import differenceInMinutes from "date-fns/differenceInMinutes"
import { CommandInteraction } from "discord.js";

import { ICommand } from "../interfaces/command";
import { getClient } from "../utils/getClient";


export const resin: ICommand = {
  data: new SlashCommandBuilder()
    .setName("resin")
    .setDescription("Shows current resin count"),

  run: async (interaction: CommandInteraction) => {
    await interaction.deferReply()
    const { user } = interaction

    const client = getClient()

    try {
      const resin = await client.resins.findUnique({
        where: {
          userId: user.id,
        }
      })

      // rate of resin per minute
      const RESIN_RATE = 0.125

      if (resin) {
        // update the resin count
        // new resin count = old resin count + time * rate

        let newCount = resin.resinCount + differenceInMinutes(new Date(), resin.updatedAt) * RESIN_RATE
        if (newCount > 160) {
          newCount = 160
        }

        // update the resin count
        await client.resins.update({
          where: {
            userId: user.id,
          },
          data: {
            resinCount: newCount,
          }
        })

        await interaction.editReply({
          content: `Your current resin count: ${newCount}`,
        })
      } else {
        await interaction.editReply({
          content: `You have no resin count. Use the command \`reset\` to update your resin count`,
        })
      }

    } catch (err) {
      await interaction.editReply({
        content: `Error fetching resin count`,
      })
    }
  }
}

