import { Test, TestingModule } from '@nestjs/testing';
import { PeerApptRepository } from './peer-appt-repository';
import pool from '../config/database';
import type {
  PeerApptCreateRequest,
  PeerApptCreateResponse,
  PeerApptGetRequest,
  PeerApptGetResponse,
  PeerApptUpdateRequest,
  PeerApptUpdateResponse,
  PeerApptSearchRequest,
} from '../dto';

// Mock the database pool
jest.mock('../../src/config/database', () => ({
  query: jest.fn(),
}));

const mockPool = pool as jest.Mocked<typeof pool>;

describe('PeerApptRepository', () => {
  let repository: PeerApptRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PeerApptRepository],
    }).compile();

    repository = module.get<PeerApptRepository>(PeerApptRepository);
    jest.clearAllMocks();
  });

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

    const mockResponse = {
      rows: [{ peer_appt_id: 'appt-123' }],
    };
    (mockPool.query as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result: PeerApptCreateResponse =
      await repository.createPeerAppt(mockRequest);

    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO peer_appt'),
      [
        mockRequest.conversation_topic_id,
        mockRequest.language_global_id,
        mockRequest.user_account_requestor_id,
        mockRequest.peer_appt_description,
        mockRequest.peer_appt_minute_duration,
        mockRequest.peer_appt_start_datetime,
        mockRequest.peer_appt_max_people,
        mockRequest.peer_appt_location,
      ],
    );
    expect(result).toEqual({ peer_appt_id: 'appt-123' });
  });

  it('should retrieve a peer appointment by ID successfully', async () => {
    const mockRequest: PeerApptGetRequest = {
      peer_appt_id: 'appt-123',
    };

    const mockAppointment: PeerApptGetResponse = {
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

    const mockResponse = {
      rows: [mockAppointment],
    };
    (mockPool.query as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await repository.getPeerApptById(mockRequest);

    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT'),
      [mockRequest.peer_appt_id],
    );
    expect(result).toEqual(mockAppointment);
  });

  it('should return null when appointment is not found', async () => {
    const mockRequest: PeerApptGetRequest = {
      peer_appt_id: 'non-existent',
    };

    const mockResponse = {
      rows: [],
    };
    (mockPool.query as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await repository.getPeerApptById(mockRequest);

    expect(result).toBeNull();
  });

  it('should update a peer appointment successfully', async () => {
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

    const mockResponse = {
      rows: [{ peer_appt_id: 'appt-123' }],
    };
    (mockPool.query as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await repository.updatePeerAppt(mockRequest);

    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE peer_appt'),
      [
        mockRequest.conversation_topic_id,
        mockRequest.language_global_id,
        mockRequest.user_account_requestor_id,
        mockRequest.peer_appt_description,
        mockRequest.peer_appt_minute_duration,
        mockRequest.peer_appt_start_datetime,
        mockRequest.peer_appt_max_people,
        mockRequest.peer_appt_location,
        mockRequest.peer_appt_id,
      ],
    );
    expect(result).toEqual({
      message: 'Peer appointment updated successfully',
    });
  });

  it('should return null when updating non-existent appointment', async () => {
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

    const mockResponse = {
      rows: [],
    };
    (mockPool.query as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await repository.updatePeerAppt(mockRequest);

    expect(result).toBeNull();
  });

  it('should search peer appointments by topic and language successfully', async () => {
    const mockRequest: PeerApptSearchRequest = {
      conversation_topic_id: 1,
      language_global_id: 2,
    };

    const mockAppointments: PeerApptGetResponse[] = [
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

    const mockResponse = {
      rows: mockAppointments,
    };
    (mockPool.query as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result =
      await repository.searchPeerApptsByTopicAndLanguage(mockRequest);

    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT'),
      [mockRequest.conversation_topic_id, mockRequest.language_global_id],
    );
    expect(result).toEqual(mockAppointments);
    expect(result).toHaveLength(2);
  });

  it('should return empty array when no appointments found in search', async () => {
    const mockRequest: PeerApptSearchRequest = {
      conversation_topic_id: 1,
      language_global_id: 2,
    };

    const mockResponse = {
      rows: [],
    };
    (mockPool.query as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result =
      await repository.searchPeerApptsByTopicAndLanguage(mockRequest);

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should handle database errors', async () => {
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

    const dbError = new Error('Database connection failed');
    (mockPool.query as jest.Mock).mockRejectedValueOnce(dbError);

    await expect(repository.createPeerAppt(mockRequest)).rejects.toThrow(
      'Database connection failed',
    );
  });
});
