import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction, MessageEmbed } from "discord.js"

import { ICommand } from "../interfaces"

export const help: ICommand = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get information on how `Paimon` can help you."),
  run: async (interaction: CommandInteraction) => {
    await interaction.deferReply()

    const helpEmbed = new MessageEmbed()
    helpEmbed.setTitle("Paimon - Your Friendly Travel Companion")
    helpEmbed.setDescription(
      "Paimon is your travel companion. It helps you tackle the tough decisions you have to take while exploring Teyvat.",
    )
    helpEmbed.addField(
      "Assemble your friends for an epic journey through Teyvat",
      "Tired of doing the domain runs alone? Use `/simps` to assemble your friends and start your adventure.",
    )

    helpEmbed.addField(
      "Check your current resin count (🌙)",
      "Are you worried that your resin is full and can't focus on your work? Don't worry, your buddy Paimon got your back, just use `/resin` to check your current resin count and plan your day accordingly.",
    )

    helpEmbed.addField(
      "Reset your resin count (🌙)",
      "Back from an adventure? Update your resin count by using `/reset {currentResin}` to set your current resin count.",
    )

    helpEmbed.addField(
      "Notify when resin is almost full (🌙)",
      "Traveller, wake up!! Your resin is almost full. Use `/notify` to be notified when your resin is almost full.",
    )

    helpEmbed.addField(
      "Check Domain Rotations",
      "Want to check whether you can upgrade your character / weapon today? Use `/domain` to get the latest domain rotation information.",
    )

    interaction.editReply({ embeds: [helpEmbed] })
  },
}
