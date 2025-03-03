# EmailJS Setup Guide for Contact Form

This guide will help you understand the EmailJS configuration for your contact form.

## EmailJS Configuration

Your contact form is configured to use EmailJS, which is a service that allows you to send emails directly from client-side JavaScript without needing a server. The configuration is already set up with the following credentials:

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=[YOUR_SERVICE_ID]
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=[YOUR_TEMPLATE_ID]
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=[YOUR_PUBLIC_KEY]
```

These credentials are already in your `.env` file and the contact form is configured to use them.

## How EmailJS Works

1. **Service ID**: Identifies the email service you're using (like Gmail, Outlook, etc.)
2. **Template ID**: Refers to an email template you've created in the EmailJS dashboard
3. **Public Key**: Authenticates your application with EmailJS

## Customizing Your Email Template

If you want to customize the email template:

1. Log in to your EmailJS account: https://dashboard.emailjs.com/
2. Navigate to "Email Templates"
3. Find the template with ID `template_l99usbj`
4. Modify the template as needed

## Testing

The contact form is configured to send emails to `[YOUR_EMAIL_ADDRESS]`. When a user submits the form, they will fill in:
- Name
- Email
- Subject
- Message

This information will be sent to your email using the EmailJS service.

## Troubleshooting

If you encounter issues with the contact form:

1. Check the browser console for any JavaScript errors
2. Verify that your EmailJS account is active
3. Ensure your service, template, and public key are correct
4. Check your EmailJS dashboard for any sending limits or restrictions

## Security Notes

- The EmailJS public key is exposed in the client-side code, but this is normal and part of EmailJS's design
- EmailJS has built-in protection against spam and abuse
- For additional security, you can set up domain restrictions in your EmailJS dashboard
