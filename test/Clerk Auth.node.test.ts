/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ClerkAuth } from '../nodes/Clerk Auth/Clerk Auth.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('ClerkAuth Node', () => {
  let node: ClerkAuth;

  beforeAll(() => {
    node = new ClerkAuth();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Clerk Auth');
      expect(node.description.name).toBe('clerkauth');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 9 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(9);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(9);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Users Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        bearerToken: 'test-bearer-token',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getUsers', () => {
    it('should successfully retrieve users', async () => {
      const mockResponse = { data: [{ id: 'user_123', email: 'test@example.com' }], total_count: 1 };
      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        switch (name) {
          case 'operation': return 'getUsers';
          case 'limit': return 10;
          case 'offset': return 0;
          default: return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.clerk.com/v1/users?limit=10&offset=0',
        headers: {
          'Authorization': 'Bearer test-bearer-token',
          'Content-Type': 'application/json',
        },
      });
    });

    it('should handle errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        if (name === 'operation') return 'getUsers';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
    });
  });

  describe('createUser', () => {
    it('should successfully create a user', async () => {
      const mockResponse = { id: 'user_123', email: 'test@example.com' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        switch (name) {
          case 'operation': return 'createUser';
          case 'emailAddress': return 'test@example.com';
          case 'firstName': return 'Test';
          case 'lastName': return 'User';
          case 'privateMetadata': return '{}';
          case 'publicMetadata': return '{}';
          case 'unsafeMetadata': return '{}';
          default: return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clerk.com/v1/users',
        headers: {
          'Authorization': 'Bearer test-bearer-token',
          'Content-Type': 'application/json',
        },
        json: {
          email_address: ['test@example.com'],
          first_name: 'Test',
          last_name: 'User',
          private_metadata: {},
          public_metadata: {},
          unsafe_metadata: {},
        },
      });
    });
  });

  describe('getUser', () => {
    it('should successfully get a user', async () => {
      const mockResponse = { id: 'user_123', email: 'test@example.com' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        switch (name) {
          case 'operation': return 'getUser';
          case 'userId': return 'user_123';
          default: return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.clerk.com/v1/users/user_123',
        headers: {
          'Authorization': 'Bearer test-bearer-token',
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('banUser', () => {
    it('should successfully ban a user', async () => {
      const mockResponse = { id: 'user_123', banned: true };
      mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
        switch (name) {
          case 'operation': return 'banUser';
          case 'userId': return 'user_123';
          default: return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clerk.com/v1/users/user_123/ban',
        headers: {
          'Authorization': 'Bearer test-bearer-token',
          'Content-Type': 'application/json',
        },
      });
    });
  });
});

describe('Organizations Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.clerk.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getOrganizations', () => {
    it('should successfully get organizations', async () => {
      const mockResponse = { data: [{ id: 'org_123', name: 'Test Org' }] };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getOrganizations';
          case 'limit':
            return 10;
          case 'offset':
            return 0;
          default:
            return undefined;
        }
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      
      const result = await executeOrganizationsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );
      
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/organizations'),
          headers: expect.objectContaining({
            Authorization: 'Bearer test-api-key',
          }),
        }),
      );
    });

    it('should handle errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        return paramName === 'operation' ? 'getOrganizations' : undefined;
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      
      const result = await executeOrganizationsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );
      
      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getOrganization', () => {
    it('should successfully get specific organization', async () => {
      const mockResponse = { id: 'org_123', name: 'Test Org' };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getOrganization';
          case 'organization_id':
            return 'org_123';
          default:
            return undefined;
        }
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      
      const result = await executeOrganizationsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );
      
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('createOrganization', () => {
    it('should successfully create organization', async () => {
      const mockResponse = { id: 'org_123', name: 'New Org' };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'createOrganization';
          case 'name':
            return 'New Org';
          default:
            return undefined;
        }
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      
      const result = await executeOrganizationsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );
      
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          body: expect.objectContaining({ name: 'New Org' }),
        }),

describe('Sessions Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.clerk.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getSessions operation', () => {
    it('should get sessions successfully', async () => {
      const mockResponse = { data: [{ id: 'sess_1', status: 'active' }] };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getSessions';
        if (param === 'limit') return 10;
        if (param === 'offset') return 0;
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSessionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.clerk.com/v1/sessions',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: { limit: 10, offset: 0 },
        json: true,
      });
    });
  });

  describe('getSession operation', () => {
    it('should get specific session successfully', async () => {
      const mockResponse = { id: 'sess_123', status: 'active' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getSession';
        if (param === 'sessionId') return 'sess_123';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSessionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.clerk.com/v1/sessions/sess_123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('revokeSession operation', () => {
    it('should revoke session successfully', async () => {
      const mockResponse = { success: true };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'revokeSession';
        if (param === 'sessionId') return 'sess_123';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSessionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clerk.com/v1/sessions/sess_123/revoke',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('verifySession operation', () => {
    it('should verify session successfully', async () => {
      const mockResponse = { valid: true };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'verifySession';
        if (param === 'sessionId') return 'sess_123';
        if (param === 'token') return 'token_123';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSessionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clerk.com/v1/sessions/sess_123/verify',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: { token: 'token_123' },
        json: true,
      });
    });
  });

  describe('getSessionToken operation', () => {
    it('should get session token successfully', async () => {
      const mockResponse = { token: 'jwt_token_123' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getSessionToken';
        if (param === 'sessionId') return 'sess_123';
        if (param === 'templateName') return 'default';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSessionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.clerk.com/v1/sessions/sess_123/tokens/default',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      const mockError = new Error('API Error');
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getSession';
        if (param === 'sessionId') return 'sess_123';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

      await expect(executeSessionsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow();
    });

    it('should continue on fail when configured', async () => {
      const mockError = new Error('API Error');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getSession';
        if (param === 'sessionId') return 'sess_123';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

      const result = await executeSessionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('EmailAddresses Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.clerk.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getEmailAddress', () => {
    it('should get email address successfully', async () => {
      const mockEmailAddress = {
        id: 'ema_test123',
        email_address: 'test@example.com',
        verified: true,
        primary: true,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getEmailAddress';
        if (param === 'emailAddressId') return 'ema_test123';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockEmailAddress);

      const items = [{ json: {} }];
      const result = await executeEmailAddressesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockEmailAddress);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.clerk.com/v1/email_addresses/ema_test123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle get email address error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getEmailAddress';
        if (param === 'emailAddressId') return 'invalid_id';
        return undefined;
      });

      const error = new Error('Email address not found');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      const items = [{ json: {} }];
      
      await expect(executeEmailAddressesOperations.call(mockExecuteFunctions, items))
        .rejects.toThrow('Email address not found');
    });
  });

  describe('createEmailAddress', () => {
    it('should create email address successfully', async () => {
      const mockEmailAddress = {
        id: 'ema_new123',
        email_address: 'new@example.com',
        verified: false,
        primary: false,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        if (param === 'operation') return 'createEmailAddress';
        if (param === 'userId') return 'user_123';
        if (param === 'emailAddress') return 'new@example.com';
        if (param === 'verified') return defaultValue || false;
        if (param === 'primary') return defaultValue || false;
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockEmailAddress);

      const items = [{ json: {} }];
      const result = await executeEmailAddressesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockEmailAddress);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clerk.com/v1/email_addresses',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          user_id: 'user_123',
          email_address: 'new@example.com',
          verified: false,
          primary: false,
        },
        json: true,
      });
    });
  });

  describe('updateEmailAddress', () => {
    it('should update email address successfully', async () => {
      const mockEmailAddress = {
        id: 'ema_test123',
        email_address: 'test@example.com',
        verified: true,
        primary: true,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        if (param === 'operation') return 'updateEmailAddress';
        if (param === 'emailAddressId') return 'ema_test123';
        if (param === 'verified') return true;
        if (param === 'primary') return true;
        return defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockEmailAddress);

      const items = [{ json: {} }];
      const result = await executeEmailAddressesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockEmailAddress);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PATCH',
        url: 'https://api.clerk.com/v1/email_addresses/ema_test123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          verified: true,
          primary: true,
        },
        json: true,
      });
    });
  });

  describe('deleteEmailAddress', () => {
    it('should delete email address successfully', async () => {
      const mockResponse = { deleted: true, id: 'ema_test123' };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'deleteEmailAddress';
        if (param === 'emailAddressId') return 'ema_test123';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeEmailAddressesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.clerk.com/v1/email_addresses/ema_test123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });
});

