import React from 'react';
import InfoPageLayout from '../../components/InfoPageLayout';

const RefundAgreement: React.FC = () => {
  return (
    <InfoPageLayout title="Refunds & Cancellations" subtitle="Effective Date: October 2026" accentColor="amber">
      <h2>1. The 14-Day Free Premium Trial Guarantee</h2>
      <p>Daily-KHATA operates on a freemium architecture, but we believe you should experience the absolute pinnacle of our advanced analytical tracking before making a financial commitment. Therefore, Daily-KHATA automatically offers all new user accounts a 14-Day Free Premium Trial period. This means you gain unfettered access to our highest-tier analytics, unlimited Udhar party tracking, PDF/CSV export modules, secure custom category generation, and deep AI-driven predictive insights with absolutely zero financial risk.</p>
      <p>During this trial, you may cancel at any moment through your dashboard settings. If you do not explicitly cancel the trial before the 14-day clock expires, your payment method on file will automatically transition to the billing cycle you originally authorized (Monthly or Annually).</p>
      
      <h2>2. General Refund Guidelines & The 7-Day Window</h2>
      <p>Because Daily-KHATA is instantaneous, cloud-based software, activating a Premium tier grants you immediate utility and infrastructural access. Because of this, software subscriptions (unlike physical goods) are generally non-refundable once the billing transaction is successfully captured and processed.</p>
      <p>However, we are not unreasonable. A discretionary 7-Day "Buyer's Remorse" refund window exists strictly for Annual and Lifetime subscriptions. If you purchase a 1-year or a lifetime license and immediately determine within 168 hours that the interface does not suit your workflow, you may contact billing support to request a full reversal. Monthly subscriptions DO NOT qualify for this 7-day buyer's remorse window.</p>

      <h2>3. Exceptions for Technical Failure</h2>
      <p>We take our backend stability incredibly seriously. We utilize highly redundant databases and edge CDNs to ensure 99.9% uptime. Nevertheless, there are rare exceptions where we will issue an absolute, unconditional prorated or full refund outside of the standard windows:</p>
      <ul>
        <li>If you have encountered a severe, documented technical fault (e.g., persistent database timeout, catastrophic sync failure between your iOS app and the main Supabase cluster) that prevents you from using the core Premium application features for a continuous span of over 48 hours.</li>
        <li>If an accidental double-billing issue has occurred due to Stripe communication errors or app-store payment gateway duplication (e.g., Apple Pay and a raw credit card were simultaneously charged due to a network glitch).</li>
        <li>If a massive data-loss event occurs squarely on our server-side parameters that prevents you from generating the financial reports you paid to access.</li>
      </ul>

      <h2>4. Lifetime Access Specifics</h2>
      <p>Daily-KHATA occasionally offers extreme value "Lifetime" access tiers. A lifetime license grants you Premium privileges permanently at a single upfront cost. This means you will never pay a monthly fee, and all future V2/V3 features are included. Because of this massive discount over time, Lifetime subscriptions are strictly non-refundable past the standard 7-day buyer's remorse period. If our company is acquired, the new entity will honor your lifetime ledger access.</p>

      <h2>5. How to Request a Refund</h2>
      <p>If you believe you meet the criteria outlined in Section 2 or Section 3, you must initiate a refund request by navigating to the "Billing Help" tab in your admin gateway or mobile application settings. You must provide the original transaction ID, the registered email address, and a brief explanation of the technical fault or reason for remorse. Our financial support team typically resolves these requests within 3 to 5 business days.</p>
    </InfoPageLayout>
  );
};

export default RefundAgreement;
