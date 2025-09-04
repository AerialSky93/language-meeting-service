import { Test, TestingModule } from '@nestjs/testing';
import { PeerApptService } from './peer-appt-service';
import { PeerApptRepository } from '../repository/peer-appt-repository';
import type {
  PeerApptCreateRequest,
  PeerApptCreateResponse,
  PeerApptGetRequest,
  PeerApptGetResponse,
  PeerApptUpdateRequest,
  PeerApptUpdateResponse,
  PeerApptSearchRequest,
} from '../dto';

describe('PeerApptService', () => {
  let service: PeerApptService;
  let repository: jest.Mocked<PeerApptRepository>;

  beforeEach(async () => {
    const mockRepository = {
      createPeerAppt: jest.fn(),
      getPeerApptById: jest.fn(),
      updatePeerAppt: jest.fn(),
      searchPeerApptsByTopicAndLanguage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeerApptService,
        {
          provide: PeerApptRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PeerApptService>(PeerApptService);
    repository = module.get(PeerApptRepository);
    jest.clearAllMocks();
  });

  describe('createPeerAppt', () => {
    it('should create a peer appointment successfully', async () => {
      const mockRequest: PeerApptCreateRequest = {
        conversation_topic_id: 1,
        language_global_id: 2,
        user_account_requestor_id: '123e4567-e89b-12d3-a456-426614174000',
        peer_appt_description: 'Test appointment',
        peer_appt_minute_duration: 30,
        peer_appt_start_datetime: '2024-01-15T10:00:00Z',
        peer_appt_max_people: 2,
        peer_appt_location: 'Online',
      };

      const mockResponse: PeerApptCreateResponse = {
        peer_appt_id: 'appt-123',
      };

      repository.createPeerAppt.mockResolvedValueOnce(mockResponse);

      const result = await service.createPeerAppt(mockRequest);

      expect(repository.createPeerAppt).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when repository fails to create appointment', async () => {
      const mockRequest: PeerApptCreateRequest = {
        conversation_topic_id: 1,
        language_global_id: 2,
        user_account_requestor_id: '123e4567-e89b-12d3-a456-426614174000',
        peer_appt_description: 'Test appointment',
        peer_appt_minute_duration: 30,
        peer_appt_start_datetime: '2024-01-15T10:00:00Z',
        peer_appt_max_people: 2,
        peer_appt_location: 'Online',
      };

      const repositoryError = new Error('Database connection failed');
      repository.createPeerAppt.mockRejectedValueOnce(repositoryError);

      await expect(service.createPeerAppt(mockRequest)).rejects.toThrow(
        'Failed to create peer appointment: Database connection failed',
      );
    });
  });

  describe('getPeerApptById', () => {
    it('should return peer appointment when found', async () => {
      const mockRequest: PeerApptGetRequest = {
        peer_appt_id: 'appt-123',
      };

      const mockResponse: PeerApptGetResponse = {
        peer_appt_id: 'appt-123',
        conversation_topic_id: 1,
        conversation_topic_name: 'General Conversation',
        language_global_id: 2,
        language_name: 'English',
        customer_id_requestor: 'user-123',
        peer_appt_description: 'Test appointment',
        peer_appt_minute_duration: 30,
        peer_appt_start_datetime: '2024-01-15T10:00:00Z',
        peer_appt_end_datetime: '2024-01-15T10:30:00Z',
        peer_appt_max_people: 2,
        peer_appt_location: 'Online',
      };

      repository.getPeerApptById.mockResolvedValueOnce(mockResponse);

      const result = await service.getPeerApptById(mockRequest);

      expect(repository.getPeerApptById).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when appointment is not found', async () => {
      const mockRequest: PeerApptGetRequest = {
        peer_appt_id: 'non-existent',
      };

      repository.getPeerApptById.mockResolvedValueOnce(null);

      await expect(service.getPeerApptById(mockRequest)).rejects.toThrow(
        'Peer appointment not found',
      );
    });
  });

  describe('updatePeerAppt', () => {
    it('should update peer appointment successfully', async () => {
      const mockRequest: PeerApptUpdateRequest = {
        peer_appt_id: 'appt-123',
        conversation_topic_id: 1,
        language_global_id: 2,
        user_account_requestor_id: '123e4567-e89b-12d3-a456-426614174000',
        peer_appt_description: 'Updated appointment',
        peer_appt_minute_duration: 45,
        peer_appt_start_datetime: '2024-01-15T11:00:00Z',
        peer_appt_max_people: 3,
        peer_appt_location: 'In-person',
      };

      const mockResponse: PeerApptUpdateResponse = {
        message: 'Peer appointment updated successfully',
      };

      repository.updatePeerAppt.mockResolvedValueOnce(mockResponse);

      const result = await service.updatePeerAppt(mockRequest);

      expect(repository.updatePeerAppt).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when appointment to update is not found', async () => {
      const mockRequest: PeerApptUpdateRequest = {
        peer_appt_id: 'non-existent',
        conversation_topic_id: 1,
        language_global_id: 2,
        user_account_requestor_id: '123e4567-e89b-12d3-a456-426614174000',
        peer_appt_description: 'Updated appointment',
        peer_appt_minute_duration: 45,
        peer_appt_start_datetime: '2024-01-15T11:00:00Z',
        peer_appt_max_people: 3,
        peer_appt_location: 'In-person',
      };

      repository.updatePeerAppt.mockResolvedValueOnce(null);

      await expect(service.updatePeerAppt(mockRequest)).rejects.toThrow(
        'Peer appointment not found',
      );
    });
  });

  describe('searchPeerApptsByTopicAndLanguage', () => {
    it('should return peer appointments when found', async () => {
      const mockRequest: PeerApptSearchRequest = {
        conversation_topic_id: 1,
        language_global_id: 2,
      };

      const mockResponse: PeerApptGetResponse[] = [
        {
          peer_appt_id: 'appt-1',
          conversation_topic_id: 1,
          conversation_topic_name: 'General Conversation',
          language_global_id: 2,
          language_name: 'English',
          customer_id_requestor: 'user-1',
          peer_appt_description: 'First appointment',
          peer_appt_minute_duration: 30,
          peer_appt_start_datetime: '2024-01-15T10:00:00Z',
          peer_appt_end_datetime: '2024-01-15T10:30:00Z',
          peer_appt_max_people: 2,
          peer_appt_location: 'Online',
        },
        {
          peer_appt_id: 'appt-2',
          conversation_topic_id: 1,
          conversation_topic_name: 'General Conversation',
          language_global_id: 2,
          language_name: 'English',
          customer_id_requestor: 'user-2',
          peer_appt_description: 'Second appointment',
          peer_appt_minute_duration: 60,
          peer_appt_start_datetime: '2024-01-15T14:00:00Z',
          peer_appt_end_datetime: '2024-01-15T15:00:00Z',
          peer_appt_max_people: 3,
          peer_appt_location: 'In-person',
        },
      ];

      repository.searchPeerApptsByTopicAndLanguage.mockResolvedValueOnce(
        mockResponse,
      );

      const result =
        await service.searchPeerApptsByTopicAndLanguage(mockRequest);

      expect(repository.searchPeerApptsByTopicAndLanguage).toHaveBeenCalledWith(
        mockRequest,
      );
      expect(result).toEqual(mockResponse);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no appointments found', async () => {
      const mockRequest: PeerApptSearchRequest = {
        conversation_topic_id: 1,
        language_global_id: 2,
      };

      repository.searchPeerApptsByTopicAndLanguage.mockResolvedValueOnce([]);

      const result =
        await service.searchPeerApptsByTopicAndLanguage(mockRequest);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should throw error when repository fails to search appointments', async () => {
      const mockRequest: PeerApptSearchRequest = {
        conversation_topic_id: 1,
        language_global_id: 2,
      };

      const repositoryError = new Error('Database query failed');
      repository.searchPeerApptsByTopicAndLanguage.mockRejectedValueOnce(
        repositoryError,
      );

      await expect(
        service.searchPeerApptsByTopicAndLanguage(mockRequest),
      ).rejects.toThrow(
        'Failed to search peer appointments: Database query failed',
      );
    });
  });
});
