import { ActionRowBuilder, Client, CommandInteraction, ChatInputCommandInteraction, ModalBuilder, SlashCommandBuilder, SlashCommandUserOption, TextInputBuilder, TextInputStyle, PermissionFlagsBits } from "discord.js";
import { CreateGameConstants, CreateGameModalConstants } from "../constants/createGame";
import { GlobalConstants } from "../constants/global";
import { AddModal, Modals } from "../modals/_modals";
import { Command } from "./_command";

const command = new SlashCommandBuilder()
    .setName(CreateGameConstants.COMMAND_NAME)
    .setDescription(CreateGameConstants.COMMAND_DESC)
    .addUserOption(option =>option
        .setName(CreateGameConstants.DM_OPTION)
        .setDescription(CreateGameConstants.DM_DESC)
        .setRequired(true))
    .addStringOption(option =>option
        .setName(CreateGameConstants.PRIVACY_OPTION)
        .setDescription(CreateGameConstants.PRIVACY_DESC)
        .setRequired(true)
        .addChoices(
            { name: CreateGameConstants.PRIVACY_OPTION_PUBLIC, value: CreateGameConstants.PRIVACY_OPTION_PUBLIC },
            { name: CreateGameConstants.PRIVACY_OPTION_PRIVATE, value: CreateGameConstants.PRIVACY_OPTION_PRIVATE },
        ))
    .addRoleOption(option =>option
        .setName(CreateGameConstants.ROLE_OPTION)
        .setDescription(CreateGameConstants.ROLE_DESC)
        .setRequired(false))
    .setDefaultMemberPermissions(GlobalConstants.Permissions)
    .setDMPermission(false);

async function execute(client: Client, interaction: ChatInputCommandInteraction) {
    log(interaction)
    await AddModal(client, interaction, CreateGameModalConstants.ID, interaction.id)
}

function log(interaction: ChatInputCommandInteraction){
    const dm = interaction.options.getUser(CreateGameConstants.DM_OPTION)
    const dmId: string = dm?.id || ''
    const dmEmbed: string = dm?.toString() || ''
    const role: string = interaction.options.getRole(CreateGameConstants.ROLE_OPTION)?.name || ''
    const ispublic: boolean = interaction.options.getString(CreateGameConstants.PRIVACY_OPTION) == CreateGameConstants.PRIVACY_OPTION_PUBLIC
    console.log("Command used by " + interaction.user.username + " Command options " + [dmId, role, ispublic].join(", "))
}

export const CreateGame: Command = {
    id: CreateGameConstants.COMMAND_NAME,
    command: command.toJSON(),
    execute: execute
}