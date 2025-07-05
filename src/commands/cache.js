import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('cache')
    .setDescription('View or manage audio cache')
    .addStringOption(option =>
        option.setName('action')
            .setDescription('Action to perform')
            .setRequired(false)
            .addChoices(
                { name: 'View cache info', value: 'info' },
                { name: 'Clear cache', value: 'clear' }
            ));

export async function execute(interaction, client) {
    const action = interaction.options.getString('action') || 'info';
    const queue = client.queues.get(interaction.guildId);
    
    if (!queue) {
        return interaction.reply({ content: 'No active queue for this server.', ephemeral: true });
    }
    
    if (action === 'clear') {
        queue.preloader.clearCache();
        await interaction.reply('✅ Audio cache has been cleared!');
    } else {
        const cacheInfo = queue.preloader.getCacheInfo();
        
        if (cacheInfo.length === 0) {
            return interaction.reply({ content: 'Cache is empty.', ephemeral: true });
        }
        
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('🗄️ Audio Cache Information')
            .setDescription(`Cached songs: **${cacheInfo.length}**`)
            .addFields(
                cacheInfo.map((info, index) => ({
                    name: `Song ${index + 1}`,
                    value: `Size: ${info.size}`,
                    inline: true
                }))
            )
            .setFooter({ text: 'Cache helps reduce loading time and prevent audio issues' });
        
        await interaction.reply({ embeds: [embed] });
    }
}