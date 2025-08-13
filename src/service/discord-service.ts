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
  private guild: Guild | undefined;

  async onModuleInit() {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.client.once('ready', async () => {
      this.logger.log(`Logged in as ${this.client.user?.tag}!`);
      this.guild = this.client.guilds.cache.get(discordConfig.guildId);
      if (!this.guild) {
        this.logger.warn('Bot is not in this channel guild!');
        return;
      }
      await this.recreateAllChannels();
    });
    await this.client.login(discordConfig.clientToken);
  }

  private async createChannel(guild: Guild, channelName: string) {
    const existingChannel = guild.channels.cache.find(
      (channel) => channel.name === channelName,
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

  public async createAllChannels(guild: Guild) {
    this.logger.log('Starting to create Discord channels...');
    for (const channelConfig of DISCORD_CHANNELS) {
      await this.createChannel(guild, channelConfig.discordChannelName);
    }
    this.logger.log('Finished creating Discord channels.');
  }

  public async recreateChannelName(channelName: string): Promise<number> {
    try {
      if (!this.guild) {
        this.logger.warn('Bot is not in the channel guild');
        return 0;
      }
      const channels = this.guild.channels.cache.filter(
        (ch) => ch.name === channelName,
      );

      if (channels == null || channels.size === 0) {
        this.logger.warn(`No voice channels found with name '${channelName}'`);
        return 0;
      }

      let deletedCount = 0;
      for (const channel of channels.values()) {
        try {
          const voiceChannel = channel as VoiceChannel;
          await voiceChannel.delete(
            `Deleting all channels with name ${channelName}`,
          );
          this.logger.log(
            `Deleted channel '${channelName}' with ID: ${voiceChannel.id}`,
          );
          deletedCount++;
        } catch (error) {
          this.logger.error(
            `Error deleting channel '${channelName}' with ID ${channel.id}:`,
            error,
          );
        }
      }
      this.logger.log(
        `Successfully deleted ${deletedCount} channels with name '${channelName}'`,
      );
      await this.createChannel(this.guild, channelName);
      return deletedCount;
    } catch (error) {
      this.logger.error(
        `Error deleting channels with name '${channelName}':`,
        error,
      );
      return 0;
    }
  }

  public async recreateAllChannels() {
    for (const channelConfig of DISCORD_CHANNELS) {
      await this.recreateChannelName(channelConfig.discordChannelName);
    }
    this.logger.log('Finished creating Discord channels.');
  }
}
