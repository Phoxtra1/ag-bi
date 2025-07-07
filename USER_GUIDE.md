
# Amniva Platform User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [User Account Management](#user-account-management)
3. [API Access for Organizations](#api-access-for-organizations)
4. [Platform Features](#platform-features)
5. [Security & Access Control](#security--access-control)
6. [Troubleshooting](#troubleshooting)

## Getting Started

### Account Registration
1. Visit the Amniva platform homepage
2. Click "Get Started" to create a free account
3. Verify your email address
4. Complete your profile setup

### Free vs. Paid Plans
- **Free Plan**: Access to basic features, trending news previews, and limited verification
- **Elite Plan**: Enhanced prediction tools, advanced analytics, and priority support
- **Institutional Plan**: Full API access, custom integrations, and enterprise features

## User Account Management

### Dashboard Overview
The user dashboard provides access to:
- **Overview**: Real-time insights and weather widget
- **Predictions**: AI-powered forecasting tools
- **Reports**: Content submission and analysis
- **API Access**: For institutional users only
- **Account**: Profile and subscription management
- **Support**: Help center and contact options

### Profile Settings
- Update personal information
- Change password and security settings
- Manage notification preferences
- View subscription details and billing

## API Access for Organizations

### Eligibility Requirements
API access is restricted to verified organizations with institutional subscriptions:
- Academic institutions
- Media organizations
- Government agencies
- Research institutions
- Civil society organizations
- Other approved entities

### Registration Process
1. **Subscribe to Institutional Plan**
   - Visit `/pricing` page
   - Select Institutional Plan
   - Complete payment process

2. **Submit Organization Verification**
   - Go to `/api-organizations` page
   - Fill out the detailed application form:
     - Full name and contact information
     - Organization name and official website
     - Sector classification
     - Detailed intended use description
     - Upload verification documents (business license, academic credentials, etc.)

3. **Admin Review Process**
   - Applications are reviewed within 5-7 business days
   - Additional information may be requested
   - Approval notification sent via email

4. **API Key Generation**
   - Access the API Management section in your dashboard
   - Generate and manage API keys
   - Configure security settings

### API Usage Guidelines
- **Rate Limits**: Institutional plans include generous rate limits
- **Authentication**: All requests must include valid API key
- **Data Usage**: Comply with terms of service for data usage
- **Security**: Implement proper key management and IP restrictions

### Sample API Usage
```javascript
// Example API request
const response = await fetch('https://api.amniva.com/v1/predictions', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer sk-amniva-your-api-key',
    'Content-Type': 'application/json'
  }
});
```

## Platform Features

### Verification Tools
- Real-time fact-checking
- Source verification
- Credibility scoring
- Cross-reference validation

### Prediction Engine
- Political trend analysis
- Weather forecasting
- Social behavior patterns
- Economic indicators

### Reporting System
- Submit content for analysis
- Community feedback integration
- Expert review process
- Public verification status

### Real-time Updates
- Live news feeds
- Trending topics
- Alert notifications
- Community discussions

## Security & Access Control

### Individual User Restrictions
Individual users (non-institutional) are restricted from:
- API access and management
- Bulk data exports
- Advanced analytics tools
- Custom integrations
- Admin functionality

### API Access Controls
- **IP Whitelisting**: Restrict access to specific IP addresses
- **Rate Limiting**: Prevent abuse with usage quotas
- **Key Rotation**: Regular API key updates
- **Usage Monitoring**: Track and audit API usage
- **Immediate Revocation**: Suspend access for policy violations

### Data Protection
- End-to-end encryption for sensitive data
- Regular security audits
- GDPR compliance
- Secure data storage with Appwrite Cloud
- Access logging and monitoring

### Account Security
- Two-factor authentication (2FA)
- Strong password requirements
- Session management
- Login activity monitoring
- Automatic lockout for suspicious activity

## Admin Controls for API Management

### Application Review
Administrators can:
- Review organization verification documents
- Approve or reject API access requests
- Request additional information
- Add internal notes and comments
- Track application status

### API Key Management
- Generate new API keys for approved organizations
- Revoke access immediately if needed
- Monitor usage patterns and compliance
- Set custom rate limits per organization
- Export usage reports

### Security Monitoring
- Real-time usage monitoring
- Anomaly detection
- IP address tracking
- Failed request monitoring
- Automated alerts for suspicious activity

## Troubleshooting

### Common Issues
1. **API Key Not Working**
   - Verify key format and spelling
   - Check if key has been revoked
   - Ensure proper authentication headers

2. **Rate Limit Exceeded**
   - Review your usage patterns
   - Contact support for limit increases
   - Implement proper request throttling

3. **Access Denied**
   - Verify your subscription status
   - Check if organization approval is pending
   - Ensure IP address is whitelisted

### Support Channels
- **Help Center**: Comprehensive documentation and FAQs
- **Email Support**: Direct technical assistance
- **Developer Community**: Community forums and discussions
- **Priority Support**: Available for institutional subscribers

### Contact Information
- Support Email: support@amniva.com
- Technical Issues: tech@amniva.com
- API Questions: api@amniva.com
- Emergency Contact: Available 24/7 for institutional subscribers

## Deployment Readiness

### Pre-deployment Checklist
- [ ] Appwrite Cloud fully configured
- [ ] All environment variables set
- [ ] Database collections created
- [ ] Storage buckets configured
- [ ] Functions deployed and tested
- [ ] User authentication working
- [ ] API endpoints tested
- [ ] Security policies implemented
- [ ] Monitoring and logging active
- [ ] Backup systems in place

### Post-deployment Monitoring
- Monitor application performance
- Track user registration and engagement
- Review API usage patterns
- Monitor error rates and response times
- Regular security audits
- User feedback collection and analysis

---

**Note**: This platform is designed for civic engagement and truth verification. All users must comply with our terms of service and community guidelines. Misuse of API access or platform features may result in immediate account suspension.
