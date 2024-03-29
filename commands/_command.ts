import { Client, RESTPostAPIChatInputApplicationCommandsJSONBody, ChatInputCommandInteraction } from "discord.js";

export interface Command
{
    id: string,
    command: RESTPostAPIChatInputApplicationCommandsJSONBody,
    execute: (client:Client, interaction: ChatInputCommandInteraction) => void;
}