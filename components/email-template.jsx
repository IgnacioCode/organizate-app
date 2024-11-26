import * as React from 'react';

export const EmailTemplate = ({ firstName, recoveryLink }) => (
    <div>
        <h1>Organizate Password Recovery</h1>
        <p>Hi,</p>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <a href={recoveryLink}>Reset Password</a>
        <p>If you did not request a password reset, please ignore this email.</p>
    </div>
);