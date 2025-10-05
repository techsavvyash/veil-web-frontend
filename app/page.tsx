"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/lib/auth"
import HeroContent from "@/components/hero-content"
import PulsingCircle from "@/components/pulsing-circle"
import ShaderBackground from "@/components/shader-background"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Shield, Zap, Users, TrendingUp, Star } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="text-2xl font-bold text-foreground">Veil</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <ShaderBackground>
        <HeroContent />
      </ShaderBackground>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Veil provides the complete infrastructure for API monetization, so you can focus on what matters most.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="border-gray-200 hover:shadow-xl transition-all h-full bg-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-violet-600" />
                  </div>
                  <CardTitle className="text-black">Secure Authentication</CardTitle>
                  <CardDescription className="text-gray-600">Built-in API key management with rate limiting and usage tracking</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="border-gray-200 hover:shadow-xl transition-all h-full bg-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-violet-600" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-black">Instant Payments</CardTitle>
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">Coming Soon</Badge>
                  </div>
                  <CardDescription className="text-gray-600">
                    Automated billing and payouts with support for multiple payment methods
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="border-gray-200 hover:shadow-xl transition-all h-full bg-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-violet-600" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-black">Analytics Dashboard</CardTitle>
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">Coming Soon</Badge>
                  </div>
                  <CardDescription className="text-gray-600">Detailed insights into API usage, revenue, and customer behavior</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="border-gray-200 hover:shadow-xl transition-all h-full bg-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
                    <Code className="h-6 w-6 text-violet-600" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-black">Developer Tools</CardTitle>
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">Coming Soon</Badge>
                  </div>
                  <CardDescription className="text-gray-600">
                    SDKs, documentation generation, and testing tools for seamless integration
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="border-gray-200 hover:shadow-xl transition-all h-full bg-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-violet-600" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-black">Global Marketplace</CardTitle>
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">Coming Soon</Badge>
                  </div>
                  <CardDescription className="text-gray-600">
                    Reach thousands of developers looking for APIs to power their applications
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="border-gray-200 hover:shadow-xl transition-all h-full bg-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-violet-600" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-black">Quality Assurance</CardTitle>
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">Coming Soon</Badge>
                  </div>
                  <CardDescription className="text-gray-600">
                    Automated testing and monitoring to ensure your APIs are always available
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="container mx-auto text-center max-w-3xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
            Ready to Transform Your APIs into Revenue?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of developers who are already monetizing their APIs with Veil.
          </p>
          <Link href="/signup">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="bg-violet-600 text-white hover:bg-violet-700 px-8 py-3">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-black mb-4">Veil</div>
              <p className="text-gray-600">The future of API monetization is here.</p>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/marketplace" className="hover:text-black transition-colors">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-black transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-black transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/about" className="hover:text-black transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-black transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-black transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-4">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/help" className="hover:text-black transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-black transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-black transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 Veil. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
