import React from 'react';
import InfoPageLayout from '../../components/InfoPageLayout';

const Community: React.FC = () => {
  return (
    <InfoPageLayout title="Community Forums" subtitle="Connect organically with millions of power users" accentColor="purple">
      <h2>1. Welcome to the Global Financial Forums</h2>
      <p>A digital haven for highly advanced personal accounting strategies. Join thousands of users figuring out maximum tax efficiencies, tracking optimizations, and discussing the nuances of global inflation. The Daily-KHATA forums are segmented into strictly moderated, high-signal topic boards. We enforce a zero-tolerance policy against financial scams, cryptocurrency shilling, or predatory investment advice.</p>
      
      <h2>2. Feature Proposing & Voting (The Roadmap)</h2>
      <p>Got a revolutionary idea for the future of Daily-KHATA? Post it directly in the 'Core Features & Proposals' board. Our entire React, Node, and Mobile engineering divisions actively monitor this board. We review top-voted features at the beginning of every month. In fact, recent massive additions like our Optical Optical Character Recognition (OCR) for physical receipt scanning were built entirely based on overwhelming community demand and Kickstarter funding initiatives sourced straight from these forums.</p>

      <h2>3. Code & Open Source Discussions</h2>
      <p>While the monolithic Daily-KHATA backend remains entirely closed-source and strictly proprietary to guarantee absolute data security against threat actors, we strongly encourage the developer community to interact with our public APIs. The 'Developer Gateway' forum focuses exclusively on discussions surrounding proper REST fetching, GraphQL endpoints for custom dashboard generation, webhooks for massive e-commerce automation scripts, and custom Discord/Slack analytic integrations built by the community around our platform.</p>

      <h2>4. Community Etiquette & Moderation Enforcement</h2>
      <p>All interactions must remain civil, structural, and helpful. Do not post screenshots of your raw Daily-KHATA ledger unless you have utilized our 'Privacy Blur' mode located in the app settings, which securely obfuscates dollar amounts to preserve your anonymity while asking UI/UX questions.</p>
    </InfoPageLayout>
  );
};

export default Community;
