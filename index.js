import {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ActivityType
} from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  partials: [Partials.Channel]
});

// 🔑 CONFIG (EDIT THESE)
const TOKEN = process.env.TOKEN;
const CHANNEL_ID = "YOUR_CHANNEL_ID";
const ROLE_ID = "YOUR_ROLE_ID";

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  // DND status
  client.user.setPresence({
    status: "dnd",
    activities: [{
      name: "own",
      type: ActivityType.Custom
    }]
  });

  const channel = await client.channels.fetch(CHANNEL_ID);

  // Button
  const button = new ButtonBuilder()
    .setCustomId("access_button")
    .setLabel("+*ACCESS**")
    .setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder().addComponents(button);

  // Embed (clean look like yours)
  const embed = new EmbedBuilder()
    .setColor("#2b2d31") // grey line
    .setTitle("**BORDER LINE**")
    .setDescription("@crueliant");

  // Send ONLY ONCE (prevents spam on restart)
  const messages = await channel.messages.fetch({ limit: 10 });
  const alreadyExists = messages.some(m =>
    m.author.id === client.user.id &&
    m.embeds[0]?.title === "BORDER LINE"
  );

  if (!alreadyExists) {
    await channel.send({
      embeds: [embed],
      components: [row]
    });
  }
});

// 🔘 BUTTON HANDLER (FIXES YOUR ERROR)
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "access_button") {
    try {
      const member = interaction.member;

      await member.roles.add(ROLE_ID);

      await interaction.reply({
        content: "Access granted.",
        ephemeral: true
      });

    } catch (err) {
      console.error(err);

      if (!interaction.replied) {
        await interaction.reply({
          content: "Error giving role.",
          ephemeral: true
        });
      }
    }
  }
});

client.login(TOKEN);
