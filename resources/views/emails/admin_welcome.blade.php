<div style="font-family: Helvetica, Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 40px; background-color: #f8fafc; color: #0f172a;">
    <h1 style="font-size: 22px;">Welcome to Daily-KHATA</h1>
    <p>Hello <strong>{{ $full_name }}</strong>,</p>
    <p>Your account has been created by an administrator.</p>
    <div style="margin: 24px 0; padding: 20px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;">
        <p><strong>Email:</strong> {{ $email }}</p>
        <p><strong>Temporary password:</strong> <code style="font-size: 16px;">{{ $finalPassword }}</code></p>
    </div>
    <p>Please sign in and change your password from the app.</p>
</div>
