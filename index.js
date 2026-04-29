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

  // DND status
  client.user.setPresence({
    status: "dnd",
    activities: [{
      name: "own",
      type: ActivityType.Custom
    }]
  });

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel) return console.log("Channel not found.");

    const embed = new EmbedBuilder()
      .setTitle('**BORDER LINE**')
      .setDescription('@crueliant')
      .setColor(0x2f3136); // grey line

    const button = new ButtonBuilder()
      .setCustomId('access_button')
      .setLabel('**ACCESS**')
      .setStyle(ButtonStyle.Secondary); // grey button

    const row = new ActionRowBuilder().addComponents(button);

    // 🚫 Prevent duplicate message
    const messages = await channel.messages.fetch({ limit: 5 });
    const exists = messages.find(
      m => m.author.id === client.user.id && m.components.length > 0
    );

    if (!exists) {
      await channel.send({
        embeds: [embed],
        components: [row]
      });
      console.log("Access message sent.");
    } else {
      console.log("Message already exists.");
    }

  } catch (err) {
    console.error("Startup error:", err);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'access_button') {
    try {
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

    } catch (err) {
      console.error("Button error:", err);
    }
  }
});

client.login(process.env.TOKEN);
