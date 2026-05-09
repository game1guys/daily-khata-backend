import React from 'react';
import InfoPageLayout from '../../components/InfoPageLayout';

const Glossary: React.FC = () => {
  return (
    <InfoPageLayout title="Financial Glossary" subtitle="Definitions for tracking, analytics, and accounting like a Wall-Street professional" accentColor="blue">
      <h2>1. Udhar (Credit/Debt Matrix)</h2>
      <p>A Hindi/Urdu term commonly used widely within the Indian Subcontinent representing informal "Credit", "Borrowing", or "Loan" relationships. Historically recorded in a physical ledger (Khata). In Daily-KHATA, the digital Udhar ecosystem is a hyper-advanced, isolated data layer that tracks both money you have fluidly lent to external entities (Given) and capital you have actively borrowed from others (Taken). The system allows you to define repayment dates, interest configurations (if applicable), and triggers background cron jobs to dispatch automated reminders over WhatsApp to settle the balances.</p>
      
      <h2>2. Ledger Reconciliation</h2>
      <p>The systematic process of verifying that your actual banking account balances (checking, savings, investment portfolios) perfectly match the manually recorded net-worth sum residing in your Daily-KHATA cloud database. Perfect reconciliation means you have successfully digitized 100% of your economic behavior. Discrepancies indicate missed untracked expenses or fraudulent bank activities.</p>

      <h2>3. Base Categories vs Dynamically Configured Categories</h2>
      <p>Base categories are universal vectors mapped identically to all users upon registration (e.g., Food, Transportation, Medical, Housing). They ensure baseline demographic analytics for the global population. However, Premium tier users possess the privilege of defining 'Dynamically Configured Categories' (Custom Categories). These allow hyper-specific segmentation (e.g., allocating an entire color-coded vector exclusively to "Friday Night Pizza" or "Server Hosting Fees") to generate extremely isolated pie-chart analytics.</p>

      <h2>4. Zero-Knowledge Proof Encryption</h2>
      <p>Zero-knowledge proof (ZKP) is an advanced cryptographic method by which one party (the prover) can prove to another party (the verifier) that a given statement is true while circumventing the need to convey any additional information. While we process your rows for analytics, our administrative engineering portals strictly cannot read your raw dollar amounts or your specific category naming conventions. You hold the unique decryption keys via your authenticated device.</p>

      <h2>5. The 50/30/20 Cash Allocation Rule</h2>
      <p>A financial rule of thumb extensively programmed into Daily-KHATA's insight generation. It suggests partitioning your net after-tax income into three distinct silos: 50% allocated rigidly towards absolute absolute 'Needs' (Housing, Groceries, Utility invoices), 30% towards fluid 'Wants' (Streaming, Dining out, Subscriptions), and exactly 20% strictly dedicated towards 'Savings/Investments/Debt Clearance'. Daily-KHATA will highlight your interface in crimson red if your 'Wants' category exceeds the 30% mathematical threshold over a 30-day moving average.</p>
    </InfoPageLayout>
  );
};

export default Glossary;