describe('PhoneNumbers Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.clerk.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getPhoneNumber', () => {
    it('should get phone number successfully', async () => {
      const mockPhoneNumber = {
        id: 'idn_123',
        phone_number: '+1234567890',
        verified: true,
        primary: false,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getPhoneNumber';
        if (param === 'phoneNumberId') return 'idn_123';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockPhoneNumber);

      const items = [{ json: {} }];
      const result = await executePhoneNumbersOperations.call(mockExecuteFunctions, items);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.clerk.com/v1/phone_numbers/idn_123',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockPhoneNumber, pairedItem: { item: 0 } }]);
    });
  });

  describe('createPhoneNumber', () => {
    it('should create phone number successfully', async () => {
      const mockPhoneNumber = {
        id: 'idn_123',
        phone_number: '+1234567890',
        verified: false,
        primary: false,
        user_id: 'user_123',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'createPhoneNumber';
        if (param === 'userId') return 'user_123';
        if (param === 'phoneNumber') return '+1234567890';
        if (param === 'verified') return false;
        if (param === 'primary') return false;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockPhoneNumber);

      const items = [{ json: {} }];
      const result = await executePhoneNumbersOperations.call(mockExecuteFunctions, items);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clerk.com/v1/phone_numbers',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          user_id: 'user_123',
          phone_number: '+1234567890',
          verified: false,
          primary: false,
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockPhoneNumber, pairedItem: { item: 0 } }]);
    });
  });

  describe('updatePhoneNumber', () => {
    it('should update phone number successfully', async () => {
      const mockPhoneNumber = {
        id: 'idn_123',
        phone_number: '+1234567890',
        verified: true,
        primary: true,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'updatePhoneNumber';
        if (param === 'phoneNumberId') return 'idn_123';
        if (param === 'verified') return true;
        if (param === 'primary') return true;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockPhoneNumber);

      const items = [{ json: {} }];
      const result = await executePhoneNumbersOperations.call(mockExecuteFunctions, items);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PATCH',
        url: 'https://api.clerk.com/v1/phone_numbers/idn_123',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          verified: true,
          primary: true,
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockPhoneNumber, pairedItem: { item: 0 } }]);
    });
  });

  describe('deletePhoneNumber', () => {
    it('should delete phone number successfully', async () => {
      const mockResponse = { deleted: true, id: 'idn_123' };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'deletePhoneNumber';
        if (param === 'phoneNumberId') return 'idn_123';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executePhoneNumbersOperations.call(mockExecuteFunctions, items);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.clerk.com/v1/phone_numbers/idn_123',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('error handling', () => {
    it('should handle API errors correctly', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getPhoneNumber';
        if (param === 'phoneNumberId') return 'invalid_id';
      });

      const apiError = new Error('Phone number not found');
      (apiError as any).httpCode = 404;
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

      const items = [{ json: {} }];

      await expect(
        executePhoneNumbersOperations.call(mockExecuteFunctions, items)
      ).rejects.toThrow('Phone number not found');
    });

    it('should continue on fail when configured', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getPhoneNumber';
        if (param === 'phoneNumberId') return 'invalid_id';
      });

      const apiError = new Error('Phone number not found');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

      const items = [{ json: {} }];
      const result = await executePhoneNumbersOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: { error: 'Phone number not found' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Invitations Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.clerk.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getInvitations', () => {
    it('should get invitations successfully', async () => {
      const mockResponse = {
        data: [
          { id: 'inv_123', email_address: 'test@example.com', status: 'pending' }
        ],
        total_count: 1
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getInvitations';
          case 'limit': return 20;
          case 'offset': return 0;
          case 'status': return 'pending';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeInvitationsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.clerk.com/v1/invitations?limit=20&offset=0&status=pending',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle get invitations error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getInvitations';
          case 'limit': return 20;
          case 'offset': return 0;
          case 'status': return '';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executeInvitationsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      )).rejects.toThrow();
    });
  });

  describe('createInvitation', () => {
    it('should create invitation successfully', async () => {
      const mockResponse = {
        id: 'inv_123',
        email_address: 'test@example.com',
        status: 'pending'
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createInvitation';
          case 'email_address': return 'test@example.com';
          case 'private_metadata': return '{}';
          case 'public_metadata': return '{}';
          case 'redirect_url': return 'https://example.com';
          case 'notify': return true;
          case 'ignore_existing': return false;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeInvitationsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clerk.com/v1/invitations',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          email_address: 'test@example.com',
          notify: true,
          ignore_existing: false,
          redirect_url: 'https://example.com',
        },
        json: true,
      });
    });

    it('should handle create invitation error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createInvitation';
          case 'email_address': return 'test@example.com';
          case 'private_metadata': return '{}';
          case 'public_metadata': return '{}';
          case 'redirect_url': return '';
          case 'notify': return true;
          case 'ignore_existing': return false;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executeInvitationsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      )).rejects.toThrow();
    });
  });

  describe('revokeInvitation', () => {
    it('should revoke invitation successfully', async () => {
      const mockResponse = {
        id: 'inv_123',
        status: 'revoked'
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'revokeInvitation';
          case 'invitation_id': return 'inv_123';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeInvitationsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clerk.com/v1/invitations/inv_123/revoke',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle revoke invitation error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'revokeInvitation';
          case 'invitation_id': return 'inv_123';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executeInvitationsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      )).rejects.toThrow();
    });
  });
});

