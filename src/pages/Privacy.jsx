import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="font-semibold text-gray-800">Content Curator</Link>
          <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">Back to App</Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Privacy Policy</h1>

        <div className="bg-white rounded-lg shadow p-8 space-y-6 text-gray-600">
          <p className="text-sm text-gray-500">Last updated: January 2025</p>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Account information (email, password)</li>
              <li>Client business information you enter for content generation</li>
              <li>Payment information (processed securely by Stripe)</li>
              <li>Usage data and generated content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Provide and improve our services</li>
              <li>Generate personalized content for your clients</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send service-related communications</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. AI Processing</h2>
            <p>Client information you provide is sent to AI services (Claude by Anthropic) to generate content suggestions. This data is processed according to Anthropic's data handling policies and is not used to train AI models.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Data Storage</h2>
            <p>Your data is stored securely using Supabase, a trusted cloud database provider. We implement industry-standard security measures to protect your information.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Supabase - Authentication and database</li>
              <li>Stripe - Payment processing</li>
              <li>Anthropic (Claude) - AI content generation</li>
              <li>Vercel - Hosting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Data Retention</h2>
            <p>We retain your data for as long as your account is active. You may request deletion of your data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Contact</h2>
            <p>For privacy-related questions or requests, contact us at alharris603@gmail.com.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
