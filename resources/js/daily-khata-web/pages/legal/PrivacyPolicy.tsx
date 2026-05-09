import React from 'react';
import InfoPageLayout from '../../components/InfoPageLayout';

const PrivacyPolicy: React.FC = () => {
  return (
    <InfoPageLayout title="Privacy Policy" subtitle="Effective Date: October 2026" accentColor="emerald">
      <h2>1. Introduction</h2>
      <p>Welcome to Daily-KHATA. We respect your privacy and are deeply committed to protecting your personal data in the digital age. This comprehensive privacy policy will inform you as to how we look after your personal data when you visit our website, use our native iOS and Android applications, or interact with our core APIs. It also outlines your privacy rights and how current financial cryptography laws protect you at a global scale.</p>
      <p>Daily-KHATA operates as the ultimate unified ledger system, meaning we interact with highly sensitive micro-transactional data. Trust is our foundational currency. We have engineered our data infrastructure to adhere strictly to the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and global financial data residency laws (including India's Digital Personal Data Protection Act).</p>
      
      <h2>2. The Data We Collect & Process</h2>
      <p>Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been irreversibly removed (anonymous data). We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
      <ul>
        <li><strong>Identity & Profile Data:</strong> includes first name, last name, username, unique biometric hashes (if FaceID/TouchID is enabled on-device), and profile photographs.</li>
        <li><strong>Financial & Ledger Data:</strong> includes custom category structures, parsed bank transaction histories, raw cash-flow ledgers, receipt images (optical character recognition payloads), and multi-party Udhar analytics. All of this data is strictly encrypted using AES-256 protocols at rest.</li>
        <li><strong>Contact Data:</strong> includes billing address, email address, and telephone numbers (specifically utilized for our automated WhatsApp reminder integrations).</li>
        <li><strong>Technical & Telemetry Data:</strong> includes internet protocol (IP) address, your authenticated login tokens, browser type and version, geographic telemetry, operating system, and hardware identifiers for fraud prevention.</li>
        <li><strong>Marketing & Communications Data:</strong> includes your preferences in receiving marketing/analytics reports from us and our third parties.</li>
      </ul>

      <h2>3. How Is Your Personal Data Collected?</h2>
      <p>We use different methods to collect data from and about you including through:</p>
      <p><strong>Direct Automated Interactions:</strong> You may give us your Identity, Contact and Financial Data by filling in forms or by corresponding with us by post, phone, email or otherwise. This includes personal data you provide when you:</p>
      <ul>
        <li>Create an account embedded within the Daily-KHATA ecosystem;</li>
        <li>Subscribe to our Premium or Lifetime service tiers;</li>
        <li>Upload physical receipts for AI classification;</li>
        <li>Request marketing to be sent to you;</li>
        <li>Engage with our customer support teams regarding a dispute.</li>
      </ul>
      <p><strong>Automated Technologies:</strong> As you interact with our native mobile apps and web dashboard, we will automatically collect Technical Data about your equipment, browsing actions and patterns. We collect this personal data by using secure cookies, edge-network logs and similar technologies. We heavily utilize zero-knowledge analytics to ensure that while we track app crashes and feature engagement, we cannot trace those actions backward to your unencrypted financial data.</p>

      <h2>4. How We Use Your Data</h2>
      <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances to provide you with the Daily-KHATA tracking service, manage your account, and deliver high-end analytical insights regarding your spending behavior.</p>
      <p>Specifically, we process your Ledger Data to run complex machine learning algorithms that categorize your expenses and predict future cash-flow shortages. <strong>We strictly do NOT sell your financial data to external data brokers or advertising agencies.</strong> Our business model relies entirely on providing you with incredible subscription-based value, not on selling your digital footprint.</p>

      <h2>5. Advanced Data Security</h2>
      <p>We have instituted military-grade security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. Your data resides in highly redundant AWS and Supabase clusters protected by perimeter firewalls and strict Row Level Security (RLS) policies within PostgreSQL.</p>
      <p>In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a strict, audited business need to know. They will only process your personal data on our direct instructions and they are subject to a legally binding duty of confidentiality.</p>
      <p>We have put in place procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so within 72 hours of discovery.</p>

      <h2>6. Data Retention Protocols</h2>
      <p>We will only retain your personal data for as long as reasonably necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements. We may retain your personal data for a longer period in the event of a complaint or if we reasonably believe there is a prospect of litigation in respect to our relationship with you.</p>
      <p>By default, if you explicitly delete your Daily-KHATA account, all associated encrypted Financial Data, Udhar records, and receipt images are instantly purged from our primary live databases, retaining only aggregated anonymized telemetry.</p>

      <h2>7. Your Strict Legal Rights</h2>
      <p>Under certain circumstances, you have powerful rights under global data protection laws in relation to your personal data, including the right to:</p>
      <ul>
        <li><strong>Request Access:</strong> Commonly known as a "data subject access request". This enables you to receive a raw JSON copy of the personal data we hold about you.</li>
        <li><strong>Request Correction:</strong> This enables you to have any incomplete or inaccurate data we hold about you corrected, though we may need to verify the accuracy of the new data you provide.</li>
        <li><strong>Request Erasure (Right to be Forgotten):</strong> This enables you to ask us to delete or remove personal data where there is no good reason for us continuing to process it.</li>
        <li><strong>Object to Processing:</strong> Where we are relying on a legitimate interest and there is something about your particular situation which makes you want to object to processing on this ground as you feel it impacts your fundamental rights and freedoms.</li>
        <li><strong>Request Transfer (Data Portability):</strong> We will provide to you, or a third party you have chosen, your personal data in a highly structured, commonly used, machine-readable format (e.g., CSV or JSON via our Export App feature).</li>
      </ul>
      <p>If you wish to exercise any of the rights set out above, please contact our Data Protection Officer immediately.</p>
    </InfoPageLayout>
  );
};

export default PrivacyPolicy;