describe('AllowlistIdentifiers Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.clerk.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getAllowlistIdentifiers', () => {
    it('should successfully get all allowlist identifiers', async () => {
      const mockResponse = [
        {
          id: 'alid_1',
          identifier: 'user@example.com',
          created_at: 1234567890,
          updated_at: 1234567890,
        },
      ];

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getAllowlistIdentifiers';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAllowlistIdentifiersOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.clerk.com/v1/allowlist_identifiers',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });

    it('should handle errors when getting allowlist identifiers', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getAllowlistIdentifiers';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeAllowlistIdentifiersOperations.call(mockExecuteFunctions, [{ json: {} }]),
      ).rejects.toThrow('API Error');
    });
  });

  describe('createAllowlistIdentifier', () => {
    it('should successfully create an allowlist identifier', async () => {
      const mockResponse = {
        id: 'alid_1',
        identifier: 'user@example.com',
        created_at: 1234567890,
        updated_at: 1234567890,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, index: number) => {
        if (paramName === 'operation') return 'createAllowlistIdentifier';
        if (paramName === 'identifier') return 'user@example.com';
        if (paramName === 'notify') return true;
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAllowlistIdentifiersOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clerk.com/v1/allowlist_identifiers',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          identifier: 'user@example.com',
          notify: true,
        },
        json: true,
      });

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });

    it('should handle errors when creating allowlist identifier', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, index: number) => {
        if (paramName === 'operation') return 'createAllowlistIdentifier';
        if (paramName === 'identifier') return 'user@example.com';
        if (paramName === 'notify') return true;
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeAllowlistIdentifiersOperations.call(mockExecuteFunctions, [{ json: {} }]),
      ).rejects.toThrow('API Error');
    });
  });

  describe('deleteAllowlistIdentifier', () => {
    it('should successfully delete an allowlist identifier', async () => {
      const mockResponse = {
        deleted: true,
        id: 'alid_1',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, index: number) => {
        if (paramName === 'operation') return 'deleteAllowlistIdentifier';
        if (paramName === 'identifierId') return 'alid_1';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAllowlistIdentifiersOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.clerk.com/v1/allowlist_identifiers/alid_1',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });

    it('should handle errors when deleting allowlist identifier', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, index: number) => {
        if (paramName === 'operation') return 'deleteAllowlistIdentifier';
        if (paramName === 'identifierId') return 'alid_1';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeAllowlistIdentifiersOperations.call(mockExecuteFunctions, [{ json: {} }]),
      ).rejects.toThrow('API Error');
    });
  });
});

