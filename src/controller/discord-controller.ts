import { Controller, Post, Body, Res, HttpException } from '@nestjs/common';
import { DiscordService } from '../service/discord-service';
import { DiscordChannelCreateRequest } from 'src/dto/discord-dto/discord-channel-create-request';
import { StatusCodes } from 'http-status-codes';
import { DiscordChannelCreateResponse } from 'src/dto/discord-dto/discord-channel-create-response';

@Controller('discord')
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @Post('create-channel')
  async createChannel(
    @Body() body: DiscordChannelCreateRequest,
  ): Promise<DiscordChannelCreateResponse> {
    try {
      const discordResponse = await this.discordService.createChannel(
        body.discord_channel_name,
      );
      return discordResponse;
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message.includes('not found')
          ? StatusCodes.NOT_FOUND
          : StatusCodes.INTERNAL_SERVER_ERROR;
      throw new HttpException(
        error instanceof Error ? error.message : 'An error occurred',
        statusCode,
      );
    }
  }
}
