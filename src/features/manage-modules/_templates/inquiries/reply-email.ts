interface ReplyEmailParams {
  name: string;
  inquiryContent: string;
  replyContent: string;
}

export function getReplyEmailSubject() {
  return '[ADMIN] Your Inquiry Has Been Answered';
}

export function getReplyEmailHtml({
  name,
  inquiryContent,
  replyContent,
}: ReplyEmailParams) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Response</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">

          <!-- Header -->
          <tr>
            <td style="padding: 48px 40px; background: linear-gradient(135deg, #18181b 0%, #27272a 100%); text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">ADMIN</h1>
              <p style="color: #a1a1aa; margin: 12px 0 0; font-size: 14px; font-weight: 400;">Thank you for contacting us</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 48px 40px;">
              <!-- Greeting -->
              <h2 style="margin: 0 0 8px; font-size: 22px; color: #18181b; font-weight: 600;">
                Hello, ${name}
              </h2>
              <p style="margin: 0 0 32px; font-size: 15px; color: #71717a;">
                Thank you for reaching out. Please find our response below.
              </p>

              <!-- Original Inquiry -->
              <div style="margin-bottom: 28px;">
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                  <span style="display: inline-block; width: 8px; height: 8px; background-color: #d4d4d8; border-radius: 50%; margin-right: 8px;"></span>
                  <span style="font-size: 12px; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.5px;">Your Inquiry</span>
                </div>
                <div style="padding: 20px 24px; background-color: #fafafa; border-radius: 12px; border: 1px solid #e4e4e7;">
                  <p style="margin: 0; font-size: 14px; color: #52525b; line-height: 1.7; white-space: pre-wrap;">${inquiryContent}</p>
                </div>
              </div>

              <!-- Response -->
              <div style="margin-bottom: 32px;">
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                  <span style="display: inline-block; width: 8px; height: 8px; background-color: #22c55e; border-radius: 50%; margin-right: 8px;"></span>
                  <span style="font-size: 12px; font-weight: 600; color: #22c55e; text-transform: uppercase; letter-spacing: 0.5px;">Our Response</span>
                </div>
                <div style="padding: 20px 24px; background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-radius: 12px; border: 1px solid #bbf7d0;">
                  <p style="margin: 0; font-size: 14px; color: #166534; line-height: 1.7; white-space: pre-wrap;">${replyContent}</p>
                </div>
              </div>

              <!-- Divider -->
              <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;">

              <!-- Closing -->
              <p style="margin: 0; font-size: 14px; color: #71717a; line-height: 1.7;">
                If you have any further questions, please don't hesitate to reach out.<br>
                We're here to help.
              </p>

              <p style="margin: 24px 0 0; font-size: 14px; color: #18181b; font-weight: 500;">
                Best regards,<br>
                <span style="color: #71717a; font-weight: 400;">The ADMIN Team</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; background-color: #fafafa; border-top: 1px solid #e4e4e7;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 8px; font-size: 13px; color: #a1a1aa;">
                      This is an automated message. Please do not reply directly to this email.
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #d4d4d8;">
                      &copy; ${new Date().getFullYear()} ADMIN. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
