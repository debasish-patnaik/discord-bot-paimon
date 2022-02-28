import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import { ICommand } from "../interfaces/command";
import { getClient } from "../utils/getClient";


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
      await client.resins.upsert({
        where: {
          userId: user.id,
        },
        update: {
          resinCount: count
        },
        create: {
          userId: user.id,
          resinCount: count,
        }
      })

      await interaction.editReply({
        content: `Resetting resin count to ${count}`,
      })
    } catch (err) {
      await interaction.editReply({
        content: `Error resetting resin count to ${count}`,
      })
    }
  }
}

