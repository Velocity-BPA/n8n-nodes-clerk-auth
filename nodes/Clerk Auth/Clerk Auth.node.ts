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
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Users',
            value: 'users',
          },
          {
            name: 'Organizations',
            value: 'organizations',
          },
          {
            name: 'Sessions',
            value: 'sessions',
          },
          {
            name: 'EmailAddresses',
            value: 'emailAddresses',
          },
          {
            name: 'PhoneNumbers',
            value: 'phoneNumbers',
          },
          {
            name: 'Invitations',
            value: 'invitations',
          },
          {
            name: 'AllowlistIdentifiers',
            value: 'allowlistIdentifiers',
          },
          {
            name: 'BlocklistIdentifiers',
            value: 'blocklistIdentifiers',
          },
          {
            name: 'JwtTemplates',
            value: 'jwtTemplates',
          }
        ],
        default: 'users',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['users'],
    },
  },
  options: [
    {
      name: 'Get Users',
      value: 'getUsers',
      description: 'Retrieve all users with pagination',
      action: 'Get users',
    },
    {
      name: 'Get User',
      value: 'getUser',
      description: 'Get a specific user by ID',
      action: 'Get user',
    },
    {
      name: 'Create User',
      value: 'createUser',
      description: 'Create a new user account',
      action: 'Create user',
    },
    {
      name: 'Update User',
      value: 'updateUser',
      description: 'Update user information',
      action: 'Update user',
    },
    {
      name: 'Delete User',
      value: 'deleteUser',
      description: 'Delete a user account',
      action: 'Delete user',
    },
    {
      name: 'Get OAuth Access Token',
      value: 'getUserOAuthAccessToken',
      description: 'Get user\'s OAuth access token',
      action: 'Get OAuth access token',
    },
    {
      name: 'Ban User',
      value: 'banUser',
      description: 'Ban a user account',
      action: 'Ban user',
    },
    {
      name: 'Unban User',
      value: 'unbanUser',
      description: 'Unban a user account',
      action: 'Unban user',
    },
    {
      name: 'Lock User',
      value: 'lockUser',
      description: 'Lock a user account',
      action: 'Lock user',
    },
    {
      name: 'Unlock User',
      value: 'unlockUser',
      description: 'Unlock a user account',
      action: 'Unlock user',
    },
  ],
  default: 'getUsers',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['organizations'],
    },
  },
  options: [
    {
      name: 'Get Organizations',
      value: 'getOrganizations',
      description: 'List all organizations',
      action: 'Get organizations',
    },
    {
      name: 'Get Organization',
      value: 'getOrganization',
      description: 'Get specific organization',
      action: 'Get organization',
    },
    {
      name: 'Create Organization',
      value: 'createOrganization',
      description: 'Create new organization',
      action: 'Create organization',
    },
    {
      name: 'Update Organization',
      value: 'updateOrganization',
      description: 'Update organization',
      action: 'Update organization',
    },
    {
      name: 'Delete Organization',
      value: 'deleteOrganization',
      description: 'Delete organization',
      action: 'Delete organization',
    },
    {
      name: 'Get Organization Memberships',
      value: 'getOrganizationMemberships',
      description: 'List organization members',
      action: 'Get organization memberships',
    },
    {
      name: 'Create Organization Membership',
      value: 'createOrganizationMembership',
      description: 'Add member to organization',
      action: 'Create organization membership',
    },
    {
      name: 'Update Organization Membership',
      value: 'updateOrganizationMembership',
      description: 'Update member role',
      action: 'Update organization membership',
    },
    {
      name: 'Delete Organization Membership',
      value: 'deleteOrganizationMembership',
      description: 'Remove member',
      action: 'Delete organization membership',
    },
    {
      name: 'Get Organization Invitations',
      value: 'getOrganizationInvitations',
      description: 'List pending invitations',
      action: 'Get organization invitations',
    },
    {
      name: 'Create Organization Invitation',
      value: 'createOrganizationInvitation',
      description: 'Invite user to organization',
      action: 'Create organization invitation',
    },
    {
      name: 'Revoke Organization Invitation',
      value: 'revokeOrganizationInvitation',
      description: 'Revoke invitation',
      action: 'Revoke organization invitation',
    },
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
      resource: ['sessions'],
    },
  },
  options: [
    {
      name: 'Get Sessions',
      value: 'getSessions',
      description: 'List all sessions',
      action: 'Get sessions',
    },
    {
      name: 'Get Session',
      value: 'getSession',
      description: 'Get specific session',
      action: 'Get session',
    },
    {
      name: 'Revoke Session',
      value: 'revokeSession',
      description: 'Revoke a session',
      action: 'Revoke session',
    },
    {
      name: 'Verify Session',
      value: 'verifySession',
      description: 'Verify session token',
      action: 'Verify session',
    },
    {
      name: 'Get Session Token',
      value: 'getSessionToken',
      description: 'Get session token',
      action: 'Get session token',
    },
  ],
  default: 'getSessions',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['emailAddresses'],
    },
  },
  options: [
    {
      name: 'Get Email Address',
      value: 'getEmailAddress',
      description: 'Get email address details',
      action: 'Get email address',
    },
    {
      name: 'Create Email Address',
      value: 'createEmailAddress',
      description: 'Create email address for user',
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
      description: 'Delete email address',
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
      resource: ['phoneNumbers'],
    },
  },
  options: [
    {
      name: 'Get Phone Number',
      value: 'getPhoneNumber',
      description: 'Get phone number details',
      action: 'Get phone number details',
    },
    {
      name: 'Create Phone Number',
      value: 'createPhoneNumber',
      description: 'Create phone number for user',
      action: 'Create phone number for user',
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
      description: 'Delete phone number',
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
      resource: ['invitations'],
    },
  },
  options: [
    {
      name: 'Get Invitations',
      value: 'getInvitations',
      description: 'List all invitations',
      action: 'Get invitations',
    },
    {
      name: 'Create Invitation',
      value: 'createInvitation',
      description: 'Create new invitation',
      action: 'Create invitation',
    },
    {
      name: 'Revoke Invitation',
      value: 'revokeInvitation',
      description: 'Revoke invitation',
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
      resource: ['allowlistIdentifiers'],
    },
  },
  options: [
    {
      name: 'Get All Allowlist Identifiers',
      value: 'getAllowlistIdentifiers',
      description: 'List all allowlist entries',
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
  displayOptions: {
    show: {
      resource: ['blocklistIdentifiers'],
    },
  },
  options: [
    {
      name: 'Get Blocklist Identifiers',
      value: 'getBlocklistIdentifiers',
      description: 'List all blocklist entries',
      action: 'Get blocklist identifiers',
    },
    {
      name: 'Create Blocklist Identifier',
      value: 'createBlocklistIdentifier',
      description: 'Add identifier to blocklist',
      action: 'Create blocklist identifier',
    },
    {
      name: 'Delete Blocklist Identifier',
      value: 'deleteBlocklistIdentifier',
      description: 'Remove identifier from blocklist',
      action: 'Delete blocklist identifier',
    },
  ],
  default: 'getBlocklistIdentifiers',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['jwtTemplates'],
    },
  },
  options: [
    {
      name: 'Get JWT Templates',
      value: 'getJwtTemplates',
      description: 'List all JWT templates',
      action: 'Get JWT templates',
    },
    {
      name: 'Get JWT Template',
      value: 'getJwtTemplate',
      description: 'Get a specific JWT template by ID',
      action: 'Get JWT template',
    },
    {
      name: 'Create JWT Template',
      value: 'createJwtTemplate',
      description: 'Create a new JWT template',
      action: 'Create JWT template',
    },
    {
      name: 'Update JWT Template',
      value: 'updateJwtTemplate',
      description: 'Update an existing JWT template',
      action: 'Update JWT template',
    },
    {
      name: 'Delete JWT Template',
      value: 'deleteJwtTemplate',
      description: 'Delete a JWT template',
      action: 'Delete JWT template',
    },
  ],
  default: 'getJwtTemplates',
},
      // Parameter definitions
{
  displayName: 'User ID',
  name: 'userId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUser', 'updateUser', 'deleteUser', 'getUserOAuthAccessToken', 'banUser', 'unbanUser', 'lockUser', 'unlockUser'],
    },
  },
  default: '',
  description: 'The unique identifier for the user',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUsers'],
    },
  },
  default: 10,
  description: 'The maximum number of users to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUsers'],
    },
  },
  default: 0,
  description: 'The number of users to skip',
},
{
  displayName: 'Email Address',
  name: 'emailAddress',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUsers', 'createUser'],
    },
  },
  default: '',
  description: 'Filter by email address or set email for new user',
},
{
  displayName: 'Phone Number',
  name: 'phoneNumber',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUsers', 'createUser'],
    },
  },
  default: '',
  description: 'Filter by phone number or set phone number for new user',
},
{
  displayName: 'Username',
  name: 'username',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUsers', 'createUser', 'updateUser'],
    },
  },
  default: '',
  description: 'Filter by username or set username for user',
},
{
  displayName: 'Organization ID',
  name: 'organizationId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUsers'],
    },
  },
  default: '',
  description: 'Filter users by organization ID',
},
{
  displayName: 'Query',
  name: 'query',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUsers'],
    },
  },
  default: '',
  description: 'Search query for users',
},
{
  displayName: 'Last Active Since',
  name: 'lastActiveAtSince',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUsers'],
    },
  },
  default: '',
  description: 'Filter users active since this date',
},
{
  displayName: 'Password',
  name: 'password',
  type: 'string',
  typeOptions: { password: true },
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['createUser', 'updateUser'],
    },
  },
  default: '',
  description: 'User password',
},
{
  displayName: 'First Name',
  name: 'firstName',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['createUser', 'updateUser'],
    },
  },
  default: '',
  description: 'User first name',
},
{
  displayName: 'Last Name',
  name: 'lastName',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['createUser', 'updateUser'],
    },
  },
  default: '',
  description: 'User last name',
},
{
  displayName: 'External ID',
  name: 'externalId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['createUser'],
    },
  },
  default: '',
  description: 'External system identifier',
},
{
  displayName: 'Primary Email Address ID',
  name: 'primaryEmailAddressId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['updateUser'],
    },
  },
  default: '',
  description: 'ID of the primary email address',
},
{
  displayName: 'Primary Phone Number ID',
  name: 'primaryPhoneNumberId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['updateUser'],
    },
  },
  default: '',
  description: 'ID of the primary phone number',
},
{
  displayName: 'Primary Web3 Wallet ID',
  name: 'primaryWeb3WalletId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['updateUser'],
    },
  },
  default: '',
  description: 'ID of the primary Web3 wallet',
},
{
  displayName: 'Profile Image ID',
  name: 'profileImageId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['updateUser'],
    },
  },
  default: '',
  description: 'ID of the profile image',
},
{
  displayName: 'Skip Password Checks',
  name: 'skipPasswordChecks',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['updateUser'],
    },
  },
  default: false,
  description: 'Whether to skip password validation checks',
},
{
  displayName: 'Sign Out of Other Sessions',
  name: 'signOutOfOtherSessions',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['updateUser'],
    },
  },
  default: false,
  description: 'Whether to sign out of other sessions after update',
},
{
  displayName: 'Private Metadata',
  name: 'privateMetadata',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['createUser', 'updateUser'],
    },
  },
  default: '{}',
  description: 'Private metadata only visible to backend',
},
{
  displayName: 'Public Metadata',
  name: 'publicMetadata',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['createUser', 'updateUser'],
    },
  },
  default: '{}',
  description: 'Public metadata visible to frontend',
},
{
  displayName: 'Unsafe Metadata',
  name: 'unsafeMetadata',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['createUser', 'updateUser'],
    },
  },
  default: '{}',
  description: 'Unsafe metadata that can be updated from frontend',
},
{
  displayName: 'OAuth Provider',
  name: 'provider',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['users'],
      operation: ['getUserOAuthAccessToken'],
    },
  },
  options: [
    { name: 'Google', value: 'google' },
    { name: 'Facebook', value: 'facebook' },
    { name: 'Twitter', value: 'twitter' },
    { name: 'GitHub', value: 'github' },
    { name: 'LinkedIn', value: 'linkedin' },
  ],
  default: 'google',
  description: 'OAuth provider name',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['getOrganizations'],
    },
  },
  default: 10,
  description: 'Maximum number of organizations to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['getOrganizations'],
    },
  },
  default: 0,
  description: 'Number of organizations to skip',
},
{
  displayName: 'Include Members Count',
  name: 'include_members_count',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['getOrganizations', 'getOrganization'],
    },
  },
  default: false,
  description: 'Include member count in response',
},
{
  displayName: 'Query',
  name: 'query',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['getOrganizations'],
    },
  },
  default: '',
  description: 'Search query to filter organizations',
},
{
  displayName: 'Order By',
  name: 'order_by',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['getOrganizations', 'getOrganizationMemberships'],
    },
  },
  options: [
    {
      name: 'Created At',
      value: 'created_at',
    },
    {
      name: 'Name',
      value: 'name',
    },
  ],
  default: 'created_at',
  description: 'Order results by field',
},
{
  displayName: 'Organization ID',
  name: 'organization_id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['getOrganization', 'updateOrganization', 'deleteOrganization', 'getOrganizationMemberships', 'createOrganizationMembership', 'updateOrganizationMembership', 'deleteOrganizationMembership', 'getOrganizationInvitations', 'createOrganizationInvitation', 'revokeOrganizationInvitation'],
    },
  },
  default: '',
  description: 'The ID of the organization',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['createOrganization'],
    },
  },
  default: '',
  description: 'The name of the organization',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['updateOrganization'],
    },
  },
  default: '',
  description: 'The name of the organization',
},
{
  displayName: 'Slug',
  name: 'slug',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['createOrganization', 'updateOrganization'],
    },
  },
  default: '',
  description: 'The slug of the organization',
},
{
  displayName: 'Created By',
  name: 'created_by',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['createOrganization'],
    },
  },
  default: '',
  description: 'The user ID who created the organization',
},
{
  displayName: 'Private Metadata',
  name: 'private_metadata',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['createOrganization', 'updateOrganization', 'updateOrganizationMembership'],
    },
  },
  default: '{}',
  description: 'Private metadata for the organization or membership',
},
{
  displayName: 'Public Metadata',
  name: 'public_metadata',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['createOrganization', 'updateOrganization', 'updateOrganizationMembership', 'createOrganizationInvitation'],
    },
  },
  default: '{}',
  description: 'Public metadata for the organization, membership, or invitation',
},
{
  displayName: 'Max Allowed Memberships',
  name: 'max_allowed_memberships',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['createOrganization', 'updateOrganization'],
    },
  },
  default: null,
  description: 'Maximum number of memberships allowed',
},
{
  displayName: 'Email Address',
  name: 'email_address',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['getOrganizationMemberships'],
    },
  },
  default: '',
  description: 'Filter memberships by email address',
},
{
  displayName: 'Email Address',
  name: 'email_address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['createOrganizationInvitation'],
    },
  },
  default: '',
  description: 'Email address to invite',
},
{
  displayName: 'Phone Number',
  name: 'phone_number',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['getOrganizationMemberships'],
    },
  },
  default: '',
  description: 'Filter memberships by phone number',
},
{
  displayName: 'Username',
  name: 'username',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['getOrganizationMemberships'],
    },
  },
  default: '',
  description: 'Filter memberships by username',
},
{
  displayName: 'User ID',
  name: 'user_id',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['getOrganizationMemberships'],
    },
  },
  default: '',
  description: 'Filter memberships by user ID',
},
{
  displayName: 'User ID',
  name: 'user_id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['createOrganizationMembership', 'updateOrganizationMembership', 'deleteOrganizationMembership'],
    },
  },
  default: '',
  description: 'The user ID for the membership',
},
{
  displayName: 'Role',
  name: 'role',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['getOrganizationMemberships'],
    },
  },
  default: '',
  description: 'Filter memberships by role',
},
{
  displayName: 'Role',
  name: 'role',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['createOrganizationMembership', 'updateOrganizationMembership', 'createOrganizationInvitation'],
    },
  },
  default: 'basic_member',
  description: 'The role for the membership or invitation',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['getOrganizationInvitations'],
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
  default: 'pending',
  description: 'Filter invitations by status',
},
{
  displayName: 'Inviter User ID',
  name: 'inviter_user_id',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['createOrganizationInvitation'],
    },
  },
  default: '',
  description: 'The user ID who is sending the invitation',
},
{
  displayName: 'Redirect URL',
  name: 'redirect_url',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['createOrganizationInvitation'],
    },
  },
  default: '',
  description: 'URL to redirect to after accepting invitation',
},
{
  displayName: 'Invitation ID',
  name: 'invitation_id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['revokeOrganizationInvitation'],
    },
  },
  default: '',
  description: 'The ID of the invitation to revoke',
},
{
  displayName: 'Client ID',
  name: 'clientId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['sessions'],
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
      resource: ['sessions'],
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
      resource: ['sessions'],
      operation: ['getSessions'],
    },
  },
  options: [
    {
      name: 'Active',
      value: 'active',
    },
    {
      name: 'Expired',
      value: 'expired',
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
      resource: ['sessions'],
      operation: ['getSessions'],
    },
  },
  default: 10,
  description: 'Maximum number of sessions to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['sessions'],
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
      resource: ['sessions'],
      operation: ['getSession'],
    },
  },
  default: '',
  description: 'The session ID',
},
{
  displayName: 'Session ID',
  name: 'sessionId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['sessions'],
      operation: ['revokeSession'],
    },
  },
  default: '',
  description: 'The session ID to revoke',
},
{
  displayName: 'Session ID',
  name: 'sessionId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['sessions'],
      operation: ['verifySession'],
    },
  },
  default: '',
  description: 'The session ID to verify',
},
{
  displayName: 'Token',
  name: 'token',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['sessions'],
      operation: ['verifySession'],
    },
  },
  default: '',
  description: 'The session token to verify',
},
{
  displayName: 'Session ID',
  name: 'sessionId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['sessions'],
      operation: ['getSessionToken'],
    },
  },
  default: '',
  description: 'The session ID',
},
{
  displayName: 'Template Name',
  name: 'templateName',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['sessions'],
      operation: ['getSessionToken'],
    },
  },
  default: '',
  description: 'The template name for the token',
},
{
  displayName: 'Email Address ID',
  name: 'emailAddressId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['emailAddresses'],
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
      resource: ['emailAddresses'],
      operation: ['createEmailAddress'],
    },
  },
  default: '',
  description: 'The ID of the user to create the email address for',
},
{
  displayName: 'Email Address',
  name: 'emailAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['emailAddresses'],
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
  required: false,
  displayOptions: {
    show: {
      resource: ['emailAddresses'],
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
  required: false,
  displayOptions: {
    show: {
      resource: ['emailAddresses'],
      operation: ['createEmailAddress', 'updateEmailAddress'],
    },
  },
  default: false,
  description: 'Whether the email address is the primary email',
},
{
  displayName: 'Email Address ID',
  name: 'emailAddressId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['emailAddresses'],
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
      resource: ['emailAddresses'],
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
      resource: ['phoneNumbers'],
      operation: ['getPhoneNumber'],
    },
  },
  default: '',
  description: 'The unique identifier of the phone number',
},
{
  displayName: 'User ID',
  name: 'userId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['phoneNumbers'],
      operation: ['createPhoneNumber'],
    },
  },
  default: '',
  description: 'The unique identifier of the user',
},
{
  displayName: 'Phone Number',
  name: 'phoneNumber',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['phoneNumbers'],
      operation: ['createPhoneNumber'],
    },
  },
  default: '',
  description: 'The phone number to associate with the user',
},
{
  displayName: 'Verified',
  name: 'verified',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['phoneNumbers'],
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
      resource: ['phoneNumbers'],
      operation: ['createPhoneNumber', 'updatePhoneNumber'],
    },
  },
  default: false,
  description: 'Whether the phone number is primary',
},
{
  displayName: 'Phone Number ID',
  name: 'phoneNumberId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['phoneNumbers'],
      operation: ['updatePhoneNumber'],
    },
  },
  default: '',
  description: 'The unique identifier of the phone number to update',
},
{
  displayName: 'Phone Number ID',
  name: 'phoneNumberId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['phoneNumbers'],
      operation: ['deletePhoneNumber'],
    },
  },
  default: '',
  description: 'The unique identifier of the phone number to delete',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['invitations'],
      operation: ['getInvitations'],
    },
  },
  default: 20,
  description: 'Maximum number of invitations to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['invitations'],
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
      resource: ['invitations'],
      operation: ['getInvitations'],
    },
  },
  options: [
    {
      name: 'All',
      value: '',
    },
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
  name: 'email_address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['invitations'],
      operation: ['createInvitation'],
    },
  },
  default: '',
  description: 'The email address of the person to invite',
},
{
  displayName: 'Private Metadata',
  name: 'private_metadata',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['invitations'],
      operation: ['createInvitation'],
    },
  },
  default: '{}',
  description: 'Private metadata to attach to the invitation',
},
{
  displayName: 'Public Metadata',
  name: 'public_metadata',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['invitations'],
      operation: ['createInvitation'],
    },
  },
  default: '{}',
  description: 'Public metadata to attach to the invitation',
},
{
  displayName: 'Redirect URL',
  name: 'redirect_url',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['invitations'],
      operation: ['createInvitation'],
    },
  },
  default: '',
  description: 'URL to redirect to after accepting the invitation',
},
{
  displayName: 'Notify',
  name: 'notify',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['invitations'],
      operation: ['createInvitation'],
    },
  },
  default: true,
  description: 'Whether to send an email notification',
},
{
  displayName: 'Ignore Existing',
  name: 'ignore_existing',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['invitations'],
      operation: ['createInvitation'],
    },
  },
  default: false,
  description: 'Whether to ignore if user already exists',
},
{
  displayName: 'Invitation ID',
  name: 'invitation_id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['invitations'],
      operation: ['revokeInvitation'],
    },
  },
  default: '',
  description: 'The ID of the invitation to revoke',
},
{
  displayName: 'Identifier',
  name: 'identifier',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['allowlistIdentifiers'],
      operation: ['createAllowlistIdentifier'],
    },
  },
  default: '',
  description: 'The identifier to add to the allowlist (email address or phone number)',
},
{
  displayName: 'Notify',
  name: 'notify',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['allowlistIdentifiers'],
      operation: ['createAllowlistIdentifier'],
    },
  },
  default: true,
  description: 'Whether to notify the user via email',
},
{
  displayName: 'Identifier ID',
  name: 'identifierId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['allowlistIdentifiers'],
      operation: ['deleteAllowlistIdentifier'],
    },
  },
  default: '',
  description: 'The ID of the allowlist identifier to delete',
},
{
  displayName: 'Identifier',
  name: 'identifier',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blocklistIdentifiers'],
      operation: ['createBlocklistIdentifier'],
    },
  },
  default: '',
  description: 'The identifier to add to the blocklist (email address or phone number)',
},
{
  displayName: 'Identifier ID',
  name: 'identifierId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blocklistIdentifiers'],
      operation: ['deleteBlocklistIdentifier'],
    },
  },
  default: '',
  description: 'The ID of the blocklist identifier to delete',
},
{
  displayName: 'Template ID',
  name: 'templateId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['jwtTemplates'],
      operation: ['getJwtTemplate', 'updateJwtTemplate', 'deleteJwtTemplate'],
    },
  },
  default: '',
  description: 'The ID of the JWT template',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['jwtTemplates'],
      operation: ['createJwtTemplate'],
    },
  },
  default: '',
  description: 'The name of the JWT template',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['jwtTemplates'],
      operation: ['updateJwtTemplate'],
    },
  },
  default: '',
  description: 'The name of the JWT template',
},
{
  displayName: 'Claims',
  name: 'claims',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['jwtTemplates'],
      operation: ['createJwtTemplate', 'updateJwtTemplate'],
    },
  },
  default: '{}',
  description: 'Custom claims to include in the JWT token',
},
{
  displayName: 'Lifetime (seconds)',
  name: 'lifetime',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['jwtTemplates'],
      operation: ['createJwtTemplate', 'updateJwtTemplate'],
    },
  },
  default: 3600,
  description: 'The lifetime of the JWT token in seconds',
},
{
  displayName: 'Allowed Clock Skew (seconds)',
  name: 'allowedClockSkew',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['jwtTemplates'],
      operation: ['createJwtTemplate', 'updateJwtTemplate'],
    },
  },
  default: 5,
  description: 'The allowed clock skew in seconds',
},
{
  displayName: 'Custom Signing Key',
  name: 'customSigningKey',
  type: 'boolean',
  required: false,
  displayOptions: {
    show: {
      resource: ['jwtTemplates'],
      operation: ['createJwtTemplate', 'updateJwtTemplate'],
    },
  },
  default: false,
  description: 'Whether to use a custom signing key',
},
{
  displayName: 'Signing Algorithm',
  name: 'signingAlgorithm',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['jwtTemplates'],
      operation: ['createJwtTemplate', 'updateJwtTemplate'],
    },
  },
  options: [
    {
      name: 'RS256',
      value: 'RS256',
    },
    {
      name: 'RS384',
      value: 'RS384',
    },
    {
      name: 'RS512',
      value: 'RS512',
    },
    {
      name: 'ES256',
      value: 'ES256',
    },
    {
      name: 'ES384',
      value: 'ES384',
    },
    {
      name: 'ES512',
      value: 'ES512',
    },
  ],
  default: 'RS256',
  description: 'The signing algorithm to use',
},
{
  displayName: 'Signing Key',
  name: 'signingKey',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['jwtTemplates'],
      operation: ['createJwtTemplate', 'updateJwtTemplate'],
      customSigningKey: [true],
    },
  },
  default: '',
  description: 'The custom signing key to use',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'users':
        return [await executeUsersOperations.call(this, items)];
      case 'organizations':
        return [await executeOrganizationsOperations.call(this, items)];
      case 'sessions':
        return [await executeSessionsOperations.call(this, items)];
      case 'emailAddresses':
        return [await executeEmailAddressesOperations.call(this, items)];
      case 'phoneNumbers':
        return [await executePhoneNumbersOperations.call(this, items)];
      case 'invitations':
        return [await executeInvitationsOperations.call(this, items)];
      case 'allowlistIdentifiers':
        return [await executeAllowlistIdentifiersOperations.call(this, items)];
      case 'blocklistIdentifiers':
        return [await executeBlocklistIdentifiersOperations.call(this, items)];
      case 'jwtTemplates':
        return [await executeJwtTemplatesOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeUsersOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('clerkauthApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = 'https://api.clerk.com/v1';

      switch (operation) {
        case 'getUsers': {
          const queryParams: any = {};
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const emailAddress = this.getNodeParameter('emailAddress', i) as string;
          const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
          const username = this.getNodeParameter('username', i) as string;
          const organizationId = this.getNodeParameter('organizationId', i) as string;
          const query = this.getNodeParameter('query', i) as string;
          const lastActiveAtSince = this.getNodeParameter('lastActiveAtSince', i) as string;

          if (limit) queryParams.limit = limit;
          if (offset) queryParams.offset = offset;
          if (emailAddress) queryParams.email_address = emailAddress;
          if (phoneNumber) queryParams.phone_number = phoneNumber;
          if (username) queryParams.username = username;
          if (organizationId) queryParams.organization_id = organizationId;
          if (query) queryParams.query = query;
          if (lastActiveAtSince) queryParams.last_active_at_since = new Date(lastActiveAtSince).getTime();

          const queryString = new URLSearchParams(queryParams).toString();
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/users${queryString ? '?' + queryString : ''}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getUser': {
          const userId = this.getNodeParameter('userId', i) as string;
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/users/${userId}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createUser': {
          const body: any = {};
          const emailAddress = this.getNodeParameter('emailAddress', i) as string;
          const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
          const username = this.getNodeParameter('username', i) as string;
          const password = this.getNodeParameter('password', i) as string;
          const firstName = this.getNodeParameter('firstName', i) as string;
          const lastName = this.getNodeParameter('lastName', i) as string;
          const externalId = this.getNodeParameter('externalId', i) as string;
          const privateMetadata = this.getNodeParameter('privateMetadata', i) as string;
          const publicMetadata = this.getNodeParameter('publicMetadata', i) as string;
          const unsafeMetadata = this.getNodeParameter('unsafeMetadata', i) as string;

          if (emailAddress) body.email_address = [emailAddress];
          if (phoneNumber) body.phone_number = [phoneNumber];
          if (username) body.username = username;
          if (password) body.password = password;
          if (firstName) body.first_name = firstName;
          if (lastName) body.last_name = lastName;
          if (externalId) body.external_id = externalId;
          if (privateMetadata) body.private_metadata = JSON.parse(privateMetadata);
          if (publicMetadata) body.public_metadata = JSON.parse(publicMetadata);
          if (unsafeMetadata) body.unsafe_metadata = JSON.parse(unsafeMetadata);

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/users`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
            json: body,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateUser': {
          const userId = this.getNodeParameter('userId', i) as string;
          const body: any = {};
          const firstName = this.getNodeParameter('firstName', i) as string;
          const lastName = this.getNodeParameter('lastName', i) as string;
          const primaryEmailAddressId = this.getNodeParameter('primaryEmailAddressId', i) as string;
          const primaryPhoneNumberId = this.getNodeParameter('primaryPhoneNumberId', i) as string;
          const primaryWeb3WalletId = this.getNodeParameter('primaryWeb3WalletId', i) as string;
          const username = this.getNodeParameter('username', i) as string;
          const profileImageId = this.getNodeParameter('profileImageId', i) as string;
          const password = this.getNodeParameter('password', i) as string;
          const skipPasswordChecks = this.getNodeParameter('skipPasswordChecks', i) as boolean;
          const signOutOfOtherSessions = this.getNodeParameter('signOutOfOtherSessions', i) as boolean;
          const privateMetadata = this.getNodeParameter('privateMetadata', i) as string;
          const publicMetadata = this.getNodeParameter('publicMetadata', i) as string;
          const unsafeMetadata = this.getNodeParameter('unsafeMetadata', i) as string;

          if (firstName) body.first_name = firstName;
          if (lastName) body.last_name = lastName;
          if (primaryEmailAddressId) body.primary_email_address_id = primaryEmailAddressId;
          if (primaryPhoneNumberId) body.primary_phone_number_id = primaryPhoneNumberId;
          if (primaryWeb3WalletId) body.primary_web3_wallet_id = primaryWeb3WalletId;
          if (username) body.username = username;
          if (profileImageId) body.profile_image_id = profileImageId;
          if (password) body.password = password;
          if (skipPasswordChecks) body.skip_password_checks = skipPasswordChecks;
          if (signOutOfOtherSessions) body.sign_out_of_other_sessions = signOutOfOtherSessions;
          if (privateMetadata) body.private_metadata = JSON.parse(privateMetadata);
          if (publicMetadata) body.public_metadata = JSON.parse(publicMetadata);
          if (unsafeMetadata) body.unsafe_metadata = JSON.parse(unsafeMetadata);

          const options: any = {
            method: 'PATCH',
            url: `${baseUrl}/users/${userId}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
            json: body,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteUser': {
          const userId = this.getNodeParameter('userId', i) as string;
          const options: any = {
            method: 'DELETE',
            url: `${baseUrl}/users/${userId}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getUserOAuthAccessToken': {
          const userId = this.getNodeParameter('userId', i) as string;
          const provider = this.getNodeParameter('provider', i) as string;
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/users/${userId}/oauth_access_tokens/${provider}`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'banUser': {
          const userId = this.getNodeParameter('userId', i) as string;
          const options: any = {
            method: 'POST',
            url: `${baseUrl}/users/${userId}/ban`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'unbanUser': {
          const userId = this.getNodeParameter('userId', i) as string;
          const options: any = {
            method: 'POST',
            url: `${baseUrl}/users/${userId}/unban`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'lockUser': {
          const userId = this.getNodeParameter('userId', i) as string;
          const options: any = {
            method: 'POST',
            url: `${baseUrl}/users/${userId}/lock`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'unlockUser': {
          const userId = this.getNodeParameter('userId', i) as string;
          const options: any = {
            method: 'POST',
            url: `${baseUrl}/users/${userId}/unlock`,
            headers: {
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
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
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.response?.status) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }

  return returnData;
}

async function executeOrganizationsOperations(
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
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const includeMembersCount = this.getNodeParameter('include_members_count', i) as boolean;
          const query = this.getNodeParameter('query', i) as string;
          const orderBy = this.getNodeParameter('order_by', i) as string;

          const queryParams = new URLSearchParams();
          if (limit) queryParams.append('limit', limit.toString());
          if (offset) queryParams.append('offset', offset.toString());
          if (includeMembersCount) queryParams.append('include_members_count', 'true');
          if (query) queryParams.append('query', query);
          if (orderBy) queryParams.append('order_by', orderBy);

          const options: any = {
            method: 'GET',
            url: `https://api.clerk.com/v1/organizations?${queryParams.toString()}`,
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrganization': {
          const organizationId = this.getNodeParameter('organization_id', i) as string;
          const includeMembersCount = this.getNodeParameter('include_members_count', i) as boolean;

          const queryParams = new URLSearchParams();
          if (includeMembersCount) queryParams.append('include_members_count', 'true');

          const options: any = {
            method: 'GET',
            url: `https://api.clerk.com/v1/organizations/${organizationId}?${queryParams.toString()}`,
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createOrganization': {
          const name = this.getNodeParameter('name', i) as string;
          const slug = this.getNodeParameter('slug', i) as string;
          const createdBy = this.getNodeParameter('created_by', i) as string;
          const privateMetadata = this.getNodeParameter('private_metadata', i) as string;
          const publicMetadata = this.getNodeParameter('public_metadata', i) as string;
          const maxAllowedMemberships = this.getNodeParameter('max_allowed_memberships', i) as number;

          const body: any = { name };
          if (slug) body.slug = slug;
          if (createdBy) body.created_by = createdBy;
          if (privateMetadata) body.private_metadata = JSON.parse(privateMetadata);
          if (publicMetadata) body.public_metadata = JSON.parse(publicMetadata);
          if (maxAllowedMemberships) body.max_allowed_memberships = maxAllowedMemberships;

          const options: any = {
            method: 'POST',
            url: 'https://api.clerk.com/v1/organizations',
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
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
          const name = this.getNodeParameter('name', i) as string;
          const slug = this.getNodeParameter('slug', i) as string;
          const privateMetadata = this.getNodeParameter('private_metadata', i) as string;
          const publicMetadata = this.getNodeParameter('public_metadata', i) as string;
          const maxAllowedMemberships = this.getNodeParameter('max_allowed_memberships', i) as number;

          const body: any = {};
          if (name) body.name = name;
          if (slug) body.slug = slug;
          if (privateMetadata) body.private_metadata = JSON.parse(privateMetadata);
          if (publicMetadata) body.public_metadata = JSON.parse(publicMetadata);
          if (maxAllowedMemberships) body.max_allowed_memberships = maxAllowedMemberships;

          const options: any = {
            method: 'PATCH',
            url: `https://api.clerk.com/v1/organizations/${organizationId}`,
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
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
            url: `https://api.clerk.com/v1/organizations/${organizationId}`,
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrganizationMemberships': {
          const organizationId = this.getNodeParameter('organization_id', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const emailAddress = this.getNodeParameter('email_address', i) as string;
          const phoneNumber = this.getNodeParameter('phone_number', i) as string;
          const username = this.getNodeParameter('username', i) as string;
          const userId = this.getNodeParameter('user_id', i) as string;
          const role = this.getNodeParameter('role', i) as string;
          const orderBy = this.getNodeParameter('order_by', i) as string;

          const queryParams = new URLSearchParams();
          if (limit) queryParams.append('limit', limit.toString());
          if (offset) queryParams.append('offset', offset.toString());
          if (emailAddress) queryParams.append('email_address', emailAddress);
          if (phoneNumber) queryParams.append('phone_number', phoneNumber);
          if (username) queryParams.append('username', username);
          if (userId) queryParams.append('user_id', userId);
          if (role) queryParams.append('role', role);
          if (orderBy) queryParams.append('order_by', orderBy);

          const options: any = {
            method: 'GET',
            url: `https://api.clerk.com/v1/organizations/${organizationId}/memberships?${queryParams.toString()}`,
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
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
            role,
          };

          const options: any = {
            method: 'POST',
            url: `https://api.clerk.com/v1/organizations/${organizationId}/memberships`,
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
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
          const privateMetadata = this.getNodeParameter('private_metadata', i) as string;
          const publicMetadata = this.getNodeParameter('public_metadata', i) as string;

          const body: any = {
            role,
          };
          if (privateMetadata) body.private_metadata = JSON.parse(privateMetadata);
          if (publicMetadata) body.public_metadata = JSON.parse(publicMetadata);

          const options: any = {
            method: 'PATCH',
            url: `https://api.clerk.com/v1/organizations/${organizationId}/memberships/${userId}`,
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
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
            url: `https://api.clerk.com/v1/organizations/${organizationId}/memberships/${userId}`,
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrganizationInvitations': {
          const organizationId = this.getNodeParameter('organization_id', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const status = this.getNodeParameter('status', i) as string;

          const queryParams = new URLSearchParams();
          if (limit) queryParams.append('limit', limit.toString());
          if (offset) queryParams.append('offset', offset.toString());
          if (status) queryParams.append('status', status);

          const options: any = {
            method: 'GET',
            url: `https://api.clerk.com/v1/organizations/${organizationId}/invitations?${queryParams.toString()}`,
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createOrganizationInvitation': {
          const organizationId = this.getNodeParameter('organization_id', i) as string;
          const emailAddress = this.getNodeParameter('email_address', i) as string;
          const inviterUserId = this.getNodeParameter('inviter_user_id', i) as string;
          const role = this.getNodeParameter('role', i) as string;
          const privateMetadata = this.getNodeParameter('private_metadata', i) as string;
          const publicMetadata = this.getNodeParameter('public_metadata', i) as string;
          const redirectUrl = this.getNodeParameter('redirect_url', i) as string;

          const body: any = {
            email_address: emailAddress,
            role,
          };
          if (inviterUserId) body.inviter_user_id = inviterUserId;
          if (privateMetadata) body.private_metadata = JSON.parse(privateMetadata);
          if (publicMetadata) body.public_metadata = JSON.parse(publicMetadata);
          if (redirectUrl) body.redirect_url = redirectUrl;

          const options: any = {
            method: 'POST',
            url: `https://api.clerk.com/v1/organizations/${organizationId}/invitations`,
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'revokeOrganizationInvitation': {
          const organizationId = this.getNodeParameter('organization_id', i) as string;
          const invitationId = this.getNodeParameter('invitation_id', i) as string;

          const options: any = {
            method: 'POST',
            url: `https://api.clerk.com/v1/organizations/${organizationId}/invitations/${invitationId}/revoke`,
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
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
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeSessionsOperations(
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
          const queryParams: any = {};
          const clientId = this.getNodeParameter('clientId', i) as string;
          const userId = this.getNodeParameter('userId', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          if (clientId) queryParams.client_id = clientId;
          if (userId) queryParams.user_id = userId;
          if (status) queryParams.status = status;
          if (limit) queryParams.limit = limit;
          if (offset) queryParams.offset = offset;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/sessions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: queryParams,
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
              'Authorization': `Bearer ${credentials.apiKey}`,
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
              'Authorization': `Bearer ${credentials.apiKey}`,
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
              'Authorization': `Bearer ${credentials.apiKey}`,
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

        case 'getSessionToken': {
          const sessionId = this.getNodeParameter('sessionId', i) as string;
          const templateName = this.getNodeParameter('templateName', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/sessions/${sessionId}/tokens/${templateName}`,
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
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeEmailAddressesOperations(
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
            url: `${credentials.baseUrl || 'https://api.clerk.com/v1'}/email_addresses/${emailAddressId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createEmailAddress': {
          const userId = this.getNodeParameter('userId', i) as string;
          const emailAddress = this.getNodeParameter('emailAddress', i) as string;
          const verified = this.getNodeParameter('verified', i, false) as boolean;
          const primary = this.getNodeParameter('primary', i, false) as boolean;

          const body: any = {
            user_id: userId,
            email_address: emailAddress,
            verified,
            primary,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://api.clerk.com/v1'}/email_addresses`,
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

        case 'updateEmailAddress': {
          const emailAddressId = this.getNodeParameter('emailAddressId', i) as string;
          const verified = this.getNodeParameter('verified', i, undefined) as boolean | undefined;
          const primary = this.getNodeParameter('primary', i, undefined) as boolean | undefined;

          const body: any = {};
          if (verified !== undefined) {
            body.verified = verified;
          }
          if (primary !== undefined) {
            body.primary = primary;
          }

          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl || 'https://api.clerk.com/v1'}/email_addresses/${emailAddressId}`,
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

        case 'deleteEmailAddress': {
          const emailAddressId = this.getNodeParameter('emailAddressId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl || 'https://api.clerk.com/v1'}/email_addresses/${emailAddressId}`,
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
        if (error.response && error.response.body) {
          throw new NodeApiError(this.getNode(), error.response.body, { itemIndex: i });
        }
        throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
      }
    }
  }

  return returnData;
}

async function executePhoneNumbersOperations(
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
              Authorization: `Bearer ${credentials.apiKey}`,
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
          };
          
          if (verified !== undefined) {
            body.verified = verified;
          }
          
          if (primary !== undefined) {
            body.primary = primary;
          }
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/phone_numbers`,
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
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
          
          const body: any = {};
          
          if (verified !== undefined) {
            body.verified = verified;
          }
          
          if (primary !== undefined) {
            body.primary = primary;
          }
          
          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/phone_numbers/${phoneNumberId}`,
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
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
              Authorization: `Bearer ${credentials.apiKey}`,
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
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }
  
  return returnData;
}

async function executeInvitationsOperations(
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
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const status = this.getNodeParameter('status', i) as string;

          const queryParams: any = {
            limit: limit.toString(),
            offset: offset.toString(),
          };

          if (status) {
            queryParams.status = status;
          }

          const queryString = new URLSearchParams(queryParams).toString();

          const options: any = {
            method: 'GET',
            url: `https://api.clerk.com/v1/invitations?${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createInvitation': {
          const emailAddress = this.getNodeParameter('email_address', i) as string;
          const privateMetadata = this.getNodeParameter('private_metadata', i) as string;
          const publicMetadata = this.getNodeParameter('public_metadata', i) as string;
          const redirectUrl = this.getNodeParameter('redirect_url', i) as string;
          const notify = this.getNodeParameter('notify', i) as boolean;
          const ignoreExisting = this.getNodeParameter('ignore_existing', i) as boolean;

          const body: any = {
            email_address: emailAddress,
            notify,
            ignore_existing: ignoreExisting,
          };

          try {
            if (privateMetadata && privateMetadata !== '{}') {
              body.private_metadata = JSON.parse(privateMetadata);
            }
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid private_metadata JSON: ${error.message}`);
          }

          try {
            if (publicMetadata && publicMetadata !== '{}') {
              body.public_metadata = JSON.parse(publicMetadata);
            }
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid public_metadata JSON: ${error.message}`);
          }

          if (redirectUrl) {
            body.redirect_url = redirectUrl;
          }

          const options: any = {
            method: 'POST',
            url: 'https://api.clerk.com/v1/invitations',
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

        case 'revokeInvitation': {
          const invitationId = this.getNodeParameter('invitation_id', i) as string;

          const options: any = {
            method: 'POST',
            url: `https://api.clerk.com/v1/invitations/${invitationId}/revoke`,
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
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeAllowlistIdentifiersOperations(
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
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/allowlist_identifiers`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
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
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
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
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
            itemIndex: i,
          });
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
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error, { itemIndex: i });
        }
        throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
      }
    }
  }

  return returnData;
}

async function executeBlocklistIdentifiersOperations(
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
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/blocklist_identifiers`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
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
            url: `${credentials.baseUrl}/blocklist_identifiers`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              identifier: identifier,
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
            url: `${credentials.baseUrl}/blocklist_identifiers/${identifierId}`,
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
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }

  return returnData;
}

async function executeJwtTemplatesOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('clerkauthApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = 'https://api.clerk.com/v1';
      const headers = {
        'Authorization': `Bearer ${credentials.bearerToken}`,
        'Content-Type': 'application/json',
      };

      switch (operation) {
        case 'getJwtTemplates': {
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/jwt_templates`,
            headers,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getJwtTemplate': {
          const templateId = this.getNodeParameter('templateId', i) as string;
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/jwt_templates/${templateId}`,
            headers,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createJwtTemplate': {
          const name = this.getNodeParameter('name', i) as string;
          const claims = this.getNodeParameter('claims', i, '{}') as string;
          const lifetime = this.getNodeParameter('lifetime', i, 3600) as number;
          const allowedClockSkew = this.getNodeParameter('allowedClockSkew', i, 5) as number;
          const customSigningKey = this.getNodeParameter('customSigningKey', i, false) as boolean;
          const signingAlgorithm = this.getNodeParameter('signingAlgorithm', i, 'RS256') as string;
          const signingKey = this.getNodeParameter('signingKey', i, '') as string;

          const body: any = {
            name,
            lifetime,
            allowed_clock_skew: allowedClockSkew,
            custom_signing_key: customSigningKey,
            signing_algorithm: signingAlgorithm,
          };

          try {
            body.claims = JSON.parse(claims);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid JSON in claims: ${error.message}`, { itemIndex: i });
          }

          if (customSigningKey && signingKey) {
            body.signing_key = signingKey;
          }

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/jwt_templates`,
            headers,
            body,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateJwtTemplate': {
          const templateId = this.getNodeParameter('templateId', i) as string;
          const name = this.getNodeParameter('name', i, '') as string;
          const claims = this.getNodeParameter('claims', i, '') as string;
          const lifetime = this.getNodeParameter('lifetime', i) as number;
          const allowedClockSkew = this.getNodeParameter('allowedClockSkew', i) as number;
          const customSigningKey = this.getNodeParameter('customSigningKey', i) as boolean;
          const signingAlgorithm = this.getNodeParameter('signingAlgorithm', i) as string;
          const signingKey = this.getNodeParameter('signingKey', i, '') as string;

          const body: any = {};

          if (name) body.name = name;
          if (lifetime !== undefined) body.lifetime = lifetime;
          if (allowedClockSkew !== undefined) body.allowed_clock_skew = allowedClockSkew;
          if (customSigningKey !== undefined) body.custom_signing_key = customSigningKey;
          if (signingAlgorithm) body.signing_algorithm = signingAlgorithm;
          if (customSigningKey && signingKey) body.signing_key = signingKey;

          if (claims) {
            try {
              body.claims = JSON.parse(claims);
            } catch (error: any) {
              throw new NodeOperationError(this.getNode(), `Invalid JSON in claims: ${error.message}`, { itemIndex: i });
            }
          }

          const options: any = {
            method: 'PATCH',
            url: `${baseUrl}/jwt_templates/${templateId}`,
            headers,
            body,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteJwtTemplate': {
          const templateId = this.getNodeParameter('templateId', i) as string;
          const options: any = {
            method: 'DELETE',
            url: `${baseUrl}/jwt_templates/${templateId}`,
            headers,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { itemIndex: i });
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        if (error instanceof NodeApiError || error instanceof NodeOperationError) {
          throw error;
        }
        throw new NodeApiError(this.getNode(), error, { itemIndex: i });
      }
    }
  }

  return returnData;
}
