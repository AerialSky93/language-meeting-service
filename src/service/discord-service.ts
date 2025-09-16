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
import { DiscordChannelCreateResponse } from 'src/dto/discord-dto/discord-channel-create-response';
import { DiscordCategoryCreateResponse } from 'src/dto/discord-dto/discord-category-create-response';

@Injectable()
export class DiscordService implements OnModuleInit {
  private readonly logger = new Logger(DiscordService.name);
  private client: Client;
  private guild: Guild;

  async onModuleInit() {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    this.client.once('ready', async () => {
      this.logger.log(`Logged in as ${this.client.user?.tag}!`);
      const guidValue = this.client.guilds.cache.get(discordConfig.guildId);
      if (!guidValue) {
        this.logger.warn('Bot is not in this channel guild!');
        return;
      } else {
        this.guild = guidValue;
      }
      await true; //this.createAllChannels();
    });
    await this.client.login(discordConfig.clientToken);
  }

  public async createChannel(
    channelName: string,
  ): Promise<DiscordChannelCreateResponse> {
    const existingChannel = this.guild.channels.cache.find(
      (channel) => channel.name === channelName,
    ) as VoiceChannel | undefined;
    if (existingChannel) {
      this.logger.log(
        `Channel '${channelName}' already exists with ID: ${existingChannel.id}`,
      );
      const discordChannelCreateResponse: DiscordChannelCreateResponse = {
        discord_channel_id: existingChannel.id,
        discord_channel_name: existingChannel.name,
      };
      return discordChannelCreateResponse;
    }
    try {
      const channel: VoiceChannel = (await this.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildVoice,
        reason: `Creating voice channel for ${channelName}`,
      })) as VoiceChannel;

      const discordChannelCreateResponse: DiscordChannelCreateResponse = {
        discord_channel_id: channel.id,
        discord_channel_name: channel.name,
      };
      this.logger.log(`Created channel ${channel.name} with ID: ${channel.id}`);
      return discordChannelCreateResponse;
    } catch (error) {
      this.logger.error(`Error creating channel '${channelName}':`, error);
      throw new Error(
        `Failed to create channel '${channelName}': ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  public async createAllChannels(): Promise<void> {
    this.logger.log('Starting to create Discord channels...');
    const createChannelPromises = DISCORD_CHANNELS.map((channelConfig) =>
      this.createChannel(channelConfig.discordChannelName + '-Korean'),
    );
    await Promise.all(createChannelPromises);
    this.logger.log('Finished creating Discord channels.');
  }

  public async recreateChannelName(channelName: string): Promise<void> {
    try {
      const channels = this.guild.channels.cache.filter(
        (ch) => ch.name === channelName,
      );
      if (channels == null || channels.size === 0) {
        this.logger.warn(`No voice channels found with name '${channelName}'`);
        return;
      }
      const deleteChannelPromises = Array.from(channels.values()).map(
        async (channel) => {
          try {
            const voiceChannel = channel as VoiceChannel;
            await voiceChannel.delete(
              `Deleting all channels with name ${channelName}`,
            );
            this.logger.log(
              `Deleted channel '${channelName}' with ID: ${voiceChannel.id}`,
            );
          } catch (error) {
            this.logger.error(
              `Error deleting channel '${channelName}' with ID ${channel.id}:`,
              error,
            );
          }
        },
      );
      await Promise.all(deleteChannelPromises);
      await this.createChannel(channelName);
    } catch (error) {
      this.logger.error(
        `Error deleting channels with name '${channelName}':`,
        error,
      );
    }
  }

  public async recreateAllChannels(): Promise<void> {
    const recreateChannelPromises = DISCORD_CHANNELS.map((channelConfig) =>
      this.recreateChannelName(channelConfig.discordChannelName),
    );
    await Promise.all(recreateChannelPromises);
    this.logger.log('Finished creating Discord channels.');
  }

  public async deleteChannelName(channelName: string): Promise<void> {
    try {
      const channels = this.guild.channels.cache.filter(
        (ch) => ch.name === channelName,
      );
      if (channels == null || channels.size === 0) {
        this.logger.warn(`No voice channels found with name '${channelName}'`);
        return;
      }
      const deleteChannelPromises = Array.from(channels.values()).map(
        async (channel) => {
          try {
            const voiceChannel = channel as VoiceChannel;
            await voiceChannel.delete(
              `Deleting all channels with name ${channelName}`,
            );
            this.logger.log(
              `Deleted channel '${channelName}' with ID: ${voiceChannel.id}`,
            );
          } catch (error) {
            this.logger.error(
              `Error deleting channel '${channelName}' with ID ${channel.id}:`,
              error,
            );
          }
        },
      );
      await Promise.all(deleteChannelPromises);
    } catch (error) {
      this.logger.error(
        `Error deleting channels with name '${channelName}':`,
        error,
      );
    }
  }
  public async deleteAllChannelNames(): Promise<void> {
    const deleteChannelPromises = DISCORD_CHANNELS.map((channelConfig) =>
      this.deleteChannelName(channelConfig.discordChannelName),
    );
    await Promise.all(deleteChannelPromises);
    this.logger.log('Finished deleting Discord channels.');
  }

  public async createCategory(
    categoryName: string,
  ): Promise<DiscordCategoryCreateResponse> {
    try {
      const category = await this.guild.channels.create({
        name: categoryName,
        type: ChannelType.GuildCategory,
      });
      const discordCategoryCreateResponse: DiscordCategoryCreateResponse = {
        discord_category_id: category.id,
        discord_category_name: category.name,
      };
      this.logger.log(
        `Created category ${categoryName} with ID: ${category.id}`,
      );
      return discordCategoryCreateResponse;
    } catch (error) {
      this.logger.error(`Error creating category '${categoryName}':`, error);
      throw new Error(
        `Failed to create category '${categoryName}': ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }
}
