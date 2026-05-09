<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color: #FFD740;">Payment Reminder</h2>
    <p>Dear <strong>{{ $partyName }}</strong>,</p>
    <p>This is a friendly reminder from <strong>{{ $senderName }}</strong> regarding your outstanding balance.</p>
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FFD740;">
        <p style="margin: 0; font-size: 18px;">Total Outstanding Amount: <strong>₹{{ number_format($amount, 0) }}</strong></p>
    </div>
    <p>Please settle the payment at your earliest convenience.</p>
    <p>Thank you for using Daily-KHATA!</p>
</div>
