import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {
  ChannelType,
  Client,
  GatewayIntentBits,
  Guild,
  VoiceChannel,
} from 'discord.js';
import { discordConfig } from '../config/discord.config';
import { DISCORD_CHANNELS } from '../const/discord-channel-names';

@Injectable()
export class DiscordService implements OnModuleInit {
  private readonly logger = new Logger(DiscordService.name);
  private client: Client;

  async onModuleInit() {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });

    this.client.once('ready', async () => {
      this.logger.log(`Logged in as ${this.client.user?.tag}!`);
      const guild: Guild | undefined = this.client.guilds.cache.get(
        discordConfig.guildId,
      );

      if (!guild) {
        this.logger.warn('Bot is not in that guild!');
        return;
      }

      // Create all channels in a loop
      await this.createAllChannels(guild);
    });
    await this.client.login(discordConfig.clientToken);
  }

  private async createAllChannels(guild: Guild) {
    this.logger.log('Starting to create Discord channels...');
    for (const channelConfig of DISCORD_CHANNELS) {
      await this.createChannel(guild, channelConfig.discordChannelName);
    }
    this.logger.log('Finished creating Discord channels.');
  }

  private async createChannel(guild: Guild, channelName: string) {
    const existingChannel = guild.channels.cache.find(
      (channel) =>
        channel.name === channelName && channel.type === ChannelType.GuildVoice,
    ) as VoiceChannel | undefined;

    if (existingChannel) {
      this.logger.log(
        `Channel '${channelName}' already exists with ID: ${existingChannel.id}`,
      );
      return;
    }

    try {
      const channel: VoiceChannel = (await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildVoice,
        reason: `Creating voice channel for ${channelName}`,
      })) as VoiceChannel;

      this.logger.log(`Created channel ${channel.name} with ID: ${channel.id}`);
    } catch (error) {
      this.logger.error(`Error creating channel '${channelName}':`, error);
    }
  }
}
