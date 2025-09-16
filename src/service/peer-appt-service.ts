import { PeerApptRepository } from '../repository/peer-appt-repository';
import type { PeerApptGetRequest } from '../dto/peer-appt-dto/peer-appt-get-request';
import type { PeerApptGetResponse } from '../dto/peer-appt-dto/peer-appt-get-response';
import type { PeerApptCreateRequest } from '../dto/peer-appt-dto/peer-appt-create-request';
import type { PeerApptCreateResponse } from '../dto/peer-appt-dto/peer-appt-create-response';
import type { PeerApptUpdateRequest } from '../dto/peer-appt-dto/peer-appt-update-request';
import type { PeerApptUpdateResponse } from '../dto/peer-appt-dto/peer-appt-update-response';
import type { PeerApptSearchRequest } from '../dto/peer-appt-dto/peer-appt-search-request';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PeerApptService {
  constructor(private readonly peerApptRepository: PeerApptRepository) {}

  public async createPeerAppt(
    peerApptData: PeerApptCreateRequest,
  ): Promise<PeerApptCreateResponse> {
    try {
      return await this.peerApptRepository.createPeerAppt(peerApptData);
    } catch (error) {
      throw new Error(
        `Failed to create peer appointment scheduled: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  public async createPeerApptNow(
    peerApptData: PeerApptCreateRequest,
  ): Promise<PeerApptCreateResponse> {
    try {
      return await this.peerApptRepository.createPeerAppt(peerApptData);
    } catch (error) {
      throw new Error(
        `Failed to create peer appointment now: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  public async getPeerApptById(
    request: PeerApptGetRequest,
  ): Promise<PeerApptGetResponse> {
    const peerAppt = await this.peerApptRepository.getPeerApptById(request);
    if (!peerAppt) {
      throw new Error('Peer appointment not found');
    }

    return peerAppt;
  }

  public async updatePeerAppt(
    request: PeerApptUpdateRequest,
  ): Promise<PeerApptUpdateResponse> {
    const peerAppt = await this.peerApptRepository.updatePeerAppt(request);
    if (!peerAppt) {
      throw new Error('Peer appointment not found');
    }

    return peerAppt;
  }

  public async searchPeerApptsByTopicAndLanguage(
    request: PeerApptSearchRequest,
  ): Promise<PeerApptGetResponse[]> {
    try {
      return await this.peerApptRepository.searchPeerApptsByTopicAndLanguage(
        request,
      );
    } catch (error) {
      throw new Error(
        `Failed to search peer appointments: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }
}
