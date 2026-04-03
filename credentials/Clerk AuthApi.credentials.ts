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
			description: 'Your Clerk secret key (starts with sk_). Get this from the Clerk Dashboard under API Keys.',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.clerk.com/v1',
			description: 'The base URL for the Clerk API',
		},
	];
}