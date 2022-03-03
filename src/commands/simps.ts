import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import { ICommand } from "../interfaces/command";

export const assemble: ICommand = {
  data: new SlashCommandBuilder()
    .setName("simps")
    .setDescription("Simps! Assemble!"),
  run: async (interaction: CommandInteraction) => {
    const guild = interaction.guild
    let message
    const mentionedRoles: string[] = []
    if (guild) {
      const simpsRole = guild.roles.cache.find(role => role.name === "simps")
      if (simpsRole) {
        message = `<@&${simpsRole?.id}> Assemble!`
        mentionedRoles.push(simpsRole.id)
      }
    } else {
      message = "Assemble!"
    }

    await interaction.reply({
      content: message,
      allowedMentions: { roles: mentionedRoles },
    })
  }
}