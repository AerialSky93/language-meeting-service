import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { PeerApptController } from '../../src/controller/peer-appt-controller';
import { PeerApptService } from '../../src/service/peer-appt-service';
import type {
  PeerApptCreateRequest,
  PeerApptCreateResponse,
  PeerApptGetResponse,
  PeerApptUpdateRequest,
  PeerApptUpdateResponse,
  PeerApptSearchRequest,
} from '../../src/dto';

describe('PeerApptController', () => {
  let controller: PeerApptController;
  let service: jest.Mocked<PeerApptService>;

  beforeEach(async () => {
    const mockService = {
      createPeerAppt: jest.fn(),
      getPeerApptById: jest.fn(),
      updatePeerAppt: jest.fn(),
      searchPeerApptsByTopicAndLanguage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeerApptController],
      providers: [
        {
          provide: PeerApptService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PeerApptController>(PeerApptController);
    service = module.get(PeerApptService);
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

      service.createPeerAppt.mockResolvedValueOnce(mockResponse);

      const result = await controller.createPeerAppt(mockRequest);

      expect(service.createPeerAppt).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should throw BAD_REQUEST when service throws Missing error', async () => {
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

      const serviceError = new Error('Missing required field');
      service.createPeerAppt.mockRejectedValueOnce(serviceError);

      await expect(controller.createPeerAppt(mockRequest)).rejects.toThrow(
        HttpException,
      );

      try {
        await controller.createPeerAppt(mockRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(StatusCodes.BAD_REQUEST);
        expect(error.message).toBe('Missing required field');
      }
    });

    it('should throw INTERNAL_SERVER_ERROR for other service errors', async () => {
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

      const serviceError = new Error('Database connection failed');
      service.createPeerAppt.mockRejectedValueOnce(serviceError);

      try {
        await controller.createPeerAppt(mockRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(error.message).toBe('Database connection failed');
      }
    });
  });

  describe('getPeerApptById', () => {
    it('should return peer appointment when found', async () => {
      const appointmentId = 'appt-123';
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

      service.getPeerApptById.mockResolvedValueOnce(mockResponse);

      const result = await controller.getPeerApptById(appointmentId);

      expect(service.getPeerApptById).toHaveBeenCalledWith({
        peer_appt_id: appointmentId,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw NOT_FOUND when appointment is not found', async () => {
      const appointmentId = 'non-existent';
      const serviceError = new Error('Peer appointment not found');
      service.getPeerApptById.mockRejectedValueOnce(serviceError);

      try {
        await controller.getPeerApptById(appointmentId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(StatusCodes.NOT_FOUND);
        expect(error.message).toBe('Peer appointment not found');
      }
    });

    it('should throw INTERNAL_SERVER_ERROR for other service errors', async () => {
      const appointmentId = 'appt-123';
      const serviceError = new Error('Database connection failed');
      service.getPeerApptById.mockRejectedValueOnce(serviceError);

      try {
        await controller.getPeerApptById(appointmentId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(error.message).toBe('Database connection failed');
      }
    });
  });

  describe('updatePeerAppt', () => {
    it('should update peer appointment successfully', async () => {
      const appointmentId = 'appt-123';
      const mockRequest: PeerApptUpdateRequest = {
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

      service.updatePeerAppt.mockResolvedValueOnce(mockResponse);

      const result = await controller.updatePeerAppt(
        appointmentId,
        mockRequest,
      );

      expect(service.updatePeerAppt).toHaveBeenCalledWith({
        ...mockRequest,
        peer_appt_id: appointmentId,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw NOT_FOUND when appointment to update is not found', async () => {
      const appointmentId = 'non-existent';
      const mockRequest: PeerApptUpdateRequest = {
        conversation_topic_id: 1,
        language_global_id: 2,
        user_account_requestor_id: '123e4567-e89b-12d3-a456-426614174000',
        peer_appt_description: 'Updated appointment',
        peer_appt_minute_duration: 45,
        peer_appt_start_datetime: '2024-01-15T11:00:00Z',
        peer_appt_max_people: 3,
        peer_appt_location: 'In-person',
      };

      const serviceError = new Error('Peer appointment not found');
      service.updatePeerAppt.mockRejectedValueOnce(serviceError);

      try {
        await controller.updatePeerAppt(appointmentId, mockRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(StatusCodes.NOT_FOUND);
        expect(error.message).toBe('Peer appointment not found');
      }
    });

    it('should throw INTERNAL_SERVER_ERROR for other service errors', async () => {
      const appointmentId = 'appt-123';
      const mockRequest: PeerApptUpdateRequest = {
        conversation_topic_id: 1,
        language_global_id: 2,
        user_account_requestor_id: '123e4567-e89b-12d3-a456-426614174000',
        peer_appt_description: 'Updated appointment',
        peer_appt_minute_duration: 45,
        peer_appt_start_datetime: '2024-01-15T11:00:00Z',
        peer_appt_max_people: 3,
        peer_appt_location: 'In-person',
      };

      const serviceError = new Error('Database connection failed');
      service.updatePeerAppt.mockRejectedValueOnce(serviceError);

      try {
        await controller.updatePeerAppt(appointmentId, mockRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(error.message).toBe('Database connection failed');
      }
    });
  });

  describe('searchPeerAppts', () => {
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

      service.searchPeerApptsByTopicAndLanguage.mockResolvedValueOnce(
        mockResponse,
      );

      const result = await controller.searchPeerAppts(mockRequest);

      expect(service.searchPeerApptsByTopicAndLanguage).toHaveBeenCalledWith(
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

      service.searchPeerApptsByTopicAndLanguage.mockResolvedValueOnce([]);

      const result = await controller.searchPeerAppts(mockRequest);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should throw INTERNAL_SERVER_ERROR when service throws Failed to search error', async () => {
      const mockRequest: PeerApptSearchRequest = {
        conversation_topic_id: 1,
        language_global_id: 2,
      };

      const serviceError = new Error(
        'Failed to search peer appointments: Database error',
      );
      service.searchPeerApptsByTopicAndLanguage.mockRejectedValueOnce(
        serviceError,
      );

      try {
        await controller.searchPeerAppts(mockRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(error.message).toBe(
          'Failed to search peer appointments: Database error',
        );
      }
    });

    it('should throw BAD_REQUEST for other service errors', async () => {
      const mockRequest: PeerApptSearchRequest = {
        conversation_topic_id: 1,
        language_global_id: 2,
      };

      const serviceError = new Error('Invalid search parameters');
      service.searchPeerApptsByTopicAndLanguage.mockRejectedValueOnce(
        serviceError,
      );

      try {
        await controller.searchPeerAppts(mockRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(StatusCodes.BAD_REQUEST);
        expect(error.message).toBe('Invalid search parameters');
      }
    });
  });
});
