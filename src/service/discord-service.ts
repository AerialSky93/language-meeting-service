import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {
  ChannelType,
  Client,
  GatewayIntentBits,
  Guild,
  VoiceChannel,
} from 'discord.js';
import { discordConfig } from '../config/discord.config';

@Injectable()
export class DiscordService implements OnModuleInit {
  private readonly logger = new Logger(DiscordService.name);
  private client: Client;

  async onModuleInit() {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });

    this.client.once('ready', async () => {
      const channelName = 'test2';
      this.logger.log(`Logged in as ${this.client.user?.tag}!`);
      const guild: Guild | undefined = this.client.guilds.cache.get(
        discordConfig.guildId,
      );

      if (!guild) {
        this.logger.warn('Bot is not in that guild!');
        return;
      }

      const existingChannel = guild.channels.cache.find(
        (channel) =>
          channel.name === channelName &&
          channel.type === ChannelType.GuildVoice,
      ) as VoiceChannel | undefined;

      if (existingChannel) {
        this.logger.log(
          `Channel '${channelName}' already exists with ID: ${existingChannel.id}`,
        );
        return;
      } else {
        try {
          const channel: VoiceChannel = (await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildVoice,
            reason: 'Needed a new voice channel',
          })) as VoiceChannel;
          this.logger.log(
            `Created channel ${channel.name} with ID: ${channel.id}`,
          );
        } catch (error) {
          this.logger.error('Error creating channel:', error);
        }
      }
    });
    await this.client.login(discordConfig.clientToken);
  }
}