describe('BlocklistIdentifiers Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.clerk.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getBlocklistIdentifiers', () => {
    it('should successfully get blocklist identifiers', async () => {
      const mockResponse = [
        { id: 'bl_id_1', identifier: 'blocked@example.com', created_at: 1234567890 },
        { id: 'bl_id_2', identifier: '+1234567890', created_at: 1234567891 }
      ];

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getBlocklistIdentifiers';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlocklistIdentifiersOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.clerk.com/v1/blocklist_identifiers',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle error when getting blocklist identifiers', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getBlocklistIdentifiers';
        return '';
      });

      const error = new Error('API Error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      await expect(
        executeBlocklistIdentifiersOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });

  describe('createBlocklistIdentifier', () => {
    it('should successfully create blocklist identifier', async () => {
      const mockResponse = {
        id: 'bl_id_123',
        identifier: 'blocked@example.com',
        created_at: 1234567890
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, index: number) => {
        if (paramName === 'operation') return 'createBlocklistIdentifier';
        if (paramName === 'identifier') return 'blocked@example.com';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlocklistIdentifiersOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clerk.com/v1/blocklist_identifiers',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          identifier: 'blocked@example.com',
        },
        json: true,
      });
    });

    it('should handle error when creating blocklist identifier', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, index: number) => {
        if (paramName === 'operation') return 'createBlocklistIdentifier';
        if (paramName === 'identifier') return 'blocked@example.com';
        return '';
      });

      const error = new Error('Creation failed');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      await expect(
        executeBlocklistIdentifiersOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Creation failed');
    });
  });

  describe('deleteBlocklistIdentifier', () => {
    it('should successfully delete blocklist identifier', async () => {
      const mockResponse = { deleted: true };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, index: number) => {
        if (paramName === 'operation') return 'deleteBlocklistIdentifier';
        if (paramName === 'identifierId') return 'bl_id_123';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlocklistIdentifiersOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.clerk.com/v1/blocklist_identifiers/bl_id_123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle error when deleting blocklist identifier', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, index: number) => {
        if (paramName === 'operation') return 'deleteBlocklistIdentifier';
        if (paramName === 'identifierId') return 'bl_id_123';
        return '';
      });

      const error = new Error('Deletion failed');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      await expect(
        executeBlocklistIdentifiersOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Deletion failed');
    });
  });
});

