const changePasswordTemplate = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Verify Your Email Address</title>
  </head>
  <body>
    <h1>Verify Your Email Address</h1>
    <p>Hi {{username}},</p>
    <p>We just need to verify that {{email}} is your email address. Please click the button below to complete your registration:</p>
    <a href="{{verificationLink}}" style="display: inline-block; padding: 12px 24px; background-color: #428bca; color: #fff; text-decoration: none; border-radius: 4px;">Verify Email Address</a>
    <p>If you did not sign up for an account on our site, you can safely ignore this email.</p>
    <p>Thanks,</p>
    <p>The Team at Our Site</p>
  </body>
</html>`;

export { changePasswordTemplate };
