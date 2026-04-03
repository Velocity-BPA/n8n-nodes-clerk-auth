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

    it('should define 8 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(8);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(8);
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
describe('User Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ bearerToken: 'test-token' }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should get users successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getUsers')
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('created_at');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ users: [] });

    const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.clerk.com/v1/users?limit=10&offset=0&order_by=created_at',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      json: true,
    });

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ users: [] });
  });

  it('should create user successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createUser')
      .mockReturnValueOnce('test@example.com')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('testuser')
      .mockReturnValueOnce('password123')
      .mockReturnValueOnce('John')
      .mockReturnValueOnce('Doe')
      .mockReturnValueOnce('');

    const mockUser = { id: 'user_123', email_address: 'test@example.com' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockUser);

    const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.clerk.com/v1/users',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      body: {
        email_address: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
      },
      json: true,
    });

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockUser);
  });

  it('should handle errors gracefully when continue on fail is enabled', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getUser').mockReturnValueOnce('invalid-user-id');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('User not found'));

    const result = await executeUserOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('User not found');
  });
});

describe('Organization Resource', () => {
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
      const mockResponse = {
        data: [{ id: 'org_123', name: 'Test Organization' }],
        total_count: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        const params: any = {
          operation: 'getOrganizations',
          limit: 10,
          offset: 0,
          include_members_count: false,
          query: '',
          order_by: 'created_at',
        };
        return params[param] ?? defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeOrganizationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.clerk.com/v1/organizations?limit=10&offset=0&order_by=created_at',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle errors when getting organizations', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getOrganizations');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeOrganizationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('createOrganization', () => {
    it('should successfully create an organization', async () => {
      const mockResponse = { id: 'org_123', name: 'New Organization' };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'createOrganization',
          name: 'New Organization',
          slug: 'new-org',
          created_by: 'user_123',
          private_metadata: '{}',
          public_metadata: '{}',
          max_allowed_memberships: 0,
        };
        return params[param];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeOrganizationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clerk.com/v1/organizations',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          name: 'New Organization',
          slug: 'new-org',
          created_by: 'user_123',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('deleteOrganization', () => {
    it('should successfully delete an organization', async () => {
      const mockResponse = { deleted: true };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'deleteOrganization',
          organization_id: 'org_123',
        };
        return params[param];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeOrganizationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.clerk.com/v1/organizations/org_123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getOrganizationMemberships', () => {
    it('should successfully get organization memberships', async () => {
      const mockResponse = {
        data: [{ id: 'membership_123', user_id: 'user_123', role: 'admin' }],
        total_count: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        const params: any = {
          operation: 'getOrganizationMemberships',
          organization_id: 'org_123',
          limit: 10,
          offset: 0,
          user_id: '',
          email_address: '',
          phone_number: '',
          username: '',
          order_by: 'created_at',
        };
        return params[param] ?? defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeOrganizationOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.clerk.com/v1/organizations/org_123/memberships?limit=10&offset=0&order_by=created_at',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Session Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				bearerToken: 'test-token',
				baseUrl: 'https://api.clerk.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should get sessions successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getSessions')
			.mockReturnValueOnce('client123')
			.mockReturnValueOnce('user456')
			.mockReturnValueOnce('active')
			.mockReturnValueOnce(10)
			.mockReturnValueOnce(0);

		const mockResponse = [{ id: 'session1', status: 'active' }];
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeSessionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.clerk.com/v1/sessions?client_id=client123&user_id=user456&status=active&limit=10&offset=0',
			headers: {
				Authorization: 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	it('should get session by id successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getSession')
			.mockReturnValueOnce('session123');

		const mockResponse = { id: 'session123', status: 'active' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeSessionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.clerk.com/v1/sessions/session123',
			headers: {
				Authorization: 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	it('should revoke session successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('revokeSession')
			.mockReturnValueOnce('session123');

		const mockResponse = { id: 'session123', status: 'revoked' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeSessionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.clerk.com/v1/sessions/session123/revoke',
			headers: {
				Authorization: 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	it('should verify session successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('verifySession')
			.mockReturnValueOnce('session123')
			.mockReturnValueOnce('token456');

		const mockResponse = { valid: true, session_id: 'session123' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeSessionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.clerk.com/v1/sessions/session123/verify',
			headers: {
				Authorization: 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			body: {
				token: 'token456',
			},
			json: true,
		});
	});

	it('should get session tokens successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getSessionTokens')
			.mockReturnValueOnce('session123')
			.mockReturnValueOnce('template1');

		const mockResponse = { tokens: ['token1', 'token2'] };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeSessionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.clerk.com/v1/sessions/session123/tokens?template=template1',
			headers: {
				Authorization: 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	it('should handle errors when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getSession');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeSessionOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
	});

	it('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getSession');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(executeSessionOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
	});

	it('should throw error for unknown operation', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

		await expect(executeSessionOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Unknown operation: unknownOperation');
	});
});

describe('Email Address Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				bearerToken: 'test-token',
				baseUrl: 'https://api.clerk.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getEmailAddress', () => {
		it('should get email address successfully', async () => {
			const mockResponse = { id: 'email_123', email_address: 'test@example.com' };
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				if (name === 'operation') return 'getEmailAddress';
				if (name === 'emailAddressId') return 'email_123';
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeEmailAddressOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle get email address error', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				if (name === 'operation') return 'getEmailAddress';
				if (name === 'emailAddressId') return 'email_123';
			});
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeEmailAddressOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: { error: 'Not found' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('createEmailAddress', () => {
		it('should create email address successfully', async () => {
			const mockResponse = { id: 'email_123', email_address: 'test@example.com' };
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				if (name === 'operation') return 'createEmailAddress';
				if (name === 'userId') return 'user_123';
				if (name === 'emailAddressValue') return 'test@example.com';
				if (name === 'verified') return true;
				if (name === 'primary') return false;
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeEmailAddressOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('updateEmailAddress', () => {
		it('should update email address successfully', async () => {
			const mockResponse = { id: 'email_123', verified: true };
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				if (name === 'operation') return 'updateEmailAddress';
				if (name === 'emailAddressId') return 'email_123';
				if (name === 'verified') return true;
				if (name === 'primary') return true;
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeEmailAddressOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('deleteEmailAddress', () => {
		it('should delete email address successfully', async () => {
			const mockResponse = { deleted: true };
			mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
				if (name === 'operation') return 'deleteEmailAddress';
				if (name === 'emailAddressId') return 'email_123';
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeEmailAddressOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('PhoneNumber Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				bearerToken: 'test-token',
				baseUrl: 'https://api.clerk.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getPhoneNumber', () => {
		it('should retrieve phone number details successfully', async () => {
			const mockPhoneNumber = { id: 'phone_123', phone_number: '+1234567890', verified: true };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getPhoneNumber')
				.mockReturnValueOnce('phone_123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockPhoneNumber);

			const result = await executePhoneNumberOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockPhoneNumber, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.clerk.com/v1/phone_numbers/phone_123',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle errors when retrieving phone number', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getPhoneNumber')
				.mockReturnValueOnce('phone_123');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executePhoneNumberOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('createPhoneNumber', () => {
		it('should create phone number successfully', async () => {
			const mockPhoneNumber = { id: 'phone_123', phone_number: '+1234567890', verified: false };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createPhoneNumber')
				.mockReturnValueOnce('user_123')
				.mockReturnValueOnce('+1234567890')
				.mockReturnValueOnce(false)
				.mockReturnValueOnce(true);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockPhoneNumber);

			const result = await executePhoneNumberOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockPhoneNumber, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.clerk.com/v1/phone_numbers',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: {
					user_id: 'user_123',
					phone_number: '+1234567890',
					verified: false,
					primary: true,
				},
				json: true,
			});
		});
	});

	describe('updatePhoneNumber', () => {
		it('should update phone number successfully', async () => {
			const mockPhoneNumber = { id: 'phone_123', verified: true, primary: true };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updatePhoneNumber')
				.mockReturnValueOnce(true)
				.mockReturnValueOnce(true)
				.mockReturnValueOnce('phone_123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockPhoneNumber);

			const result = await executePhoneNumberOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockPhoneNumber, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PATCH',
				url: 'https://api.clerk.com/v1/phone_numbers/phone_123',
				headers: {
					'Authorization': 'Bearer test-token',
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

	describe('deletePhoneNumber', () => {
		it('should delete phone number successfully', async () => {
			const mockResponse = { deleted: true };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deletePhoneNumber')
				.mockReturnValueOnce('phone_123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executePhoneNumberOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://api.clerk.com/v1/phone_numbers/phone_123',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});
});

describe('Invitation Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				bearerToken: 'test-token',
				baseUrl: 'https://api.clerk.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getInvitations operation', () => {
		it('should successfully get invitations', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getInvitations')
				.mockReturnValueOnce('org_123')
				.mockReturnValueOnce(10)
				.mockReturnValueOnce(0)
				.mockReturnValueOnce('pending');

			const mockResponse = [{ id: 'inv_123', email_address: 'test@example.com' }];
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeInvitationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle getInvitations error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getInvitations');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(executeInvitationOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
		});
	});

	describe('createInvitation operation', () => {
		it('should successfully create invitation', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createInvitation')
				.mockReturnValueOnce('org_123')
				.mockReturnValueOnce('test@example.com')
				.mockReturnValueOnce('basic_member')
				.mockReturnValueOnce('{}')
				.mockReturnValueOnce('{}')
				.mockReturnValueOnce('');

			const mockResponse = { id: 'inv_123', email_address: 'test@example.com' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeInvitationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle createInvitation error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('createInvitation');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(executeInvitationOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
		});
	});

	describe('getInvitation operation', () => {
		it('should successfully get invitation', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getInvitation')
				.mockReturnValueOnce('org_123')
				.mockReturnValueOnce('inv_123');

			const mockResponse = { id: 'inv_123', email_address: 'test@example.com' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeInvitationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle getInvitation error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getInvitation');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(executeInvitationOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
		});
	});

	describe('revokeInvitation operation', () => {
		it('should successfully revoke invitation', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('revokeInvitation')
				.mockReturnValueOnce('org_123')
				.mockReturnValueOnce('inv_123');

			const mockResponse = { id: 'inv_123', status: 'revoked' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeInvitationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle revokeInvitation error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('revokeInvitation');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(executeInvitationOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
		});
	});
});

describe('AllowlistIdentifier Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				bearerToken: 'test-token',
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
		it('should get all allowlist identifiers successfully', async () => {
			const mockResponse = {
				data: [
					{ id: 'alid_123', identifier: 'test@example.com', type: 'email_address' },
					{ id: 'alid_124', identifier: '+1234567890', type: 'phone_number' },
				],
				total_count: 2,
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'getAllowlistIdentifiers';
					case 'limit': return 10;
					case 'offset': return 0;
					default: return undefined;
				}
			});

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAllowlistIdentifierOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.clerk.com/v1/allowlist_identifiers?limit=10&offset=0',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle errors when getting allowlist identifiers', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllowlistIdentifiers');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			const result = await executeAllowlistIdentifierOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('createAllowlistIdentifier', () => {
		it('should create allowlist identifier successfully', async () => {
			const mockResponse = {
				id: 'alid_123',
				identifier: 'test@example.com',
				type: 'email_address',
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'createAllowlistIdentifier';
					case 'identifier': return 'test@example.com';
					case 'notify': return true;
					default: return undefined;
				}
			});

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAllowlistIdentifierOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.clerk.com/v1/allowlist_identifiers',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
				body: {
					identifier: 'test@example.com',
					notify: true,
				},
			});
		});

		it('should handle errors when creating allowlist identifier', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('createAllowlistIdentifier');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Creation failed'));

			const result = await executeAllowlistIdentifierOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Creation failed');
		});
	});

	describe('deleteAllowlistIdentifier', () => {
		it('should delete allowlist identifier successfully', async () => {
			const mockResponse = { deleted: true };

			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'deleteAllowlistIdentifier';
					case 'identifierId': return 'alid_123';
					default: return undefined;
				}
			});

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAllowlistIdentifierOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://api.clerk.com/v1/allowlist_identifiers/alid_123',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle errors when deleting allowlist identifier', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('deleteAllowlistIdentifier');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Deletion failed'));

			const result = await executeAllowlistIdentifierOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Deletion failed');
		});
	});
});

describe('BlocklistIdentifier Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        secretKey: 'test-secret-key', 
        baseUrl: 'https://api.clerk.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getBlocklistIdentifiers operation', () => {
    it('should list blocklist identifiers successfully', async () => {
      const mockResponse = { data: [{ id: 'bli_123', identifier: 'blocked@example.com' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlocklistIdentifiers')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(0);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlocklistIdentifierOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.clerk.com/v1/blocklist_identifiers?limit=10&offset=0',
        headers: {
          'Authorization': 'Bearer test-secret-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle errors when listing blocklist identifiers', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getBlocklistIdentifiers');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeBlocklistIdentifierOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('createBlocklistIdentifier operation', () => {
    it('should create blocklist identifier successfully', async () => {
      const mockResponse = { id: 'bli_123', identifier: 'blocked@example.com' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createBlocklistIdentifier')
        .mockReturnValueOnce('blocked@example.com');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlocklistIdentifierOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.clerk.com/v1/blocklist_identifiers',
        headers: {
          'Authorization': 'Bearer test-secret-key',
          'Content-Type': 'application/json',
        },
        body: {
          identifier: 'blocked@example.com',
        },
        json: true,
      });
    });

    it('should handle errors when creating blocklist identifier', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createBlocklistIdentifier');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Creation failed'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeBlocklistIdentifierOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('Creation failed');
    });
  });

  describe('deleteBlocklistIdentifier operation', () => {
    it('should delete blocklist identifier successfully', async () => {
      const mockResponse = { deleted: true };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteBlocklistIdentifier')
        .mockReturnValueOnce('bli_123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlocklistIdentifierOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.clerk.com/v1/blocklist_identifiers/bli_123',
        headers: {
          'Authorization': 'Bearer test-secret-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle errors when deleting blocklist identifier', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('deleteBlocklistIdentifier');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Deletion failed'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeBlocklistIdentifierOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('Deletion failed');
    });
  });
});
});