describe('JwtTemplates Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        bearerToken: 'test-bearer-token',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getJwtTemplates', () => {
    it('should get all JWT templates successfully', async () => {
      const mockResponse = [
        { id: 'tmpl_1', name: 'Template 1' },
        { id: 'tmpl_2', name: 'Template 2' },
      ];

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getJwtTemplates';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeJwtTemplatesOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.clerk.com/v1/jwt_templates',
        headers: {
          'Authorization': 'Bearer test-bearer-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle errors when getting JWT templates', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getJwtTemplates';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeJwtTemplatesOperations.call(mockExecuteFunctions, [{ json: {} }]),
      ).rejects.toThrow('API Error');
    });
  });

  describe('getJwtTemplate', () => {
    it('should get specific JWT template successfully', async () => {
      const mockResponse = { id: 'tmpl_123', name: 'Test Template' };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getJwtTemplate';
        if (param === 'templateId') return 'tmpl_123';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeJwtTemplatesOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.clerk.com/v1/jwt_templates/tmpl_123',
        headers: {
          'Authorization': 'Bearer test-bearer-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('createJwtTemplate', () => {
    it('should create JWT template successfully', async () => {
      const mockResponse = { id: 'tmpl_new', name: 'New Template' };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'createJwtTemplate';
        if (param === 'name') return 'New Template';
        if (param === 'claims') return '{"custom": "value"}';
        if (param === 'lifetime') return 7200;
        if (param === 'allowedClockSkew') return 10;
        if (param === 'customSigningKey') return false;
        if (param === 'signingAlgorithm') return 'RS256';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeJwtTemplatesOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clerk.com/v1/jwt_templates',
        headers: {
          'Authorization': 'Bearer test-bearer-token',
          'Content-Type': 'application/json',
        },
        body: {
          name: 'New Template',
          claims: { custom: 'value' },
          lifetime: 7200,
          allowed_clock_skew: 10,
          custom_signing_key: false,
          signing_algorithm: 'RS256',
        },
        json: true,
      });
    });

    it('should handle invalid JSON in claims', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'createJwtTemplate';
        if (param === 'name') return 'New Template';
        if (param === 'claims') return 'invalid json';
        return undefined;
      });

      await expect(
        executeJwtTemplatesOperations.call(mockExecuteFunctions, [{ json: {} }]),
      ).rejects.toThrow('Invalid JSON in claims');
    });
  });

  describe('updateJwtTemplate', () => {
    it('should update JWT template successfully', async () => {
      const mockResponse = { id: 'tmpl_123', name: 'Updated Template' };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'updateJwtTemplate';
        if (param === 'templateId') return 'tmpl_123';
        if (param === 'name') return 'Updated Template';
        if (param === 'lifetime') return 3600;
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeJwtTemplatesOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PATCH',
        url: 'https://api.clerk.com/v1/jwt_templates/tmpl_123',
        headers: {
          'Authorization': 'Bearer test-bearer-token',
          'Content-Type': 'application/json',
        },
        body: {
          name: 'Updated Template',
          lifetime: 3600,
        },
        json: true,
      });
    });
  });

  describe('deleteJwtTemplate', () => {
    it('should delete JWT template successfully', async () => {
      const mockResponse = { deleted: true };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'deleteJwtTemplate';
        if (param === 'templateId') return 'tmpl_123';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeJwtTemplatesOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.clerk.com/v1/jwt_templates/tmpl_123',
        headers: {
          'Authorization': 'Bearer test-bearer-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle unknown operation', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'unknownOperation';
        return undefined;
      });

      await expect(
        executeJwtTemplatesOperations.call(mockExecuteFunctions, [{ json: {} }]),
      ).rejects.toThrow('Unknown operation: unknownOperation');
    });

    it('should continue on fail when enabled', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getJwtTemplates';
        return undefined;
      });

      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeJwtTemplatesOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ error: 'API Error' });
    });
  });
});
});
