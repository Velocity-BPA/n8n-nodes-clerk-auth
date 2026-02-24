# n8n-nodes-clerk-auth

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with Clerk's user management and authentication platform. This node provides access to 9 core Clerk resources including Users, Organizations, Sessions, EmailAddresses, PhoneNumbers, Invitations, and identifier management (Allowlist/Blocklist), plus JWT template operations for comprehensive user authentication workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Clerk](https://img.shields.io/badge/Clerk-Auth%20Platform-purple)
![API](https://img.shields.io/badge/API-REST-green)
![Auth](https://img.shields.io/badge/Auth-API%20Key-orange)

## Features

- **Complete User Management** - Create, read, update, delete, and manage user accounts with full profile control
- **Organization Operations** - Handle multi-tenant organization structures, memberships, and invitations
- **Session Management** - Monitor and control user sessions, authentication states, and access tokens
- **Contact Information** - Manage email addresses and phone numbers with verification workflows
- **Invitation System** - Send and manage organization invitations with custom workflows
- **Access Control** - Configure allowlist and blocklist identifiers for domain and email restrictions
- **JWT Template Management** - Create and manage custom JWT templates for authentication tokens
- **Error Handling** - Comprehensive error handling with detailed Clerk API error responses

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
| API Key | Your Clerk secret API key (starts with `sk_`) | ✅ |
| Instance ID | Your Clerk instance/application ID | ✅ |
| Base URL | Clerk API base URL (defaults to api.clerk.com) | ❌ |

## Resources & Operations

### 1. Users

| Operation | Description |
|-----------|-------------|
| Create | Create a new user account |
| Get | Retrieve user by ID |
| Update | Update user properties |
| Delete | Delete a user account |
| List | List all users with filtering |
| Ban | Ban a user from the application |
| Unban | Unban a previously banned user |

### 2. Organizations

| Operation | Description |
|-----------|-------------|
| Create | Create a new organization |
| Get | Retrieve organization by ID |
| Update | Update organization details |
| Delete | Delete an organization |
| List | List all organizations |
| Get Memberships | Get organization memberships |
| Update Membership | Update membership roles and metadata |
| Remove Membership | Remove a user from organization |

### 3. Sessions

| Operation | Description |
|-----------|-------------|
| Get | Retrieve session by ID |
| List | List user sessions |
| Revoke | Revoke/invalidate a session |
| Verify | Verify session token validity |
| Get Token | Get session token details |

### 4. EmailAddresses

| Operation | Description |
|-----------|-------------|
| Create | Add email address to user |
| Get | Retrieve email address by ID |
| Update | Update email address |
| Delete | Remove email address |
| Attempt Verification | Send verification email |
| Verify | Verify email with code |

### 5. PhoneNumbers

| Operation | Description |
|-----------|-------------|
| Create | Add phone number to user |
| Get | Retrieve phone number by ID |
| Update | Update phone number |
| Delete | Remove phone number |
| Attempt Verification | Send verification SMS |
| Verify | Verify phone with code |

### 6. Invitations

| Operation | Description |
|-----------|-------------|
| Create | Send organization invitation |
| Get | Retrieve invitation by ID |
| List | List pending invitations |
| Revoke | Cancel/revoke invitation |
| Resend | Resend invitation email |

### 7. AllowlistIdentifiers

| Operation | Description |
|-----------|-------------|
| Create | Add domain/email to allowlist |
| Get | Retrieve allowlist identifier |
| List | List all allowlist entries |
| Delete | Remove from allowlist |

### 8. BlocklistIdentifiers

| Operation | Description |
|-----------|-------------|
| Create | Add domain/email to blocklist |
| Get | Retrieve blocklist identifier |
| List | List all blocklist entries |
| Delete | Remove from blocklist |

### 9. JwtTemplates

| Operation | Description |
|-----------|-------------|
| Create | Create JWT template |
| Get | Retrieve JWT template |
| List | List all JWT templates |
| Update | Update JWT template |
| Delete | Delete JWT template |

## Usage Examples

```javascript
// Create a new user
{
  "email_address": ["user@example.com"],
  "password": "securePassword123",
  "first_name": "John",
  "last_name": "Doe",
  "skip_password_requirement": false
}
```

```javascript
// Create organization and invite user
{
  "name": "Acme Corporation",
  "slug": "acme-corp",
  "created_by": "user_2Nq8VeIGKp8VeIGKp8VeIG",
  "private_metadata": {
    "plan": "enterprise",
    "billing_email": "billing@acme.com"
  }
}
```

```javascript
// Send organization invitation
{
  "email_address": "newuser@acme.com",
  "inviter_user_id": "user_2Nq8VeIGKp8VeIGKp8VeIG",
  "role": "org:member",
  "redirect_url": "https://myapp.com/accept-invitation"
}
```

```javascript
// Add email to allowlist
{
  "identifier": "@company.com",
  "notify": true
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid API key | Verify your Clerk secret key is correct and active |
| 404 Not Found | Resource doesn't exist | Check the ID/identifier exists in your Clerk instance |
| 422 Invalid Parameters | Validation failed | Review required fields and data formats |
| 429 Rate Limited | Too many requests | Implement request throttling and retry logic |
| 400 Bad Request | Malformed request data | Validate request payload against Clerk API schema |
| 403 Forbidden | Insufficient permissions | Ensure API key has required permissions for operation |

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
- **Clerk Documentation**: [clerk.com/docs](https://clerk.com/docs)
- **Clerk API Reference**: [clerk.com/docs/reference](https://clerk.com/docs/reference)