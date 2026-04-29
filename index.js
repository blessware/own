const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  EmbedBuilder
} = require('discord.js');

require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const ROLE_ID = process.env.ROLE_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

client.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const channel = await client.channels.fetch(CHANNEL_ID);

  // 🧱 Embed (grey line)
  const embed = new EmbedBuilder()
    .setTitle('BORDER LINE')
    .setDescription('@crueliant')
    .setColor(0x2f3136); // Discord dark grey

  const button = new ButtonBuilder()
    .setCustomId('access_button')
    .setLabel('ACCESS')
    .setStyle(ButtonStyle.Secondary); // grey button

  const row = new ActionRowBuilder().addComponents(button);

  // 🚫 Prevent duplicate message
  const messages = await channel.messages.fetch({ limit: 10 });
  const alreadySent = messages.find(msg =>
    msg.author.id === client.user.id &&
    msg.embeds.length > 0
  );

  if (!alreadySent) {
    await channel.send({
      embeds: [embed],
      components: [row]
    });
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'access_button') {
    const member = interaction.member;

    if (member.roles.cache.has(ROLE_ID)) {
      return interaction.reply({
        content: 'Already granted.',
        ephemeral: true
      });
    }

    await member.roles.add(ROLE_ID);

    await interaction.reply({
      content: 'Access granted.',
      ephemeral: true
    });
  }
});

client.login(process.env.TOKEN);
