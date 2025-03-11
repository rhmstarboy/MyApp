import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen w-full py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Privacy Policy for AirDropor</CardTitle>
          <p className="text-sm text-muted-foreground">Last Updated: Feb, 2025</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>Thank you for using AirDropor. Your privacy is important to us. This Privacy Policy explains how we handle your information when you use our app.</p>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">1. Information We Do Not Collect</h3>
            <p>AirDropor does not collect, store, or process any personal information from its users. We do not require registration, and no personal data (such as name, email, phone number, or wallet address) is requested or accessed.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">2. How We Operate</h3>
            <p>AirDropor is designed to provide updates on crypto airdrops without requiring any user information. The app functions as a notification service for upcoming and new coin airdrops.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">3. Third-Party Links</h3>
            <p>The app may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these external sites. Please review their privacy policies before providing any personal information.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">4. Changes to This Policy</h3>
            <p>We may update this Privacy Policy from time to time. Any changes will be posted here, and we encourage you to review this policy periodically.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">5. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please contact us at info@airdropor.icu</p>
          </div>

          <p>By using AirDropor, you agree to the terms outlined in this Privacy Policy.</p>

          <p className="text-center text-primary font-semibold">Thank you for trusting AirDropor! 🚀</p>
        </CardContent>
      </Card>
    </div>
  );
}