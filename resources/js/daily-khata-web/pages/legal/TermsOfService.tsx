import React from 'react';
import InfoPageLayout from '../../components/InfoPageLayout';

const TermsOfService: React.FC = () => {
  return (
    <InfoPageLayout title="Terms of Service" subtitle="Effective Date: October 2026" accentColor="blue">
      <h2>1. Introduction and Absolute Scope</h2>
      <p>By downloading, browsing, accessing or using Daily-KHATA or using any of its web platforms, native iOS/Android applications, and core APIs, you agree to be bound by these comprehensive Terms of Service. These terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and the Daily-KHATA Organization ("we," "us" or "our"), concerning your access to and use of our financial tracking and analytical platform.</p>
      <p>If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the application and you must discontinue use immediately. Supplemental terms and conditions or documents that may be posted on the Site from time to time are hereby expressly incorporated herein by reference.</p>
      
      <h2>2. Platform Core Functionality & Permitted Use Cases</h2>
      <p>Our platform empowers you to generate profound insights from your personal or small-business financial data. Daily-KHATA provides tools for recording incomes, tracking micro-expenses via intelligent UI workflows, generating visual chart analytics, and managing multi-party 'Udhar' (credit/debt) ledgers with WhatsApp reminder capabilities.</p>
      <p>You may use the Daily-KHATA services strictly for legitimate financial tracking. However, the following is strictly prohibited under penalty of immediate account termination:</p>
      <ul>
        <li>Reverse engineering, decompiling, or attempting to extract the source code of our analytics algorithms or machine learning expense classification systems.</li>
        <li>Bypassing structural row-level security (RLS) parameters within our Supabase database or attempting brute-force network attacks against our API gateways.</li>
        <li>Spamming standard free-tier infrastructure excessively to drain backend compute resources (e.g., setting up bots to log 10,000 blank expenses per second).</li>
        <li>Utilizing the 'Udhar' reminder system to engage in predatory debt collection harassment, abusive messaging, or illegal financial extortion.</li>
      </ul>

      <h2>3. Intellectual Property Rights & Licensing</h2>
      <p>Unless otherwise explicitly stated, Daily-KHATA software is our exclusive proprietary property. All source code, distributed databases, complex backend functionality, specialized UI designs, audio elements, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by massive international copyright and trademark laws.</p>
      <p>Provided that you are eligible to use the application, you are granted a limited, revocable, non-exclusive license to access the Platform and to download a copy of the Mobile Application strictly for your personal, non-commercial use. Any unauthorized exploitation of the platform's intellectual property will result in immediate legal prosecution to the fullest extent of the law.</p>

      <h2>4. User Registration, Authentication & Liability</h2>
      <p>You may be required to register with the Site to access our core tracking features. You agree to keep your password strictly confidential and will be completely responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or legally precarious.</p>
      <p>Because Daily-KHATA acts as an informational ledger, **we are not legally liable for any financial losses, audit discrepancies, tax penalties, or business failures you may experience**. The analytics provided are for informational and behavioral guidance only. We do not act as certified public accountants (CPAs) or fiduciary advisors. The absolute responsibility of ensuring financial accuracy remains strictly with the user.</p>

      <h2>5. Subscription Tiers, Billing, and Renewals</h2>
      <p>Daily-KHATA operates on a freemium model. Core functionality is provided indefinitely at zero cost. For our Premium Monthly, Premium Yearly, and Premium Lifetime tiers, we utilize secure, third-party PCI-DSS compliant payment gateways like Stripe or Razorpay.</p>
      <p>If you purchase a recurring subscription, you explicitly authorize us to charge your payment method on file on a rolling basis. You may cancel your subscription at any time via the billing portal within the application settings. Cancellation will take effect at the end of the current paid term. Your account will automatically downgrade to the Free tier, resulting in the truncation of access to advanced features (e.g., unlimited Udhar parties, Cloud Backup restoration beyond 30 days, Photo Attachments).</p>

      <h2>6. Modifications and Interruptions to Service</h2>
      <p>We reserve the right to change, modify, or remove the contents of the application at any time or for any reason at our sole discretion without notice. However, we have absolutely no obligation to update any information on our Site. We also reserve the right to modify or discontinue all or part of the Premium services with adequate prior notice.</p>
      <p>We cannot guarantee the application will be available 100% of the time. We may experience hardware, software, CDN, or database load issues resulting in interruptions, delays, or minor errors. You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the application during any downtime or discontinuance of the Site.</p>
      
      <h2>7. Dispute Resolution and Governing Law</h2>
      <p>To expedite resolution and control the cost of any dispute, controversy, or claim related to these Terms of Service (each a "Dispute"), you agree to first attempt to negotiate any Dispute informally for at least thirty (30) days before initiating binding arbitration or court proceedings. These Terms shall be governed by and defined following international business law standards. Daily-KHATA Organization firmly binds itself to resolving structural disputes transparently.</p>
    </InfoPageLayout>
  );
};

export default TermsOfService;
