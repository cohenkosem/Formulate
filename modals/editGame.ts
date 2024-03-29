import { ActionRowBuilder, Client, Interaction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { CreateGameModalConstants, EditGameModalConstants } from "../constants/createGame";
import { GlobalConstants } from "../constants/global";
import { Modal } from "./_modal";
import { getGameValues, editGameEmbed } from "../functions/CreateGame/gameEmbed";

function GetModal(client: Client, interaction: Interaction, id?: string) {
    if (interaction.isButton()){
        const values = getGameValues(interaction.message)
        const modal = new ModalBuilder()
            .setCustomId(EditGameModalConstants.ID+ GlobalConstants.ID_SEPARATOR +id)
            .setTitle(EditGameModalConstants.MODAL_TITLE)

        const gameName = new TextInputBuilder()
            .setCustomId(CreateGameModalConstants.NAME_ID)
            .setLabel(CreateGameModalConstants.NAME_LABEL)
            .setStyle(TextInputStyle.Short)
            .setValue(values.shift()!)

        const gameDescription = new TextInputBuilder()
            .setCustomId(CreateGameModalConstants.DESC_ID)
            .setLabel(CreateGameModalConstants.DESC_LABEL)
            .setStyle(TextInputStyle.Paragraph)
            .setValue(values.shift()!)

        //DM
        values.shift()

        const gameTemplate = new TextInputBuilder()
            .setCustomId(CreateGameModalConstants.TEMPLATE_ID)
            .setLabel(CreateGameModalConstants.TEMPLATE_LABEL)
            .setStyle(TextInputStyle.Paragraph)
            .setValue(values.shift()!)

        const applicationQuestion = new TextInputBuilder()
            .setCustomId(CreateGameModalConstants.QUESTIONS_ID)
            .setLabel(CreateGameModalConstants.QUESTIONS_LABEL)
            .setStyle(TextInputStyle.Paragraph)
            .setValue(values.shift()!)

        const rows = [
            new ActionRowBuilder().addComponents(gameName) as ActionRowBuilder<TextInputBuilder>,
            new ActionRowBuilder().addComponents(gameDescription) as ActionRowBuilder<TextInputBuilder>,
            new ActionRowBuilder().addComponents(gameTemplate) as ActionRowBuilder<TextInputBuilder>,
            new ActionRowBuilder().addComponents(applicationQuestion) as ActionRowBuilder<TextInputBuilder>]
        modal.addComponents(rows)
        return Promise.resolve(modal)
    }
    return Promise.resolve(null)
}

async function SubmitModal(client: Client, interaction: Interaction, modalId: string) {
    if (interaction.isButton()){
        const submitted = await interaction.awaitModalSubmit({
            time: 60000 * 10,
            filter: i => i.user.id === interaction.user.id 
            && i.customId === modalId
            && i.customId.split(GlobalConstants.ID_SEPARATOR).length > 1 
            && i.customId.split(GlobalConstants.ID_SEPARATOR)[1] == interaction.user.id,
        }).catch(error => {
            console.error(error)
            return null
        })
        if (submitted) {
            try {
                log(interaction)
                const name = submitted.fields.getTextInputValue(CreateGameModalConstants.NAME_ID)
                const desc = submitted.fields.getTextInputValue(CreateGameModalConstants.DESC_ID)
                const template = submitted.fields.getTextInputValue(CreateGameModalConstants.TEMPLATE_ID)
                const questions = submitted.fields.getTextInputValue(CreateGameModalConstants.QUESTIONS_ID)

                await editGameEmbed(interaction.message, name, desc, template, questions)

                await submitted.reply({
                    content: EditGameModalConstants.REPLY,
                    ephemeral: true
                })
            }
            catch (e) {
                console.error(e)
            }
        }
    }
}

function log(interaction: Interaction){
    console.log("Game edited by "+interaction.user.username)
}

export const EditGame: Modal = {
    id: EditGameModalConstants.ID,
    getModal: GetModal,
    sumbitModal: SubmitModal
}

