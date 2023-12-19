module.exports = ({ env }) => ({
    // ... other plugin configurations
    email: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'sandbox.smtp.mailtrap.io'),
        port: env('SMTP_PORT', 2525),
        auth: {
          user: env('SMTP_USERNAME', 'ec3ce586efb036'),
          pass: env('SMTP_PASSWORD', '58294564b71349')
        },
        // ... any custom nodemailer options
      },
      settings: {
        defaultFrom: 'ec3ce586efb036@inbox.mailtrap.io ',
        defaultReplyTo: 'to@inbox.mailtrap.io ',
      },
    },
    // ...
  });