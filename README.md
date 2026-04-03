# n8n-nodes-clerk-auth

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with Clerk's authentication and user management platform. This node provides comprehensive access to 8 core resources including users, organizations, sessions, email addresses, phone numbers, invitations, and allowlist/blocklist identifiers. Built for modern authentication workflows, it enables seamless user lifecycle management, organization administration, and identity verification processes within your n8n automation workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Authentication](https://img.shields.io/badge/Auth-API%20Key-green)
![Clerk](https://img.shields.io/badge/Clerk-Authentication-purple)
![User Management](https://img.shields.io/badge/User-Management-orange)

## Features

- **Complete User Management** - Create, update, retrieve, and delete users with full profile support
- **Organization Administration** - Manage organizations, memberships, and invitations
- **Session Control** - Monitor and manage user sessions across applications
- **Identity Verification** - Handle email addresses and phone numbers with verification workflows
- **Access Control** - Manage allowlists and blocklists for enhanced security
- **Invitation System** - Create and manage organization and application invitations
- **Real-time Operations** - Execute authentication operations in real-time within workflows
- **Comprehensive Error Handling** - Detailed error responses for troubleshooting and validation

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-clerk-auth`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-clerk-auth
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-clerk-auth.git
cd n8n-nodes-clerk-auth
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-clerk-auth
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Clerk secret API key from the Clerk Dashboard | Yes |
| Instance ID | Your Clerk application instance ID | Yes |
| Environment | Environment (development, staging, production) | Yes |

## Resources & Operations

### 1. User

| Operation | Description |
|-----------|-------------|
| Create | Create a new user with email, phone, or external ID |
| Get | Retrieve user details by user ID |
| Update | Update user profile information and metadata |
| Delete | Permanently delete a user account |
| List | Get paginated list of users with filtering options |
| Ban | Ban a user from the application |
| Unban | Remove ban from a user account |

### 2. Organization

| Operation | Description |
|-----------|-------------|
| Create | Create a new organization with name and settings |
| Get | Retrieve organization details by organization ID |
| Update | Update organization name, logo, and metadata |
| Delete | Delete an organization and all memberships |
| List | Get paginated list of organizations |
| Add Member | Add a user to an organization with specific role |
| Remove Member | Remove a user from an organization |
| Update Member | Update member role and permissions |

### 3. Session

| Operation | Description |
|-----------|-------------|
| Get | Retrieve session details by session ID |
| Revoke | Revoke an active user session |
| List | Get all active sessions for a user |
| Verify | Verify session token validity |

### 4. Email Address

| Operation | Description |
|-----------|-------------|
| Create | Add new email address to user account |
| Get | Retrieve email address details |
| Update | Update email address or set as primary |
| Delete | Remove email address from user account |
| Send Verification | Send verification email to address |
| Verify | Verify email address with code |

### 5. Phone Number

| Operation | Description |
|-----------|-------------|
| Create | Add new phone number to user account |
| Get | Retrieve phone number details |
| Update | Update phone number or set as primary |
| Delete | Remove phone number from user account |
| Send Verification | Send SMS verification code |
| Verify | Verify phone number with code |

### 6. Invitation

| Operation | Description |
|-----------|-------------|
| Create | Create invitation for organization or application |
| Get | Retrieve invitation details by invitation ID |
| Revoke | Cancel pending invitation |
| List | Get paginated list of invitations |
| Resend | Resend invitation email |

### 7. Allowlist Identifier

| Operation | Description |
|-----------|-------------|
| Create | Add email or phone to allowlist |
| Get | Retrieve allowlist entry details |
| Delete | Remove identifier from allowlist |
| List | Get all allowlisted identifiers |

### 8. Blocklist Identifier

| Operation | Description |
|-----------|-------------|
| Create | Add email or phone to blocklist |
| Get | Retrieve blocklist entry details |
| Delete | Remove identifier from blocklist |
| List | Get all blocklisted identifiers |

## Usage Examples

```javascript
// Create a new user with email
{
  "resource": "user",
  "operation": "create",
  "email_address": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "securePassword123"
}
```

```javascript
// Add user to organization
{
  "resource": "organization",
  "operation": "addMember",
  "organization_id": "org_2abc123def456",
  "user_id": "user_2xyz789abc123",
  "role": "basic_member"
}
```

```javascript
// Send email verification
{
  "resource": "emailAddress",
  "operation": "sendVerification",
  "email_address_id": "idn_2email123abc"
}
```

```javascript
// Create organization invitation
{
  "resource": "invitation",
  "operation": "create",
  "email_address": "newmember@example.com",
  "organization_id": "org_2abc123def456",
  "inviter_user_id": "user_2xyz789abc123",
  "role": "basic_member"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key in Clerk Dashboard and update credentials |
| User Not Found | Requested user ID does not exist | Check user ID format and verify user exists |
| Organization Limit Reached | Maximum organizations exceeded for plan | Upgrade Clerk plan or delete unused organizations |
| Email Already Exists | Email address already registered | Use different email or retrieve existing user |
| Invalid Phone Format | Phone number format is incorrect | Use E.164 format (+1234567890) |
| Rate Limit Exceeded | Too many API requests in time window | Implement exponential backoff and retry logic |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-clerk-auth/issues)
- **Clerk Documentation**: [docs.clerk.com](https://docs.clerk.com)
- **API Reference**: [clerk.com/docs/reference](https://clerk.com/docs/reference)