/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-clerkauth/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class ClerkAuth implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Clerk Auth',
    name: 'clerkauth',
    icon: 'file:clerkauth.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Clerk Auth API',
    defaults: {
      name: 'Clerk Auth',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'clerkauthApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'User',
            value: 'user',
          },
          {
            name: 'Organization',
            value: 'organization',
          },
          {
            name: 'Session',
            value: 'session',
          },
          {
            name: 'Email Address',
            value: 'emailAddress',
          },
          {
            name: 'PhoneNumber',
            value: 'phoneNumber',
          },
          {
            name: 'Invitation',
            value: 'invitation',
          },
          {
            name: 'AllowlistIdentifier',
            value: 'allowlistIdentifier',
          },
          {
            name: 'BlocklistIdentifier',
            value: 'blocklistIdentifier',
          }
        ],
        default: 'user',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['user'] } },
  options: [
    { name: 'Get Users', value: 'getUsers', description: 'Retrieve a list of users', action: 'Get users' },
    { name: 'Get User', value: 'getUser', description: 'Retrieve a specific user by ID', action: 'Get a user' },
    { name: 'Create User', value: 'createUser', description: 'Create a new user account', action: 'Create a user' },
    { name: 'Update User', value: 'updateUser', description: 'Update user information', action: 'Update a user' },
    { name: 'Delete User', value: 'deleteUser', description: 'Delete a user account', action: 'Delete a user' },
    { name: 'Ban User', value: 'banUser', description: 'Ban a user account', action: 'Ban a user' },
    { name: 'Unban User', value: 'unbanUser', description: 'Unban a user account', action: 'Unban a user' },
  ],
  default: 'getUsers',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['organization'] } },
  options: [
    { name: 'Get Organizations', value: 'getOrganizations', description: 'Retrieve a list of organizations', action: 'Get organizations' },
    { name: 'Get Organization', value: 'getOrganization', description: 'Retrieve a specific organization', action: 'Get organization' },
    { name: 'Create Organization', value: 'createOrganization', description: 'Create a new organization', action: 'Create organization' },
    { name: 'Update Organization', value: 'updateOrganization', description: 'Update organization details', action: 'Update organization' },
    { name: 'Delete Organization', value: 'deleteOrganization', description: 'Delete an organization', action: 'Delete organization' },
    { name: 'Get Organization Memberships', value: 'getOrganizationMemberships', description: 'Get organization members', action: 'Get organization memberships' },
    { name: 'Create Organization Membership', value: 'createOrganizationMembership', description: 'Add member to organization', action: 'Create organization membership' },
    { name: 'Update Organization Membership', value: 'updateOrganizationMembership', description: 'Update member role', action: 'Update organization membership' },
    { name: 'Delete Organization Membership', value: 'deleteOrganizationMembership', description: 'Remove member from organization', action: 'Delete organization membership' },
  ],
  default: 'getOrganizations',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['session'],
		},
	},
	options: [
		{
			name: 'Get Sessions',
			value: 'getSessions',
			description: 'Retrieve a list of sessions',
			action: 'Get sessions',
		},
		{
			name: 'Get Session',
			value: 'getSession',
			description: 'Retrieve a specific session',
			action: 'Get session',
		},
		{
			name: 'Revoke Session',
			value: 'revokeSession',
			description: 'Revoke a user session',
			action: 'Revoke session',
		},
		{
			name: 'Verify Session',
			value: 'verifySession',
			description: 'Verify session token',
			action: 'Verify session',
		},
		{
			name: 'Get Session Tokens',
			value: 'getSessionTokens',
			description: 'Get session tokens',
			action: 'Get session tokens',
		},
	],
	default: 'getSessions',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['emailAddress'] } },
	options: [
		{
			name: 'Get Email Address',
			value: 'getEmailAddress',
			description: 'Retrieve email address details',
			action: 'Get email address',
		},
		{
			name: 'Create Email Address',
			value: 'createEmailAddress',
			description: 'Create a new email address for user',
			action: 'Create email address',
		},
		{
			name: 'Update Email Address',
			value: 'updateEmailAddress',
			description: 'Update email address',
			action: 'Update email address',
		},
		{
			name: 'Delete Email Address',
			value: 'deleteEmailAddress',
			description: 'Delete an email address',
			action: 'Delete email address',
		},
	],
	default: 'getEmailAddress',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['phoneNumber'],
		},
	},
	options: [
		{
			name: 'Get Phone Number',
			value: 'getPhoneNumber',
			description: 'Retrieve phone number details',
			action: 'Get phone number',
		},
		{
			name: 'Create Phone Number',
			value: 'createPhoneNumber',
			description: 'Create a new phone number for user',
			action: 'Create phone number',
		},
		{
			name: 'Update Phone Number',
			value: 'updatePhoneNumber',
			description: 'Update phone number',
			action: 'Update phone number',
		},
		{
			name: 'Delete Phone Number',
			value: 'deletePhoneNumber',
			description: 'Delete a phone number',
			action: 'Delete phone number',
		},
	],
	default: 'getPhoneNumber',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['invitation'],
		},
	},
	options: [
		{
			name: 'Get Invitations',
			value: 'getInvitations',
			description: 'List organization invitations',
			action: 'Get invitations',
		},
		{
			name: 'Create Invitation',
			value: 'createInvitation',
			description: 'Create organization invitation',
			action: 'Create invitation',
		},
		{
			name: 'Get Invitation',
			value: 'getInvitation',
			description: 'Get specific invitation',
			action: 'Get invitation',
		},
		{
			name: 'Revoke Invitation',
			value: 'revokeInvitation',
			description: 'Revoke an invitation',
			action: 'Revoke invitation',
		},
	],
	default: 'getInvitations',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['allowlistIdentifier'],
		},
	},
	options: [
		{
			name: 'Get All Allowlist Identifiers',
			value: 'getAllowlistIdentifiers',
			description: 'List allowlist identifiers',
			action: 'Get all allowlist identifiers',
		},
		{
			name: 'Create Allowlist Identifier',
			value: 'createAllowlistIdentifier',
			description: 'Add identifier to allowlist',
			action: 'Create allowlist identifier',
		},
		{
			name: 'Delete Allowlist Identifier',
			value: 'deleteAllowlistIdentifier',
			description: 'Remove identifier from allowlist',
			action: 'Delete allowlist identifier',
		},
	],
	default: 'getAllowlistIdentifiers',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['blocklistIdentifier'] } },
  options: [
    { name: 'List Blocklist Identifiers', value: 'getBlocklistIdentifiers', description: 'List blocklist identifiers', action: 'List blocklist identifiers' },
    { name: 'Add Identifier to Blocklist', value: 'createBlocklistIdentifier', description: 'Add identifier to blocklist', action: 'Add identifier to blocklist' },
    { name: 'Remove Identifier from Blocklist', value: 'deleteBlocklistIdentifier', description: 'Remove identifier from blocklist', action: 'Remove identifier from blocklist' }
  ],
  default: 'getBlocklistIdentifiers',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['user'], operation: ['getUsers'] } },
  default: 10,
  description: 'Number of users to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['user'], operation: ['getUsers'] } },
  default: 0,
  description: 'Number of users to skip',
},
{
  displayName: 'Email Address',
  name: 'email_address',
  type: 'string',
  displayOptions: { show: { resource: ['user'], operation: ['getUsers'] } },
  default: '',
  description: 'Filter users by email address',
},
{
  displayName: 'Phone Number',
  name: 'phone_number',
  type: 'string',
  displayOptions: { show: { resource: ['user'], operation: ['getUsers'] } },
  default: '',
  description: 'Filter users by phone number',
},
{
  displayName: 'Username',
  name: 'username',
  type: 'string',
  displayOptions: { show: { resource: ['user'], operation: ['getUsers'] } },
  default: '',
  description: 'Filter users by username',
},
{
  displayName: 'User ID',
  name: 'user_id_filter',
  type: 'string',
  displayOptions: { show: { resource: ['user'], operation: ['getUsers'] } },
  default: '',
  description: 'Filter users by user ID',
},
{
  displayName: 'Order By',
  name: 'order_by',
  type: 'options',
  displayOptions: { show: { resource: ['user'], operation: ['getUsers'] } },
  options: [
    { name: 'Created At', value: 'created_at' },
    { name: 'Updated At', value: 'updated_at' },
    { name: 'Email Address', value: 'email_address' },
    { name: 'Username', value: 'username' },
  ],
  default: 'created_at',
  description: 'Order users by field',
},
{
  displayName: 'User ID',
  name: 'user_id',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['user'], operation: ['getUser', 'updateUser', 'deleteUser', 'banUser', 'unbanUser'] } },
  default: '',
  description: 'The ID of the user',
},
{
  displayName: 'Email Address',
  name: 'email_address',
  type: 'string',
  displayOptions: { show: { resource: ['user'], operation: ['createUser'] } },
  default: '',
  description: 'The email address for the user',
},
{
  displayName: 'Phone Number',
  name: 'phone_number',
  type: 'string',
  displayOptions: { show: { resource: ['user'], operation: ['createUser'] } },
  default: '',
  description: 'The phone number for the user',
},
{
  displayName: 'Username',
  name: 'username',
  type: 'string',
  displayOptions: { show: { resource: ['user'], operation: ['createUser', 'updateUser'] } },
  default: '',
  description: 'The username for the user',
},
{
  displayName: 'Password',
  name: 'password',
  type: 'string',
  typeOptions: { password: true },
  displayOptions: { show: { resource: ['user'], operation: ['createUser', 'updateUser'] } },
  default: '',
  description: 'The password for the user',
},
{
  displayName: 'First Name',
  name: 'first_name',
  type: 'string',
  displayOptions: { show: { resource: ['user'], operation: ['createUser', 'updateUser'] } },
  default: '',
  description: 'The first name of the user',
},
{
  displayName: 'Last Name',
  name: 'last_name',
  type: 'string',
  displayOptions: { show: { resource: ['user'], operation: ['createUser', 'updateUser'] } },
  default: '',
  description: 'The last name of the user',
},
{
  displayName: 'External ID',
  name: 'external_id',
  type: 'string',
  displayOptions: { show: { resource: ['user'], operation: ['createUser', 'updateUser'] } },
  default: '',
  description: 'External ID for the user',
},
{
  displayName: 'Primary Email Address ID',
  name: 'primary_email_address_id',
  type: 'string',
  displayOptions: { show: { resource: ['user'], operation: ['updateUser'] } },
  default: '',
  description: 'The ID of the primary email address',
},
{
  displayName: 'Primary Phone Number ID',
  name: 'primary_phone_number_id',
  type: 'string',
  displayOptions: { show: { resource: ['user'], operation: ['updateUser'] } },
  default: '',
  description: 'The ID of the primary phone number',
},
{
  displayName: 'Profile Image ID',
  name: 'profile_image_id',
  type: 'string',
  displayOptions: { show: { resource: ['user'], operation: ['updateUser'] } },
  default: '',
  description: 'The ID of the profile image',
},
{
  displayName: 'Skip Password Checks',
  name: 'skip_password_checks',
  type: 'boolean',
  displayOptions: { show: { resource: ['user'], operation: ['updateUser'] } },
  default: false,
  description: 'Whether to skip password validation checks',
},
{
  displayName: 'Sign Out of Other Sessions',
  name: 'sign_out_of_other_sessions',
  type: 'boolean',
  displayOptions: { show: { resource: ['user'], operation: ['updateUser'] } },
  default: false,
  description: 'Whether to sign out of other sessions',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['organization'], operation: ['getOrganizations'] } },
  default: 10,
  description: 'Number of organizations to retrieve',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['organization'], operation: ['getOrganizations'] } },
  default: 0,
  description: 'Number of organizations to skip',
},
{
  displayName: 'Include Members Count',
  name: 'include_members_count',
  type: 'boolean',
  displayOptions: { show: { resource: ['organization'], operation: ['getOrganizations', 'getOrganization'] } },
  default: false,
  description: 'Include the count of organization members',
},
{
  displayName: 'Query',
  name: 'query',
  type: 'string',
  displayOptions: { show: { resource: ['organization'], operation: ['getOrganizations'] } },
  default: '',
  description: 'Search query for organizations',
},
{
  displayName: 'Order By',
  name: 'order_by',
  type: 'options',
  displayOptions: { show: { resource: ['organization'], operation: ['getOrganizations', 'getOrganizationMemberships'] } },
  options: [
    { name: 'Created At', value: 'created_at' },
    { name: 'Name', value: 'name' },
    { name: 'Updated At', value: 'updated_at' },
  ],
  default: 'created_at',
  description: 'Field to order results by',
},
{
  displayName: 'Organization ID',
  name: 'organization_id',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['organization'], operation: ['getOrganization', 'updateOrganization', 'deleteOrganization', 'getOrganizationMemberships', 'createOrganizationMembership', 'updateOrganizationMembership', 'deleteOrganizationMembership'] } },
  default: '',
  description: 'The ID of the organization',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['organization'], operation: ['createOrganization'] } },
  default: '',
  description: 'Name of the organization',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  displayOptions: { show: { resource: ['organization'], operation: ['updateOrganization'] } },
  default: '',
  description: 'Name of the organization',
},
{
  displayName: 'Slug',
  name: 'slug',
  type: 'string',
  displayOptions: { show: { resource: ['organization'], operation: ['createOrganization', 'updateOrganization'] } },
  default: '',
  description: 'URL-friendly slug for the organization',
},
{
  displayName: 'Created By',
  name: 'created_by',
  type: 'string',
  displayOptions: { show: { resource: ['organization'], operation: ['createOrganization'] } },
  default: '',
  description: 'User ID of the organization creator',
},
{
  displayName: 'Private Metadata',
  name: 'private_metadata',
  type: 'json',
  displayOptions: { show: { resource: ['organization'], operation: ['createOrganization', 'updateOrganization'] } },
  default: '{}',
  description: 'Private metadata for the organization',
},
{
  displayName: 'Public Metadata',
  name: 'public_metadata',
  type: 'json',
  displayOptions: { show: { resource: ['organization'], operation: ['createOrganization', 'updateOrganization'] } },
  default: '{}',
  description: 'Public metadata for the organization',
},
{
  displayName: 'Max Allowed Memberships',
  name: 'max_allowed_memberships',
  type: 'number',
  displayOptions: { show: { resource: ['organization'], operation: ['createOrganization', 'updateOrganization'] } },
  default: 0,
  description: 'Maximum number of memberships allowed',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['organization'], operation: ['getOrganizationMemberships'] } },
  default: 10,
  description: 'Number of memberships to retrieve',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['organization'], operation: ['getOrganizationMemberships'] } },
  default: 0,
  description: 'Number of memberships to skip',
},
{
  displayName: 'User ID',
  name: 'user_id',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['organization'], operation: ['createOrganizationMembership', 'updateOrganizationMembership', 'deleteOrganizationMembership'] } },
  default: '',
  description: 'The ID of the user',
},
{
  displayName: 'User ID Filter',
  name: 'user_id',
  type: 'string',
  displayOptions: { show: { resource: ['organization'], operation: ['getOrganizationMemberships'] } },
  default: '',
  description: 'Filter by user ID',
},
{
  displayName: 'Email Address',
  name: 'email_address',
  type: 'string',
  displayOptions: { show: { resource: ['organization'], operation: ['getOrganizationMemberships'] } },
  default: '',
  description: 'Filter by email address',
},
{
  displayName: 'Phone Number',
  name: 'phone_number',
  type: 'string',
  displayOptions: { show: { resource: ['organization'], operation: ['getOrganizationMemberships'] } },
  default: '',
  description: 'Filter by phone number',
},
{
  displayName: 'Username',
  name: 'username',
  type: 'string',
  displayOptions: { show: { resource: ['organization'], operation: ['getOrganizationMemberships'] } },
  default: '',
  description: 'Filter by username',
},
{
  displayName: 'Role',
  name: 'role',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['organization'], operation: ['createOrganizationMembership', 'updateOrganizationMembership'] } },
  default: '',
  description: 'Role to assign to the member',
},
{
	displayName: 'Client ID',
	name: 'clientId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['session'],
			operation: ['getSessions'],
		},
	},
	default: '',
	description: 'Filter sessions by client ID',
},
{
	displayName: 'User ID',
	name: 'userId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['session'],
			operation: ['getSessions'],
		},
	},
	default: '',
	description: 'Filter sessions by user ID',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['session'],
			operation: ['getSessions'],
		},
	},
	options: [
		{
			name: 'Active',
			value: 'active',
		},
		{
			name: 'Ended',
			value: 'ended',
		},
		{
			name: 'Expired',
			value: 'expired',
		},
		{
			name: 'Removed',
			value: 'removed',
		},
		{
			name: 'Replaced',
			value: 'replaced',
		},
		{
			name: 'Revoked',
			value: 'revoked',
		},
	],
	default: '',
	description: 'Filter sessions by status',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['session'],
			operation: ['getSessions'],
		},
	},
	default: 10,
	typeOptions: {
		minValue: 1,
		maxValue: 500,
	},
	description: 'Maximum number of sessions to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['session'],
			operation: ['getSessions'],
		},
	},
	default: 0,
	description: 'Number of sessions to skip',
},
{
	displayName: 'Session ID',
	name: 'sessionId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['session'],
			operation: ['getSession', 'revokeSession', 'verifySession', 'getSessionTokens'],
		},
	},
	default: '',
	description: 'The ID of the session',
},
{
	displayName: 'Token',
	name: 'token',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['session'],
			operation: ['verifySession'],
		},
	},
	default: '',
	description: 'The session token to verify',
},
{
	displayName: 'Template',
	name: 'template',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['session'],
			operation: ['getSessionTokens'],
		},
	},
	default: '',
	description: 'Template name for session token generation',
},
{
	displayName: 'Email Address ID',
	name: 'emailAddressId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['emailAddress'],
			operation: ['getEmailAddress'],
		},
	},
	default: '',
	description: 'The ID of the email address to retrieve',
},
{
	displayName: 'User ID',
	name: 'userId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['emailAddress'],
			operation: ['createEmailAddress'],
		},
	},
	default: '',
	description: 'The ID of the user to create the email address for',
},
{
	displayName: 'Email Address',
	name: 'emailAddressValue',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['emailAddress'],
			operation: ['createEmailAddress'],
		},
	},
	default: '',
	description: 'The email address to create',
},
{
	displayName: 'Verified',
	name: 'verified',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['emailAddress'],
			operation: ['createEmailAddress', 'updateEmailAddress'],
		},
	},
	default: false,
	description: 'Whether the email address is verified',
},
{
	displayName: 'Primary',
	name: 'primary',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['emailAddress'],
			operation: ['createEmailAddress', 'updateEmailAddress'],
		},
	},
	default: false,
	description: 'Whether this is the primary email address',
},
{
	displayName: 'Email Address ID',
	name: 'emailAddressId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['emailAddress'],
			operation: ['updateEmailAddress'],
		},
	},
	default: '',
	description: 'The ID of the email address to update',
},
{
	displayName: 'Email Address ID',
	name: 'emailAddressId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['emailAddress'],
			operation: ['deleteEmailAddress'],
		},
	},
	default: '',
	description: 'The ID of the email address to delete',
},
{
	displayName: 'Phone Number ID',
	name: 'phoneNumberId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['phoneNumber'],
			operation: ['getPhoneNumber'],
		},
	},
	default: '',
	description: 'The ID of the phone number to retrieve',
},
{
	displayName: 'User ID',
	name: 'userId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['phoneNumber'],
			operation: ['createPhoneNumber'],
		},
	},
	default: '',
	description: 'The ID of the user to create phone number for',
},
{
	displayName: 'Phone Number',
	name: 'phoneNumber',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['phoneNumber'],
			operation: ['createPhoneNumber'],
		},
	},
	default: '',
	description: 'The phone number to create',
},
{
	displayName: 'Verified',
	name: 'verified',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['phoneNumber'],
			operation: ['createPhoneNumber', 'updatePhoneNumber'],
		},
	},
	default: false,
	description: 'Whether the phone number is verified',
},
{
	displayName: 'Primary',
	name: 'primary',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['phoneNumber'],
			operation: ['createPhoneNumber', 'updatePhoneNumber'],
		},
	},
	default: false,
	description: 'Whether this is the primary phone number',
},
{
	displayName: 'Phone Number ID',
	name: 'phoneNumberId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['phoneNumber'],
			operation: ['updatePhoneNumber'],
		},
	},
	default: '',
	description: 'The ID of the phone number to update',
},
{
	displayName: 'Phone Number ID',
	name: 'phoneNumberId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['phoneNumber'],
			operation: ['deletePhoneNumber'],
		},
	},
	default: '',
	description: 'The ID of the phone number to delete',
},
{
	displayName: 'Organization ID',
	name: 'organizationId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['invitation'],
			operation: ['getInvitations', 'createInvitation', 'getInvitation', 'revokeInvitation'],
		},
	},
	default: '',
	description: 'The organization ID',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['invitation'],
			operation: ['getInvitations'],
		},
	},
	default: 10,
	description: 'Maximum number of invitations to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['invitation'],
			operation: ['getInvitations'],
		},
	},
	default: 0,
	description: 'Number of invitations to skip',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['invitation'],
			operation: ['getInvitations'],
		},
	},
	options: [
		{
			name: 'Pending',
			value: 'pending',
		},
		{
			name: 'Accepted',
			value: 'accepted',
		},
		{
			name: 'Revoked',
			value: 'revoked',
		},
	],
	default: '',
	description: 'Filter invitations by status',
},
{
	displayName: 'Email Address',
	name: 'emailAddress',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['invitation'],
			operation: ['createInvitation'],
		},
	},
	default: '',
	description: 'The email address to send the invitation to',
},
{
	displayName: 'Role',
	name: 'role',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['invitation'],
			operation: ['createInvitation'],
		},
	},
	default: 'basic_member',
	description: 'The role to assign to the invited user',
},
{
	displayName: 'Public Metadata',
	name: 'publicMetadata',
	type: 'json',
	displayOptions: {
		show: {
			resource: ['invitation'],
			operation: ['createInvitation'],
		},
	},
	default: '{}',
	description: 'Public metadata for the invitation',
},
{
	displayName: 'Private Metadata',
	name: 'privateMetadata',
	type: 'json',
	displayOptions: {
		show: {
			resource: ['invitation'],
			operation: ['createInvitation'],
		},
	},
	default: '{}',
	description: 'Private metadata for the invitation',
},
{
	displayName: 'Redirect URL',
	name: 'redirectUrl',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['invitation'],
			operation: ['createInvitation'],
		},
	},
	default: '',
	description: 'URL to redirect to after accepting the invitation',
},
{
	displayName: 'Invitation ID',
	name: 'invitationId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['invitation'],
			operation: ['getInvitation', 'revokeInvitation'],
		},
	},
	default: '',
	description: 'The invitation ID',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 10,
	description: 'Limit the number of results returned',
	displayOptions: {
		show: {
			resource: ['allowlistIdentifier'],
			operation: ['getAllowlistIdentifiers'],
		},
	},
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	default: 0,
	description: 'Skip the specified number of results',
	displayOptions: {
		show: {
			resource: ['allowlistIdentifier'],
			operation: ['getAllowlistIdentifiers'],
		},
	},
},
{
	displayName: 'Identifier',
	name: 'identifier',
	type: 'string',
	required: true,
	default: '',
	description: 'The email address or phone number to add to the allowlist',
	displayOptions: {
		show: {
			resource: ['allowlistIdentifier'],
			operation: ['createAllowlistIdentifier'],
		},
	},
},
{
	displayName: 'Notify',
	name: 'notify',
	type: 'boolean',
	default: true,
	description: 'Whether to notify the user about being added to the allowlist',
	displayOptions: {
		show: {
			resource: ['allowlistIdentifier'],
			operation: ['createAllowlistIdentifier'],
		},
	},
},
{
	displayName: 'Identifier ID',
	name: 'identifierId',
	type: 'string',
	required: true,
	default: '',
	description: 'The ID of the allowlist identifier to delete',
	displayOptions: {
		show: {
			resource: ['allowlistIdentifier'],
			operation: ['deleteAllowlistIdentifier'],
		},
	},
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 10,
  description: 'Applies a limit to the number of results returned',
  displayOptions: {
    show: {
      resource: ['blocklistIdentifier'],
      operation: ['getBlocklistIdentifiers'],
    },
  },
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  default: 0,
  description: 'Skip the first offset results when paginating',
  displayOptions: {
    show: {
      resource: ['blocklistIdentifier'],
      operation: ['getBlocklistIdentifiers'],
    },
  },
},
{
  displayName: 'Identifier',
  name: 'identifier',
  type: 'string',
  required: true,
  default: '',
  description: 'Email address or phone number to add to blocklist',
  displayOptions: {
    show: {
      resource: ['blocklistIdentifier'],
      operation: ['createBlocklistIdentifier'],
    },
  },
},
{
  displayName: 'Identifier ID',
  name: 'identifierId',
  type: 'string',
  required: true,
  default: '',
  description: 'The ID of the blocklist identifier to remove',
  displayOptions: {
    show: {
      resource: ['blocklistIdentifier'],
      operation: ['deleteBlocklistIdentifier'],
    },
  },
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'user':
        return [await executeUserOperations.call(this, items)];
      case 'organization':
        return [await executeOrganizationOperations.call(this, items)];
      case 'session':
        return [await executeSessionOperations.call(this, items)];
      case 'emailAddress':
        return [await executeEmailAddressOperations.call(this, items)];
      case 'phoneNumber':
        return [await executePhoneNumberOperations.call(this, items)];
      case 'invitation':
        return [await executeInvitationOperations.call(this, items)];
      case 'allowlistIdentifier':
        return [await executeAllowlistIdentifierOperations.call(this, items)];
      case 'blocklistIdentifier':
        return [await executeBlocklistIdentifierOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeUserOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('clerkauthApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getUsers': {
          const queryParams: any = {};
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const email_address = this.getNodeParameter('email_address', i) as string;
          const phone_number = this.getNodeParameter('phone_number', i) as string;
          const username = this.getNodeParameter('username', i) as string;
          const user_id_filter = this.getNodeParameter('user_id_filter', i) as string;
          const order_by = this.getNodeParameter('order_by', i) as string;

          if (limit) queryParams.limit = limit;
          if (offset) queryParams.offset = offset;
          if (email_address) queryParams.email_address = email_address;
          if (phone_number) queryParams.phone_number = phone_number;
          if (username) queryParams.username = username;
          if (user_id_filter) queryParams.user_id = user_id_filter;
          if (order_by) queryParams.order_by = order_by;

          const queryString = Object.keys(queryParams).length > 0 ? '?' + new URLSearchParams(queryParams).toString() : '';

          const options: any = {
            method: 'GET',
            url: `https://api.clerk.com/v1/users${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getUser': {
          const user_id = this.getNodeParameter('user_id', i) as string;

          const options: any = {
            method: 'GET',
            url: `https://api.clerk.com/v1/users/${user_id}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createUser': {
          const body: any = {};
          const email_address = this.getNodeParameter('email_address', i) as string;
          const phone_number = this.getNodeParameter('phone_number', i) as string;
          const username = this.getNodeParameter('username', i) as string;
          const password = this.getNodeParameter('password', i) as string;
          const first_name = this.getNodeParameter('first_name', i) as string;
          const last_name = this.getNodeParameter('last_name', i) as string;
          const external_id = this.getNodeParameter('external_id', i) as string;

          if (email_address) body.email_address = email_address;
          if (phone_number) body.phone_number = phone_number;
          if (username) body.username = username;
          if (password) body.password = password;
          if (first_name) body.first_name = first_name;
          if (last_name) body.last_name = last_name;
          if (external_id) body.external_id = external_id;

          const options: any = {
            method: 'POST',
            url: 'https://api.clerk.com/v1/users',
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateUser': {
          const user_id = this.getNodeParameter('user_id', i) as string;
          const body: any = {};
          const first_name = this.getNodeParameter('first_name', i) as string;
          const last_name = this.getNodeParameter('last_name', i) as string;
          const primary_email_address_id = this.getNodeParameter('primary_email_address_id', i) as string;
          const primary_phone_number_id = this.getNodeParameter('primary_phone_number_id', i) as string;
          const username = this.getNodeParameter('username', i) as string;
          const profile_image_id = this.getNodeParameter('profile_image_id', i) as string;
          const password = this.getNodeParameter('password', i) as string;
          const skip_password_checks = this.getNodeParameter('skip_password_checks', i) as boolean;
          const sign_out_of_other_sessions = this.getNodeParameter('sign_out_of_other_sessions', i) as boolean;
          const external_id = this.getNodeParameter('external_id', i) as string;

          if (first_name) body.first_name = first_name;
          if (last_name) body.last_name = last_name;
          if (primary_email_address_id) body.primary_email_address_id = primary_email_address_id;
          if (primary_phone_number_id) body.primary_phone_number_id = primary_phone_number_id;
          if (username) body.username = username;
          if (profile_image_id) body.profile_image_id = profile_image_id;
          if (password) body.password = password;
          if (skip_password_checks) body.skip_password_checks = skip_password_checks;
          if (sign_out_of_other_sessions) body.sign_out_of_other_sessions = sign_out_of_other_sessions;
          if (external_id) body.external_id = external_id;

          const options: any = {
            method: 'PATCH',
            url: `https://api.clerk.com/v1/users/${user_id}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteUser': {
          const user_id = this.getNodeParameter('user_id', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `https://api.clerk.com/v1/users/${user_id}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'banUser': {
          const user_id = this.getNodeParameter('user_id', i) as string;

          const options: any = {
            method: 'POST',
            url: `https://api.clerk.com/v1/users/${user_id}/ban`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'unbanUser': {
          const user_id = this.getNodeParameter('user_id', i) as string;

          const options: any = {
            method: 'POST',
            url: `https://api.clerk.com/v1/users/${user_id}/unban`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeOrganizationOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('clerkauthApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getOrganizations': {
          const limit = this.getNodeParameter('limit', i, 10) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          const includeMembersCount = this.getNodeParameter('include_members_count', i, false) as boolean;
          const query = this.getNodeParameter('query', i, '') as string;
          const orderBy = this.getNodeParameter('order_by', i, 'created_at') as string;

          const queryParams: string[] = [];
          queryParams.push(`limit=${limit}`);
          queryParams.push(`offset=${offset}`);
          if (includeMembersCount) queryParams.push('include_members_count=true');
          if (query) queryParams.push(`query=${encodeURIComponent(query)}`);
          queryParams.push(`order_by=${orderBy}`);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/organizations?${queryParams.join('&')}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrganization': {
          const organizationId = this.getNodeParameter('organization_id', i) as string;
          const includeMembersCount = this.getNodeParameter('include_members_count', i, false) as boolean;

          const queryParams: string[] = [];
          if (includeMembersCount) queryParams.push('include_members_count=true');

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/organizations/${organizationId}${queryParams.length ? '?' + queryParams.join('&') : ''}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createOrganization': {
          const name = this.getNodeParameter('name', i) as string;
          const slug = this.getNodeParameter('slug', i, '') as string;
          const createdBy = this.getNodeParameter('created_by', i, '') as string;
          const privateMetadata = this.getNodeParameter('private_metadata', i, '{}') as string;
          const publicMetadata = this.getNodeParameter('public_metadata', i, '{}') as string;
          const maxAllowedMemberships = this.getNodeParameter('max_allowed_memberships', i, 0) as number;

          const body: any = { name };
          if (slug) body.slug = slug;
          if (createdBy) body.created_by = createdBy;
          if (privateMetadata !== '{}') body.private_metadata = JSON.parse(privateMetadata);
          if (publicMetadata !== '{}') body.public_metadata = JSON.parse(publicMetadata);
          if (maxAllowedMemberships > 0) body.max_allowed_memberships = maxAllowedMemberships;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/organizations`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateOrganization': {
          const organizationId = this.getNodeParameter('organization_id', i) as string;
          const name = this.getNodeParameter('name', i, '') as string;
          const slug = this.getNodeParameter('slug', i, '') as string;
          const privateMetadata = this.getNodeParameter('private_metadata', i, '{}') as string;
          const publicMetadata = this.getNodeParameter('public_metadata', i, '{}') as string;
          const maxAllowedMemberships = this.getNodeParameter('max_allowed_memberships', i, 0) as number;

          const body: any = {};
          if (name) body.name = name;
          if (slug) body.slug = slug;
          if (privateMetadata !== '{}') body.private_metadata = JSON.parse(privateMetadata);
          if (publicMetadata !== '{}') body.public_metadata = JSON.parse(publicMetadata);
          if (maxAllowedMemberships > 0) body.max_allowed_memberships = maxAllowedMemberships;

          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/organizations/${organizationId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteOrganization': {
          const organizationId = this.getNodeParameter('organization_id', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/organizations/${organizationId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrganizationMemberships': {
          const organizationId = this.getNodeParameter('organization_id', i) as string;
          const limit = this.getNodeParameter('limit', i, 10) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          const userId = this.getNodeParameter('user_id', i, '') as string;
          const emailAddress = this.getNodeParameter('email_address', i, '') as string;
          const phoneNumber = this.getNodeParameter('phone_number', i, '') as string;
          const username = this.getNodeParameter('username', i, '') as string;
          const orderBy = this.getNodeParameter('order_by', i, 'created_at') as string;

          const queryParams: string[] = [];
          queryParams.push(`limit=${limit}`);
          queryParams.push(`offset=${offset}`);
          if (userId) queryParams.push(`user_id=${userId}`);
          if (emailAddress) queryParams.push(`email_address=${encodeURIComponent(emailAddress)}`);
          if (phoneNumber) queryParams.push(`phone_number=${encodeURIComponent(phoneNumber)}`);
          if (username) queryParams.push(`username=${encodeURIComponent(username)}`);
          queryParams.push(`order_by=${orderBy}`);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/organizations/${organizationId}/memberships?${queryParams.join('&')}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createOrganizationMembership': {
          const organizationId = this.getNodeParameter('organization_id', i) as string;
          const userId = this.getNodeParameter('user_id', i) as string;
          const role = this.getNodeParameter('role', i) as string;

          const body: any = {
            user_id: userId,
            role: role,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/organizations/${organizationId}/memberships`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateOrganizationMembership': {
          const organizationId = this.getNodeParameter('organization_id', i) as string;
          const userId = this.getNodeParameter('user_id', i) as string;
          const role = this.getNodeParameter('role', i) as string;

          const body: any = {
            role: role,
          };

          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/organizations/${organizationId}/memberships/${userId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteOrganizationMembership': {
          const organizationId = this.getNodeParameter('organization_id', i) as string;
          const userId = this.getNodeParameter('user_id', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/organizations/${organizationId}/memberships/${userId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeSessionOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('clerkauthApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getSessions': {
					const clientId = this.getNodeParameter('clientId', i) as string;
					const userId = this.getNodeParameter('userId', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const queryParams = new URLSearchParams();
					if (clientId) queryParams.append('client_id', clientId);
					if (userId) queryParams.append('user_id', userId);
					if (status) queryParams.append('status', status);
					if (limit) queryParams.append('limit', limit.toString());
					if (offset) queryParams.append('offset', offset.toString());

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/sessions?${queryParams.toString()}`,
						headers: {
							Authorization: `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getSession': {
					const sessionId = this.getNodeParameter('sessionId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/sessions/${sessionId}`,
						headers: {
							Authorization: `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'revokeSession': {
					const sessionId = this.getNodeParameter('sessionId', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/sessions/${sessionId}/revoke`,
						headers: {
							Authorization: `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'verifySession': {
					const sessionId = this.getNodeParameter('sessionId', i) as string;
					const token = this.getNodeParameter('token', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/sessions/${sessionId}/verify`,
						headers: {
							Authorization: `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						body: {
							token: token,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getSessionTokens': {
					const sessionId = this.getNodeParameter('sessionId', i) as string;
					const template = this.getNodeParameter('template', i) as string;

					const queryParams = new URLSearchParams();
					if (template) queryParams.append('template', template);

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/sessions/${sessionId}/tokens?${queryParams.toString()}`,
						headers: {
							Authorization: `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({ json: result, pairedItem: { item: i } });
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeEmailAddressOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('clerkauthApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getEmailAddress': {
					const emailAddressId = this.getNodeParameter('emailAddressId', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/email_addresses/${emailAddressId}`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createEmailAddress': {
					const userId = this.getNodeParameter('userId', i) as string;
					const emailAddressValue = this.getNodeParameter('emailAddressValue', i) as string;
					const verified = this.getNodeParameter('verified', i) as boolean;
					const primary = this.getNodeParameter('primary', i) as boolean;

					const body: any = {
						user_id: userId,
						email_address: emailAddressValue,
						verified,
						primary,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/email_addresses`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateEmailAddress': {
					const emailAddressId = this.getNodeParameter('emailAddressId', i) as string;
					const verified = this.getNodeParameter('verified', i) as boolean;
					const primary = this.getNodeParameter('primary', i) as boolean;

					const body: any = {
						verified,
						primary,
					};

					const options: any = {
						method: 'PATCH',
						url: `${credentials.baseUrl}/email_addresses/${emailAddressId}`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteEmailAddress': {
					const emailAddressId = this.getNodeParameter('emailAddressId', i) as string;
					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/email_addresses/${emailAddressId}`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executePhoneNumberOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('clerkauthApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getPhoneNumber': {
					const phoneNumberId = this.getNodeParameter('phoneNumberId', i) as string;
					
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/phone_numbers/${phoneNumberId}`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createPhoneNumber': {
					const userId = this.getNodeParameter('userId', i) as string;
					const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
					const verified = this.getNodeParameter('verified', i) as boolean;
					const primary = this.getNodeParameter('primary', i) as boolean;

					const body: any = {
						user_id: userId,
						phone_number: phoneNumber,
						verified,
						primary,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/phone_numbers`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updatePhoneNumber': {
					const phoneNumberId = this.getNodeParameter('phoneNumberId', i) as string;
					const verified = this.getNodeParameter('verified', i) as boolean;
					const primary = this.getNodeParameter('primary', i) as boolean;

					const body: any = {
						verified,
						primary,
					};

					const options: any = {
						method: 'PATCH',
						url: `${credentials.baseUrl}/phone_numbers/${phoneNumberId}`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deletePhoneNumber': {
					const phoneNumberId = this.getNodeParameter('phoneNumberId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/phone_numbers/${phoneNumberId}`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeInvitationOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('clerkauthApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getInvitations': {
					const organizationId = this.getNodeParameter('organizationId', i) as string;
					const limit = this.getNodeParameter('limit', i, 10) as number;
					const offset = this.getNodeParameter('offset', i, 0) as number;
					const status = this.getNodeParameter('status', i, '') as string;

					const queryParams = new URLSearchParams();
					if (limit) queryParams.append('limit', limit.toString());
					if (offset) queryParams.append('offset', offset.toString());
					if (status) queryParams.append('status', status);

					const url = `${credentials.baseUrl}/organizations/${organizationId}/invitations${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createInvitation': {
					const organizationId = this.getNodeParameter('organizationId', i) as string;
					const emailAddress = this.getNodeParameter('emailAddress', i) as string;
					const role = this.getNodeParameter('role', i) as string;
					const publicMetadata = this.getNodeParameter('publicMetadata', i, '{}') as string;
					const privateMetadata = this.getNodeParameter('privateMetadata', i, '{}') as string;
					const redirectUrl = this.getNodeParameter('redirectUrl', i, '') as string;

					const body: any = {
						email_address: emailAddress,
						role: role,
					};

					try {
						const parsedPublicMetadata = JSON.parse(publicMetadata);
						if (Object.keys(parsedPublicMetadata).length > 0) {
							body.public_metadata = parsedPublicMetadata;
						}
					} catch (error: any) {
						// Ignore invalid JSON
					}

					try {
						const parsedPrivateMetadata = JSON.parse(privateMetadata);
						if (Object.keys(parsedPrivateMetadata).length > 0) {
							body.private_metadata = parsedPrivateMetadata;
						}
					} catch (error: any) {
						// Ignore invalid JSON
					}

					if (redirectUrl) {
						body.redirect_url = redirectUrl;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/organizations/${organizationId}/invitations`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getInvitation': {
					const organizationId = this.getNodeParameter('organizationId', i) as string;
					const invitationId = this.getNodeParameter('invitationId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/organizations/${organizationId}/invitations/${invitationId}`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'revokeInvitation': {
					const organizationId = this.getNodeParameter('organizationId', i) as string;
					const invitationId = this.getNodeParameter('invitationId', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/organizations/${organizationId}/invitations/${invitationId}/revoke`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeAllowlistIdentifierOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('clerkauthApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAllowlistIdentifiers': {
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;

					const queryParams = new URLSearchParams();
					if (limit) queryParams.append('limit', limit.toString());
					if (offset) queryParams.append('offset', offset.toString());

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/allowlist_identifiers?${queryParams.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createAllowlistIdentifier': {
					const identifier = this.getNodeParameter('identifier', i) as string;
					const notify = this.getNodeParameter('notify', i) as boolean;

					const body: any = {
						identifier,
						notify,
					};

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/allowlist_identifiers`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
						body,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteAllowlistIdentifier': {
					const identifierId = this.getNodeParameter('identifierId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/allowlist_identifiers/${identifierId}`,
						headers: {
							'Authorization': `Bearer ${credentials.bearerToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeBlocklistIdentifierOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('clerkauthApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getBlocklistIdentifiers': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const queryParams = new URLSearchParams();
          if (limit) queryParams.append('limit', limit.toString());
          if (offset) queryParams.append('offset', offset.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://api.clerk.com/v1'}/blocklist_identifiers${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
            headers: {
              'Authorization': `Bearer ${credentials.secretKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createBlocklistIdentifier': {
          const identifier = this.getNodeParameter('identifier', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.clerk.com/v1'}/blocklist_identifiers`,
            headers: {
              'Authorization': `Bearer ${credentials.secretKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              identifier,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteBlocklistIdentifier': {
          const identifierId = this.getNodeParameter('identifierId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl || 'https://api.clerk.com/v1'}/blocklist_identifiers/${identifierId}`,
            headers: {
              'Authorization': `Bearer ${credentials.secretKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
