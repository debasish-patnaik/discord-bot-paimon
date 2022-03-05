import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import { ICommand } from "../interfaces";
import { getClient } from "../utils";



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
          shouldNotify: false,
          notifiedAt: null,
        },
        create: {
          userId: user.id,
          count: count,
          createdAt: currentDate,
          updatedAt: currentDate,
        }
      })

      await interaction.editReply({
        content: `Resetting resin count to ${count}`,
      })
    } catch (err) {
      console.error(err)
      await interaction.editReply({
        content: `Error resetting resin count to ${count}`,
      })
    }
  }
}

