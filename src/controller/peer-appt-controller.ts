import { Controller, Get, Post, Put, Body, Param, HttpException } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { PeerApptService } from "../service/peer-appt-service";
import { PeerApptGetRequest } from "../dto/peer-appt-dto/peer-appt-get-request";
import { PeerApptCreateRequest } from "../dto/peer-appt-dto/peer-appt-create-request";
import { PeerApptUpdateRequest } from "../dto/peer-appt-dto/peer-appt-update-request";
import { PeerApptCreateResponse } from "../dto/peer-appt-dto/peer-appt-create-response";
import { PeerApptGetResponse } from "../dto/peer-appt-dto/peer-appt-get-response";
import { PeerApptUpdateResponse } from "../dto/peer-appt-dto/peer-appt-update-response";

@Controller()
export class PeerApptController {

  constructor(private readonly peerApptService: PeerApptService) {}

  @Post('peer-appt')
  async createPeerAppt(@Body() createPeerApptDto: PeerApptCreateRequest): Promise<PeerApptCreateResponse> {
    try {
      const result = await this.peerApptService.createPeerAppt(createPeerApptDto);
      return result;
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes("Missing") 
        ? StatusCodes.BAD_REQUEST 
        : StatusCodes.INTERNAL_SERVER_ERROR;
      throw new HttpException(
        error instanceof Error ? error.message : "An error occurred",
        statusCode
      );
    }
  }
  
  @Get('peer-appt/:id')
  async getPeerApptById(@Param('id') id: string): Promise<PeerApptGetResponse> {
    try {
      const request: PeerApptGetRequest = {
        peer_appt_id: id,
      };

      const peerAppt = await this.peerApptService.getPeerApptById(request);
      return peerAppt;
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes("not found")
        ? StatusCodes.NOT_FOUND
        : StatusCodes.INTERNAL_SERVER_ERROR;
      throw new HttpException(
        error instanceof Error ? error.message : "An error occurred",
        statusCode
      );
    }
  }

  @Put('peer-appt/:id')
  async updatePeerAppt(
    @Param('id') id: string,
    @Body() updatePeerApptDto: PeerApptUpdateRequest
  ): Promise<PeerApptUpdateResponse> {
    try {
      // Set the ID from the URL parameter into the request DTO
      updatePeerApptDto.peer_appt_id = id;
      
      const peerAppt = await this.peerApptService.updatePeerAppt(updatePeerApptDto);
      return peerAppt;
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes("not found")
        ? StatusCodes.NOT_FOUND
        : StatusCodes.INTERNAL_SERVER_ERROR;
      throw new HttpException(
        error instanceof Error ? error.message : "An error occurred",
        statusCode
      );
    }
  }
}
