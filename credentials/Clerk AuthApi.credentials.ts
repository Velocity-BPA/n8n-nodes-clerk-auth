import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ClerkAuthApi implements ICredentialType {
	name = 'clerkAuthApi';
	displayName = 'Clerk Auth API';
	documentationUrl = 'https://clerk.com/docs/reference/backend-api';
	properties: INodeProperties[] = [
		{
			displayName: 'Secret Key',
			name: 'secretKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Clerk secret key (sk_). Get this from your Clerk Dashboard under API Keys.',
			placeholder: 'sk_test_...',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.clerk.com/v1',
			required: true,
			description: 'Base URL for Clerk API',
		},
	];
}