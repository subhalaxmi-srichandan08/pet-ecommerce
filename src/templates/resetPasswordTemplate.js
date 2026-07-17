function resetPasswordTemplate(firstName, resetLink) {
    return `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
            <h2>Hello ${firstName},</h2>

            <p>
                We received a request to reset your PawPoint account password.
            </p>

            <p>
                Click the button below to reset your password.
            </p>

            <p style="text-align:center;">
                <a
                    href="${resetLink}"
                    style="
                        background:#ff6b35;
                        color:white;
                        padding:12px 24px;
                        text-decoration:none;
                        border-radius:6px;
                        display:inline-block;
                    "
                >
                    Reset Password
                </a>
            </p>

            <p>
                This link will expire in <b>15 minutes</b>.
            </p>

            <p>
                If you didn't request this, you can safely ignore this email.
            </p>

            <hr>

            <small>
                PawPoint Team
            </small>
        </div>
    `;
}

module.exports = resetPasswordTemplate;