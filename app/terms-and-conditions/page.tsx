import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms And Conditions | Whatsy",
  description:
    "Terms and Conditions for Whatsy, including acceptable use, local model responsibilities, and limitations of liability.",
};

const sections = [
  {
    title: "1. Acceptance Of These Terms",
    paragraphs: [
      "These Terms and Conditions govern your access to and use of the Whatsy website, waitlist, product, and related services. By accessing or using Whatsy, you agree to be bound by these terms.",
      "If you do not agree to these terms, do not use Whatsy.",
    ],
  },
  {
    title: "2. Nature Of The Product",
    paragraphs: [
      "Whatsy is intended to help users manage conversations and automate or assist messaging-related workflows. Based on the current product direction, Whatsy is built around local-first usage and may rely on user-selected local models, user-controlled devices, local storage, browser automation, and third-party services or integrations chosen by the user.",
      "Because of that architecture, the security, privacy, accuracy, availability, and legality of your use depend partly on your own setup, operating environment, and decisions.",
    ],
  },
  {
    title: "3. Eligibility And Account Responsibility",
    paragraphs: [
      "You may use Whatsy only if you are legally permitted to do so under applicable law and have authority to use any accounts, devices, platforms, or data you connect to the product.",
      "You are responsible for maintaining the confidentiality and security of any credentials, devices, local environments, browsers, model runtimes, integrations, and messaging accounts used with Whatsy.",
    ],
  },
  {
    title: "4. Acceptable Use",
    paragraphs: [
      "You may not use Whatsy in a way that violates law, infringes the rights of others, circumvents platform rules, or causes harm. You are solely responsible for the messages, prompts, automations, outputs, and decisions made through your use of Whatsy.",
    ],
    bullets: [
      "Do not use Whatsy for spam, fraud, harassment, stalking, abuse, or deception",
      "Do not use Whatsy to generate or send unlawful, infringing, defamatory, or harmful content",
      "Do not use Whatsy in violation of the rules of messaging platforms, devices, or third-party tools you connect",
      "Do not use Whatsy in safety-critical, medical, legal, or other high-risk situations without appropriate human review and oversight",
    ],
  },
  {
    title: "5. Local Models, Outputs, And Human Review",
    paragraphs: [
      "If you use local LLMs, locally hosted services, or user-selected models with Whatsy, you are solely responsible for selecting, configuring, securing, and evaluating those tools.",
      "Model outputs may be inaccurate, incomplete, biased, offensive, or otherwise unsuitable. You must review outputs before sending, publishing, relying on, or acting on them. We are not responsible for any consequences resulting from the output of a local model or a user-managed workflow.",
    ],
  },
  {
    title: "6. Privacy And Security Allocation Of Responsibility",
    paragraphs: [
      "We aim to build Whatsy with a privacy-forward, local-first design. However, where the product stores or processes data on your own device or through tools you choose to operate, the privacy and security of that environment are your responsibility.",
      "This includes responsibility for securing your hardware, operating system, browser profile, local databases, local model runtimes, integrations, exported files, API keys, and any backups or logs created in your environment.",
    ],
  },
  {
    title: "7. Third-Party Services",
    paragraphs: [
      "Whatsy may interact with or depend on third-party platforms, software, or services chosen or enabled by you. We do not control those third parties and are not responsible for their availability, security, privacy practices, or compliance requirements.",
      "Your use of third-party services is governed by the terms and policies of those third parties, and you are responsible for complying with them.",
    ],
  },
  {
    title: "8. Intellectual Property And Feedback",
    paragraphs: [
      "The Whatsy website, branding, interface design, and related materials are owned by Whatsy or its licensors and are protected by applicable intellectual property laws.",
      "If you provide feedback, suggestions, or ideas about Whatsy, you grant us a non-exclusive, worldwide, royalty-free right to use that feedback to improve the product without restriction or compensation to you.",
    ],
  },
  {
    title: "9. Disclaimers",
    paragraphs: [
      "Whatsy is provided on an \"as is\" and \"as available\" basis to the fullest extent permitted by law. We do not guarantee uninterrupted availability, compatibility with any device or platform, or that the product will be error-free, secure, or suitable for your specific needs.",
      "We specifically disclaim warranties related to the accuracy or reliability of generated outputs, the performance of local models, the behavior of third-party services, and the security of user-managed environments.",
    ],
  },
  {
    title: "10. Limitation Of Liability",
    paragraphs: [
      "To the fullest extent permitted by law, Whatsy and its affiliates, founders, contractors, and licensors will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for any loss of profits, revenues, goodwill, data, messages, business opportunities, devices, or accounts arising out of or related to your use of Whatsy.",
      "This limitation includes losses arising from user error, local model behavior, third-party integrations, automation mistakes, unauthorized access to your local environment, platform enforcement actions, data loss, or the transmission of content you approved or failed to review.",
    ],
  },
  {
    title: "11. Indemnity",
    paragraphs: [
      "You agree to defend, indemnify, and hold harmless Whatsy and its affiliates, founders, contractors, and licensors from and against claims, liabilities, damages, losses, and expenses arising out of or related to your use of the product, your content, your integrations, your local environment, or your violation of these terms or applicable law.",
    ],
  },
  {
    title: "12. Suspension Or Termination",
    paragraphs: [
      "We may suspend or terminate access to the website, waitlist, or product at any time, with or without notice, if we believe you have violated these terms, created risk for us or others, or if we discontinue part or all of the service.",
      "You may stop using Whatsy at any time. Sections that by their nature should survive termination will survive, including sections relating to ownership, disclaimers, limitations of liability, indemnity, and dispute-related provisions.",
    ],
  },
  {
    title: "13. Changes To These Terms",
    paragraphs: [
      "We may update these Terms and Conditions from time to time. When we do, we will update the effective date on this page and may provide additional notice where appropriate.",
      "By continuing to use Whatsy after updated terms become effective, you agree to the revised terms.",
    ],
  },
  {
    title: "14. Contact",
    paragraphs: [
      "If you have questions about these Terms and Conditions, please use the official contact channel or support details made available through the Whatsy website at the time of your request.",
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      title="Terms And Conditions"
      description="The rules for using Whatsy, including acceptable use, local model responsibilities, user-managed security obligations, and our limits of liability."
      effectiveDate="March 14, 2026"
      sections={sections}
    />
  );
}
