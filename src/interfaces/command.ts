import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders"
import { CommandInteraction } from "discord.js"

export interface ICommand {
  data:
    | Omit<SlashCommandBuilder, "addSubCommandGroup" | "addSubcommand">
    | SlashCommandSubcommandsOnlyBuilder
  run: (interaction: CommandInteraction) => Promise<void>
}
