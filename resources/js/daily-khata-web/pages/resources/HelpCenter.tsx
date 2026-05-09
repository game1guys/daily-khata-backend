import React from 'react';
import InfoPageLayout from '../../components/InfoPageLayout';

const HelpCenter: React.FC = () => {
  return (
    <InfoPageLayout title="Help & Support Center" subtitle="Find exhaustive answers to all your Daily-KHATA architectural questions">
      <h2>1. Total Onboarding: Getting Started</h2>
      <p>Welcome to the central nervous system of your personal finances. Daily-KHATA is designed to be ridiculously fast. To begin, simply download the native iOS or Android application directly from the respective app stores, or click "App" in the navigational header of this site. Once authenticated via email or secure OAuth (Google/Apple), the underlying Supabase engine instantiates a dedicated remote ledger. From that moment on, every tiny transaction you input is locally cached on your device and asynchronously synchronized with our secure Cloud storage when network connectivity permits. This offline-first approach ensures you can track cash expenses even deep underground in a subway with zero cellular signal.</p>
      
      <h2>2. Customization: How do I create & alter a Category?</h2>
      <p>The core philosophy of Daily-KHATA revolves around modular flexibility. While we provide robust base categories (Food, Transport, Utilities, Housing, Entertainment, Healthcare, Bills), true precision requires custom segmentation.</p>
      <p>Inside your app or web dashboard, navigate to the dedicated "Categories" tab via the bottom navigation bar. Press the large floating "+" icon. This invokes a modal where you can configure a unique category name, select a specific icon from our vast Lucide icon library, and choose a vivid hex color that will represent this category in all pie-charts, bar graphs, and CSV exports. **Note: Custom category generation is entirely unlimited for Premium subscribers, whereas Free tier users are limited to 3 custom configurations.**</p>

      <h2>3. The Udhar Engine: Troubleshooting Multi-Party Credit/Debt</h2>
      <p>The "Udhar" (credit/loan tracking) feature is Daily-KHATA's most celebrated innovation. It tracks both money you have dynamically lent to external parties (friends, family, contractors) and money you technically owe.</p>
      <p>To register an Udhar interaction, navigate to the Udhar tab, input the party's name, their phone number, the precise monetary amount, and whether it was "Given" or "Taken". The system immediately logs this against your net worth metrics.</p>
      <p><strong>Troubleshooting WhatsApp Automation:</strong> If automated WhatsApp payment reminders are failing to trigger, ensure that you have typed the phone number correctly (including the +91 or respective country code). Secondly, ensure you have granted the Daily-KHATA mobile application background permission to invoke intense URL-schemes. We do not use a standard API for WhatsApp; instead, we format highly reliable deep-links `whatsapp://send?phone=NUMBER&text=MESSAGE` to safely push you into your own chat instances without compromising encryption.</p>

      <h2>4. Advanced: PDF & CSV Ledger Exporting</h2>
      <p>Data portability is critical for audits and advanced spreadsheet manipulation. Navigating to the "Dashboard/Analytics" tab and pressing the "Export" glyph will compile your entire raw PostgreSQL ledger database rows into either a highly formatted, color-coded, printable PDF document (perfect for handing to an accountant) or a raw, comma-separated values (CSV) file (perfect for importing into Microsoft Excel, Apple Numbers, or Google Sheets). This export handles date-range filtering, meaning you can export specifically "Q3 2026 Expenses" perfectly sorted chronologically.</p>

      <h2>5. Security: What if I lose my phone?</h2>
      <p>Do not panic. Because of our rigorous cloud-first sync engine, your mobile device simply mirrors the encrypted absolute truth stored simultaneously in our cloud databases. If your phone is lost, stolen, or destroyed, simply download the Daily-KHATA application on any replacement device, authenticate using the exact same credential suite, and the engine will automatically pull down your entire ledger history, restoring everything down to the penny within seconds.</p>
    </InfoPageLayout>
  );
};

export default HelpCenter;
