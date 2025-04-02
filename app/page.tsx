"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Layout, Target } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image
              alt="digi-logo"
              src="/digi-logo.png"
              width={20}
              height={20}
            />
            {/* <Sparkles className="h-6 w-6 text-primary" /> */}
            <span className="font-bold text-xl">DigiZap</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#templates"
              className="text-sm font-medium hover:text-primary"
            >
              Templates
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:text-primary"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium hover:text-primary"
            >
              Login
            </Link>
            <Button onClick={() => (window.location.href = "#templates")}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Build Websites with the Power of AI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Create stunning websites, landing pages, and funnels in minutes
              with our AI-powered builder. No coding required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                onClick={() => (window.location.href = "#templates")}
              >
                Start Building for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => (window.location.href = "#templates")}
              >
                View Templates
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Powerful Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Layout className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Drag-and-Drop Builder
                </h3>
                <p className="text-muted-foreground">
                  Easily build your website with our intuitive drag-and-drop
                  interface. No coding skills required.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  AI Content Generation
                </h3>
                <p className="text-muted-foreground">
                  Generate high-converting copy and stunning images with our
                  AI-powered tools.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Conversion Optimization
                </h3>
                <p className="text-muted-foreground">
                  Built-in features to optimize your pages for maximum
                  conversions and engagement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Templates Section */}
        <section id="templates" className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Ready-to-Use Templates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  id: "modern-business",
                  name: "Modern Business",
                  description:
                    "Perfect for business websites and corporate landing pages.",
                  image:
                    "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
                },
                {
                  id: "creative-portfolio",
                  name: "Creative Portfolio",
                  description: "Showcase your work with this elegant design.",
                  image:
                    "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
                },
                {
                  id: "e-commerce",
                  name: "E-commerce Template",
                  description:
                    "Start selling products with this conversion-focused design.",
                  image:
                    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
                },
              ].map((template) => (
                <div
                  key={template.id}
                  className="bg-card rounded-lg overflow-hidden shadow-sm border"
                >
                  <div className="aspect-video bg-muted-foreground/10 relative">
                    <img
                      src={template.image || "/placeholder.svg"}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        onClick={() =>
                          (window.location.href = `/template-editor?template=${template.id}`)
                        }
                      >
                        Preview
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {template.description}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        (window.location.href = `/template-editor?template=${template.id}`)
                      }
                    >
                      Use This Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/dashboard")}
              >
                View All Templates
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Simple, Transparent Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Starter",
                  price: "$19",
                  features: [
                    "1 website",
                    "Basic AI content generation",
                    "5 pages per site",
                    "Standard templates",
                    "Email support",
                  ],
                },
                {
                  name: "Pro",
                  price: "$49",
                  popular: true,
                  features: [
                    "5 websites",
                    "Advanced AI content generation",
                    "Unlimited pages",
                    "All templates",
                    "Priority support",
                    "Custom domain",
                  ],
                },
                {
                  name: "Business",
                  price: "$99",
                  features: [
                    "20 websites",
                    "Premium AI content generation",
                    "Unlimited pages",
                    "All templates + custom",
                    "24/7 support",
                    "Team collaboration",
                    "API access",
                  ],
                },
              ].map((plan, i) => (
                <div
                  key={i}
                  className={`bg-card p-6 rounded-lg shadow-sm border ${
                    plan.popular ? "border-primary ring-1 ring-primary" : ""
                  } relative`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg rounded-tr-lg">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center">
                        <svg
                          className="h-4 w-4 text-primary mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => (window.location.href = "/login")}
                  >
                    Get Started
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
          
                <Image
                  alt="digi-logo"
                  src="/digi-logo.png"
                  width={20}
                  height={20}
                />
                {/* <Sparkles className="h-6 w-6 text-primary" /> */}
                <span className="font-bold text-xl">DigiZap</span>
         
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
              <Link href="#" className="text-sm hover:text-primary">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm hover:text-primary">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} BuildAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

