import { IsString, IsNotEmpty } from 'class-validator';

export class DiscordChannelCreateRequest {
  @IsString()
  @IsNotEmpty({ message: 'Discord channel name is required' })
  discord_channel_name: string;
}
