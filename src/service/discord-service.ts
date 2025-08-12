

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Client, GatewayIntentBits, Guild, TextChannel } from 'discord.js';
import { discordConfig } from '../config/discord.config';

@Injectable()
export class DiscordService implements OnModuleInit {
  private readonly logger = new Logger(DiscordService.name);
  private client: Client;

  async onModuleInit() {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });

    this.client.once('ready', async () => {
      this.logger.log(`Logged in as ${this.client.user?.tag}!`);

      const guild: Guild | undefined = this.client.guilds.cache.get(discordConfig.guildId);

      if (!guild) {
        this.logger.warn("Bot is not in that guild!");
        return;
      }

      try {
        const channel: TextChannel = await guild.channels.create({
          name: 'new-channel-name',
          type: 0, // text channel
          reason: 'Needed a new text channel',
        }) as TextChannel;

        this.logger.log(`Created channel ${channel.name}`);
      } catch (error) {
        this.logger.error('Error creating channel:', error);
      }
    });

    await this.client.login(discordConfig.clientToken);
  }
}
