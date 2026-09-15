import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ContactEmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export function ContactEmailTemplate({
  name,
  email,
  message,
}: ContactEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>New message from {name} on your portfolio</Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* Header Area */}
          <Section style={headerSection}>
            <Heading style={h1}>New Message</Heading>
            <Text style={subtitle}>
              Someone reached out via your portfolio contact form.
            </Text>
          </Section>

          {/* Details Area */}
          <Section style={detailsSection}>
            <Text style={label}>From</Text>
            <Text style={value}>{name}</Text>

            <Text style={label}>Email Address</Text>
            <Text style={value}>
              <a href={`mailto:${email}`} style={link}>
                {email}
              </a>
            </Text>
          </Section>

          {/* Message Area */}
          <Section style={messageSection}>
            <Text style={label}>Message</Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />
          
          <Text style={footer}>
            Sent securely from your interactive portfolio
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#0B0F19",
  backgroundImage: "linear-gradient(135deg, #0B0F19 0%, #1A1025 100%)",
  fontFamily:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  padding: "40px 0",
};

const container = {
  backgroundColor: "#161B26",
  backgroundImage: "linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.0) 100%)",
  margin: "0 auto",
  padding: "32px",
  borderRadius: "16px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 24px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
  maxWidth: "560px",
};

const headerSection = {
  paddingBottom: "24px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  marginBottom: "24px",
};

const h1 = {
  color: "#F8FAFC",
  fontSize: "28px",
  fontWeight: "600",
  margin: "0 0 8px",
  padding: "0",
  letterSpacing: "-0.5px",
};

const subtitle = {
  color: "#94A3B8",
  fontSize: "15px",
  lineHeight: "22px",
  margin: "0",
};

const detailsSection = {
  backgroundColor: "rgba(0, 0, 0, 0.2)",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.03)",
  marginBottom: "24px",
};

const messageSection = {
  padding: "0 4px",
};

const label = {
  color: "#64748B",
  fontSize: "12px",
  fontWeight: "600",
  margin: "0 0 6px",
  textTransform: "uppercase" as const,
  letterSpacing: "1.2px",
};

const value = {
  color: "#F1F5F9",
  fontSize: "16px",
  fontWeight: "500",
  margin: "0 0 16px",
};

const link = {
  color: "#38BDF8",
  textDecoration: "none",
  borderBottom: "1px solid rgba(56, 189, 248, 0.3)",
};

const messageText = {
  color: "#E2E8F0",
  fontSize: "16px",
  lineHeight: "28px",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const hr = {
  borderColor: "rgba(255, 255, 255, 0.05)",
  margin: "32px 0 24px",
};

const footer = {
  color: "#475569",
  fontSize: "13px",
  lineHeight: "16px",
  margin: "0",
  textAlign: "center" as const,
  fontWeight: "500",
};
