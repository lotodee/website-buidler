"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import {
  Save,
  Eye,
  Download,
  ArrowLeft,
  ImageIcon,
  Plus,
  Trash,
  Code,
  Smartphone,
  Tablet,
  Monitor,
  Upload,
  X,
  GripVertical,
  Edit,
  Undo,
  Redo,
  Loader2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Template data types
interface NavItem {
  id: string
  label: string
  link: string
}

interface ContactInfo {
  email: string
  phone: string
  address: string
  showSocialLinks: boolean
  socialLinks: {
    facebook: string
    twitter: string
    instagram: string
    linkedin: string
  }
}

interface Section {
  id: string
  title: string
  subtitle?: string
  content: string
  type: "text" | "features" | "gallery" | "contact" | "pricing" | "testimonials"
  items?: any[]
  background?: string
  textColor?: string
  contactInfo?: ContactInfo
}

interface HeroSection {
  title: string
  subtitle: string
  backgroundImage?: string
  backgroundColor?: string
  textColor?: string
  buttonText?: string
  buttonLink?: string
  showButton: boolean
  alignment: "left" | "center" | "right"
  overlayOpacity: number
}

interface FooterSettings {
  backgroundColor: string
  textColor: string
  showCopyright: boolean
  copyrightText: string
  showSocialLinks: boolean
  showNavLinks: boolean
}

interface Template {
  id: string
  name: string
  description: string
  logo?: string
  navItems: NavItem[]
  showAuth: boolean
  hero: HeroSection
  sections: Section[]
  footer: FooterSettings
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  fonts: {
    heading: string
    body: string
  }
  spacing: {
    sectionPadding: number
    contentWidth: number
  }
  animations: {
    pageTransition: boolean
    scrollAnimation: boolean
    hoverEffects: boolean
  }
}

// Available templates
const TEMPLATES: Template[] = [
  {
    id: "modern-business",
    name: "Modern Business",
    description: "A clean, professional template for business websites",
    navItems: [
      { id: "nav-1", label: "Home", link: "#home" },
      { id: "nav-2", label: "Features", link: "#features" },
      { id: "nav-3", label: "Services", link: "#services" },
      { id: "nav-4", label: "Testimonials", link: "#testimonials" },
      { id: "nav-5", label: "Contact", link: "#contact" },
    ],
    showAuth: true,
    hero: {
      title: "Grow Your Business with Our Solutions",
      subtitle: "We provide innovative services to help your business thrive in the digital age",
      backgroundImage:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      textColor: "#ffffff",
      buttonText: "Get Started",
      buttonLink: "#contact",
      showButton: true,
      alignment: "center",
      overlayOpacity: 0.5,
    },
    sections: [
      {
        id: "features",
        title: "Our Features",
        subtitle: "What makes us different",
        content: "We offer a range of features designed to help your business grow.",
        type: "features",
        items: [
          {
            id: "feature-1",
            title: "Innovative Solutions",
            description: "Our cutting-edge solutions help you stay ahead of the competition.",
            icon: "Lightbulb",
          },
          {
            id: "feature-2",
            title: "Expert Support",
            description: "Our team of experts is always ready to help you succeed.",
            icon: "Users",
          },
          {
            id: "feature-3",
            title: "Reliable Service",
            description: "We provide reliable service that you can count on.",
            icon: "Shield",
          },
        ],
      },
      {
        id: "services",
        title: "Our Services",
        content: "We offer a wide range of services to meet your business needs.",
        type: "text",
        background: "#f8f9fa",
        textColor: "#333333",
      },
      {
        id: "testimonials",
        title: "What Our Clients Say",
        content: "Don't just take our word for it. Here's what our clients have to say.",
        type: "testimonials",
        items: [
          {
            id: "testimonial-1",
            quote: "Working with this company has been a game-changer for our business.",
            author: "John Smith",
            company: "ABC Corp",
            image:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
          },
          {
            id: "testimonial-2",
            quote: "The team is professional, responsive, and delivers exceptional results.",
            author: "Jane Doe",
            company: "XYZ Inc",
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
          },
        ],
      },
      {
        id: "contact",
        title: "Contact Us",
        content: "Get in touch with us to learn more about our services.",
        type: "contact",
        contactInfo: {
          email: "info@example.com",
          phone: "(123) 456-7890",
          address: "123 Main St, City, Country",
          showSocialLinks: true,
          socialLinks: {
            facebook: "https://facebook.com",
            twitter: "https://twitter.com",
            instagram: "https://instagram.com",
            linkedin: "https://linkedin.com",
          },
        },
      },
    ],
    footer: {
      backgroundColor: "#333333",
      textColor: "#ffffff",
      showCopyright: true,
      copyrightText: "© 2023 Modern Business. All rights reserved.",
      showSocialLinks: true,
      showNavLinks: true,
    },
    colors: {
      primary: "#4361ee",
      secondary: "#3f37c9",
      accent: "#f72585",
      background: "#ffffff",
      text: "#333333",
    },
    fonts: {
      heading: "Poppins",
      body: "Inter",
    },
    spacing: {
      sectionPadding: 80,
      contentWidth: 1200,
    },
    animations: {
      pageTransition: true,
      scrollAnimation: true,
      hoverEffects: true,
    },
  },
  {
    id: "creative-portfolio",
    name: "Creative Portfolio",
    description: "A vibrant, creative template for portfolios and creative professionals",
    navItems: [
      { id: "nav-1", label: "Home", link: "#home" },
      { id: "nav-2", label: "About", link: "#about" },
      { id: "nav-3", label: "Portfolio", link: "#portfolio" },
      { id: "nav-4", label: "Services", link: "#services" },
      { id: "nav-5", label: "Contact", link: "#contact" },
    ],
    showAuth: false,
    hero: {
      title: "Hello, I'm a Creative Designer",
      subtitle: "I create beautiful, functional designs that help businesses stand out",
      backgroundColor: "#111111",
      textColor: "#ffffff",
      buttonText: "View My Work",
      buttonLink: "#portfolio",
      showButton: true,
      alignment: "left",
      overlayOpacity: 0.7,
    },
    sections: [
      {
        id: "about",
        title: "About Me",
        content: "I'm a passionate designer with over 5 years of experience in creating beautiful, functional designs.",
        type: "text",
        background: "#ffffff",
        textColor: "#333333",
      },
      {
        id: "portfolio",
        title: "My Portfolio",
        subtitle: "Recent Projects",
        content: "Here are some of my recent projects. Click on each to learn more.",
        type: "gallery",
        items: [
          {
            id: "project-1",
            title: "Brand Identity",
            description: "A complete brand identity for a tech startup.",
            image:
              "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          },
          {
            id: "project-2",
            title: "Website Redesign",
            description: "A complete redesign of an e-commerce website.",
            image:
              "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          },
          {
            id: "project-3",
            title: "Mobile App UI",
            description: "UI design for a fitness tracking mobile app.",
            image:
              "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          },
        ],
      },
      {
        id: "services",
        title: "My Services",
        content: "I offer a range of design services to help your business stand out.",
        type: "features",
        items: [
          {
            id: "service-1",
            title: "UI/UX Design",
            description: "Creating beautiful, functional user interfaces and experiences.",
            icon: "Monitor",
          },
          {
            id: "service-2",
            title: "Brand Identity",
            description: "Developing cohesive brand identities that resonate with your audience.",
            icon: "Palette",
          },
          {
            id: "service-3",
            title: "Web Design",
            description: "Designing responsive, modern websites that convert visitors into customers.",
            icon: "Globe",
          },
        ],
      },
      {
        id: "contact",
        title: "Get In Touch",
        content: "Interested in working together? Fill out the form below to get started.",
        type: "contact",
        contactInfo: {
          email: "hello@designer.com",
          phone: "+1 (234) 567-8901",
          address: "456 Design St, Creative City, Art Country",
          showSocialLinks: true,
          socialLinks: {
            facebook: "https://facebook.com",
            twitter: "https://twitter.com",
            instagram: "https://instagram.com",
            linkedin: "https://linkedin.com",
          },
        },
      },
    ],
    footer: {
      backgroundColor: "#111111",
      textColor: "#ffffff",
      showCopyright: true,
      copyrightText: "© 2023 Creative Portfolio. All rights reserved.",
      showSocialLinks: true,
      showNavLinks: true,
    },
    colors: {
      primary: "#ff6b6b",
      secondary: "#4ecdc4",
      accent: "#ffe66d",
      background: "#ffffff",
      text: "#333333",
    },
    fonts: {
      heading: "Montserrat",
      body: "Roboto",
    },
    spacing: {
      sectionPadding: 100,
      contentWidth: 1140,
    },
    animations: {
      pageTransition: true,
      scrollAnimation: true,
      hoverEffects: true,
    },
  },
]

// Available fonts
const FONTS = ["Inter", "Roboto", "Poppins", "Montserrat", "Open Sans", "Lato", "Playfair Display", "Merriweather"]

// Available icons
const ICONS = ["Lightbulb", "Users", "Shield", "Monitor", "Palette", "Globe", "Heart", "Star", "Zap", "Award"]

export default function TemplateEditor() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template") || "modern-business"

  const [template, setTemplate] = useState<Template | null>(null)
  const [activeTab, setActiveTab] = useState("general")
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [showPreview, setShowPreview] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [exportFormat, setExportFormat] = useState<"react" | "png">("react")
  const [editingNavItem, setEditingNavItem] = useState<string | null>(null)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editingSectionItem, setEditingSectionItem] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null)
  const [history, setHistory] = useState<Template[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const previewRef = useRef<HTMLDivElement>(null)

  // Initialize template data
  useEffect(() => {
    const selectedTemplate = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0]
    const initialTemplate = { ...selectedTemplate }
    setTemplate(initialTemplate)

    // Initialize history
    setHistory([initialTemplate])
    setHistoryIndex(0)

    // Set logo preview if exists
    if (selectedTemplate.logo) {
      setLogoPreview(selectedTemplate.logo)
    }

    // Set hero image preview if exists
    if (selectedTemplate.hero.backgroundImage) {
      setHeroImagePreview(selectedTemplate.hero.backgroundImage)
    }

    // Load saved template if exists
    const savedTemplate = localStorage.getItem(`template-${templateId}`)
    if (savedTemplate) {
      try {
        const parsedTemplate = JSON.parse(savedTemplate)
        setTemplate(parsedTemplate)
        setHistory([parsedTemplate])

        if (parsedTemplate.logo) {
          setLogoPreview(parsedTemplate.logo)
        }

        if (parsedTemplate.hero.backgroundImage) {
          setHeroImagePreview(parsedTemplate.hero.backgroundImage)
        }
      } catch (error) {
        console.error("Error loading saved template:", error)
      }
    }
  }, [templateId])

  // Handle undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setTemplate({ ...history[newIndex] })

      // Update previews
      if (history[newIndex].logo) {
        setLogoPreview(history[newIndex].logo)
      } else {
        setLogoPreview(null)
      }

      if (history[newIndex].hero.backgroundImage) {
        setHeroImagePreview(history[newIndex].hero.backgroundImage)
      } else {
        setHeroImagePreview(null)
      }
    }
  }

  // Handle redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setTemplate({ ...history[newIndex] })

      // Update previews
      if (history[newIndex].logo) {
        setLogoPreview(history[newIndex].logo)
      } else {
        setLogoPreview(null)
      }

      if (history[newIndex].hero.backgroundImage) {
        setHeroImagePreview(history[newIndex].hero.backgroundImage)
      } else {
        setHeroImagePreview(null)
      }
    }
  }

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setLogoPreview(result)
      if (template) {
        setTemplate({ ...template, logo: result })
      }
    }
    reader.readAsDataURL(file)
  }

  // Handle hero image upload
  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setHeroImagePreview(result)
      if (template) {
        setTemplate({
          ...template,
          hero: {
            ...template.hero,
            backgroundImage: result,
          },
        })
      }
    }
    reader.readAsDataURL(file)
  }

  // Handle image upload for section items
  const handleItemImageUpload = (e: React.ChangeEvent<HTMLInputElement>, sectionId: string, itemId: string) => {
    const file = e.target.files?.[0]
    if (!file || !template) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string

      const updatedSections = template.sections.map((section) => {
        if (section.id === sectionId && section.items) {
          const updatedItems = section.items.map((item) => (item.id === itemId ? { ...item, image: result } : item))
          return { ...section, items: updatedItems }
        }
        return section
      })

      setTemplate({ ...template, sections: updatedSections })
    }
    reader.readAsDataURL(file)
  }

  // Handle nav item changes
  const handleNavItemChange = (id: string, field: keyof NavItem, value: string) => {
    if (!template) return

    const updatedNavItems = template.navItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))

    setTemplate({ ...template, navItems: updatedNavItems })
  }

  // Add new nav item
  const handleAddNavItem = () => {
    if (!template) return

    const newId = `nav-${Date.now()}`
    const newNavItem: NavItem = {
      id: newId,
      label: "New Item",
      link: `#${newId}`,
    }

    // Add new nav item
    const updatedNavItems = [...template.navItems, newNavItem]

    // Add corresponding section
    const newSection: Section = {
      id: newId,
      title: "New Section",
      content: "Add your content here.",
      type: "text",
      contactInfo: {
        email: "info@example.com",
        phone: "(123) 456-7890",
        address: "123 Main St, City, Country",
        showSocialLinks: true,
        socialLinks: {
          facebook: "https://facebook.com",
          twitter: "https://twitter.com",
          instagram: "https://instagram.com",
          linkedin: "https://linkedin.com",
        },
      },
    }

    const updatedSections = [...template.sections, newSection]

    setTemplate({
      ...template,
      navItems: updatedNavItems,
      sections: updatedSections,
    })

    // Set to edit mode
    setEditingNavItem(newId)
  }

  // Remove nav item
  const handleRemoveNavItem = (id: string) => {
    if (!template) return

    // Remove nav item
    const updatedNavItems = template.navItems.filter((item) => item.id !== id)

    // Remove corresponding section
    const updatedSections = template.sections.filter((section) => section.id !== id)

    setTemplate({
      ...template,
      navItems: updatedNavItems,
      sections: updatedSections,
    })
  }

  // Handle hero section changes
  const handleHeroChange = (field: keyof HeroSection, value: any) => {
    if (!template) return

    setTemplate({
      ...template,
      hero: {
        ...template.hero,
        [field]: value,
      },
    })
  }

  // Handle section changes
  const handleSectionChange = (id: string, field: keyof Section, value: any) => {
    if (!template) return

    const updatedSections = template.sections.map((section) =>
      section.id === id ? { ...section, [field]: value } : section,
    )

    setTemplate({ ...template, sections: updatedSections })
  }

  // Handle contact info changes
  const handleContactInfoChange = (sectionId: string, field: keyof ContactInfo, value: any) => {
    if (!template) return

    const updatedSections = template.sections.map((section) => {
      if (section.id === sectionId && section.contactInfo) {
        return {
          ...section,
          contactInfo: {
            ...section.contactInfo,
            [field]: value,
          },
        }
      }
      return section
    })

    setTemplate({ ...template, sections: updatedSections })
  }

  // Handle social link changes
  const handleSocialLinkChange = (sectionId: string, platform: keyof ContactInfo["socialLinks"], value: string) => {
    if (!template) return

    const updatedSections = template.sections.map((section) => {
      if (section.id === sectionId && section.contactInfo) {
        return {
          ...section,
          contactInfo: {
            ...section.contactInfo,
            socialLinks: {
              ...section.contactInfo.socialLinks,
              [platform]: value,
            },
          },
        }
      }
      return section
    })

    setTemplate({ ...template, sections: updatedSections })
  }

  // Handle footer changes
  const handleFooterChange = (field: keyof FooterSettings, value: any) => {
    if (!template) return

    setTemplate({
      ...template,
      footer: {
        ...template.footer,
        [field]: value,
      },
    })
  }

  // Handle section item changes
  const handleSectionItemChange = (sectionId: string, itemId: string, field: string, value: any) => {
    if (!template) return

    const updatedSections = template.sections.map((section) => {
      if (section.id === sectionId && section.items) {
        const updatedItems = section.items.map((item) => (item.id === itemId ? { ...item, [field]: value } : item))
        return { ...section, items: updatedItems }
      }
      return section
    })

    setTemplate({ ...template, sections: updatedSections })
  }

  // Add section item
  const handleAddSectionItem = (sectionId: string, itemType: string) => {
    if (!template) return

    const section = template.sections.find((s) => s.id === sectionId)
    if (!section) return

    let newItem: any = { id: `${itemType}-${Date.now()}` }

    switch (section.type) {
      case "features":
        newItem = {
          ...newItem,
          title: "New Feature",
          description: "Description of the new feature",
          icon: "Star",
        }
        break
      case "gallery":
        newItem = {
          ...newItem,
          title: "New Project",
          description: "Description of the new project",
          image:
            "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        }
        break
      case "testimonials":
        newItem = {
          ...newItem,
          quote: "This is a great service!",
          author: "New Client",
          company: "Company Name",
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
        }
        break
      default:
        break
    }

    const updatedSections = template.sections.map((s) => {
      if (s.id === sectionId) {
        return {
          ...s,
          items: [...(s.items || []), newItem],
        }
      }
      return s
    })

    setTemplate({ ...template, sections: updatedSections })

    // Set to edit mode
    setEditingSectionItem(newItem.id)
  }

  // Remove section item
  const handleRemoveSectionItem = (sectionId: string, itemId: string) => {
    if (!template) return

    const updatedSections = template.sections.map((section) => {
      if (section.id === sectionId && section.items) {
        const updatedItems = section.items.filter((item) => item.id !== itemId)
        return { ...section, items: updatedItems }
      }
      return section
    })

    setTemplate({ ...template, sections: updatedSections })
  }

  // Handle color changes
  const handleColorChange = (colorKey: keyof Template["colors"], value: string) => {
    if (!template) return

    setTemplate({
      ...template,
      colors: {
        ...template.colors,
        [colorKey]: value,
      },
    })
  }

  // Handle font changes
  const handleFontChange = (fontKey: keyof Template["fonts"], value: string) => {
    if (!template) return

    setTemplate({
      ...template,
      fonts: {
        ...template.fonts,
        [fontKey]: value,
      },
    })
  }

  // Handle spacing changes
  const handleSpacingChange = (spacingKey: keyof Template["spacing"], value: number) => {
    if (!template) return

    setTemplate({
      ...template,
      spacing: {
        ...template.spacing,
        [spacingKey]: value,
      },
    })
  }

  // Handle animation settings changes
  const handleAnimationChange = (animKey: keyof Template["animations"], value: boolean) => {
    if (!template) return

    setTemplate({
      ...template,
      animations: {
        ...template.animations,
        [animKey]: value,
      },
    })
  }

  // Save template
  const handleSave = async () => {
    if (!template) return

    setIsSaving(true)

    try {
      // In a real app, this would save to a database
      localStorage.setItem(`template-${template.id}`, JSON.stringify(template))

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      toast({
        title: "Template saved",
        description: "Your template has been saved successfully",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Error saving template",
        description: "There was an error saving your template. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Export template
  const handleExport = async () => {
    if (!template) return

    setIsExporting(true)

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Template exported",
        description: "Your template has been exported successfully",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Error exporting template",
        description: "There was an error exporting your template. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsExporting(false)
      setShowExport(false)
    }
  }

  if (!template) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold">Loading template...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background z-10">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">{template.name}</h1>
            <Badge variant="outline" className="ml-2">
              {template.id}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center mr-4">
              <Button variant="ghost" size="icon" onClick={handleUndo} disabled={historyIndex <= 0} title="Undo">
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center border rounded-md p-1 bg-background">
              <Button
                variant="ghost"
                size="sm"
                className={cn("px-3", viewMode === "desktop" ? "bg-muted" : "")}
                onClick={() => setViewMode("desktop")}
              >
                <Monitor className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Desktop</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn("px-3", viewMode === "tablet" ? "bg-muted" : "")}
                onClick={() => setViewMode("tablet")}
              >
                <Tablet className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Tablet</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn("px-3", viewMode === "mobile" ? "bg-muted" : "")}
                onClick={() => setViewMode("mobile")}
              >
                <Smartphone className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Mobile</span>
              </Button>
            </div>

            <Button variant="ghost" size="sm" onClick={() => setShowPreview(true)} className="hidden sm:flex">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>

            <Button variant="ghost" size="sm" onClick={() => setShowExport(true)} className="hidden sm:flex">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button onClick={handleSave} disabled={isSaving} className="ml-2">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-64 border-r bg-muted/10 overflow-auto">
          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
              <TabsTrigger
                value="general"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value="sections"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Sections
              </TabsTrigger>
              <TabsTrigger
                value="styles"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Styles
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-8rem)]">
              <TabsContent value="general" className="p-4 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Template Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      value={template.name}
                      onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-description">Description</Label>
                    <Textarea
                      id="template-description"
                      value={template.description}
                      onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Logo</h3>
                  <div className="flex items-center justify-center border rounded-md p-4 bg-background">
                    {logoPreview ? (
                      <div className="relative">
                        <img
                          src={logoPreview || "/placeholder.svg"}
                          alt="Logo"
                          className="max-h-16 max-w-full object-contain"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={() => {
                            setLogoPreview(null)
                            setTemplate({ ...template, logo: undefined })
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="h-10 w-10 text-muted-foreground mb-2 mx-auto" />
                        <p className="text-sm text-muted-foreground">No logo uploaded</p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <Label
                      htmlFor="logo-upload"
                      className="cursor-pointer flex items-center justify-center text-sm text-primary hover:underline"
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      {logoPreview ? "Change Logo" : "Upload Logo"}
                    </Label>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Navigation</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Show Auth Buttons</Label>
                      <Switch
                        checked={template.showAuth}
                        onCheckedChange={(checked) => setTemplate({ ...template, showAuth: checked })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Navigation Items</Label>
                      <Button variant="outline" size="sm" onClick={handleAddNavItem} className="h-7 text-xs">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Item
                      </Button>
                    </div>

                    <div className="space-y-2 mt-2">
                      {template.navItems.map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            "border rounded-md p-2 bg-background",
                            editingNavItem === item.id ? "ring-2 ring-primary" : "",
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <GripVertical className="h-4 w-4 text-muted-foreground mr-2" />
                              <span className="text-sm font-medium">{item.label}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => setEditingNavItem(editingNavItem === item.id ? null : item.id)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive"
                                onClick={() => handleRemoveNavItem(item.id)}
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {editingNavItem === item.id && (
                            <div className="space-y-2 pt-2 border-t">
                              <div className="space-y-1">
                                <Label htmlFor={`nav-label-${item.id}`} className="text-xs">
                                  Label
                                </Label>
                                <Input
                                  id={`nav-label-${item.id}`}
                                  value={item.label}
                                  onChange={(e) => handleNavItemChange(item.id, "label", e.target.value)}
                                  className="h-7 text-sm"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor={`nav-link-${item.id}`} className="text-xs">
                                  Link
                                </Label>
                                <Input
                                  id={`nav-link-${item.id}`}
                                  value={item.link}
                                  onChange={(e) => handleNavItemChange(item.id, "link", e.target.value)}
                                  className="h-7 text-sm"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sections" className="p-4 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Hero Section</h3>
                  <div className="space-y-2">
                    <Label htmlFor="hero-title">Title</Label>
                    <Input
                      id="hero-title"
                      value={template.hero.title}
                      onChange={(e) => handleHeroChange("title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-subtitle">Subtitle</Label>
                    <Textarea
                      id="hero-subtitle"
                      value={template.hero.subtitle}
                      onChange={(e) => handleHeroChange("subtitle", e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Text Alignment</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant={template.hero.alignment === "left" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleHeroChange("alignment", "left")}
                        className="flex-1"
                      >
                        Left
                      </Button>
                      <Button
                        variant={template.hero.alignment === "center" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleHeroChange("alignment", "center")}
                        className="flex-1"
                      >
                        Center
                      </Button>
                      <Button
                        variant={template.hero.alignment === "right" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleHeroChange("alignment", "right")}
                        className="flex-1"
                      >
                        Right
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Show Button</Label>
                      <Switch
                        checked={template.hero.showButton}
                        onCheckedChange={(checked) => handleHeroChange("showButton", checked)}
                      />
                    </div>

                    {template.hero.showButton && (
                      <>
                        <div className="space-y-1">
                          <Label htmlFor="hero-button-text" className="text-xs">
                            Button Text
                          </Label>
                          <Input
                            id="hero-button-text"
                            value={template.hero.buttonText || ""}
                            onChange={(e) => handleHeroChange("buttonText", e.target.value)}
                            className="h-7 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="hero-button-link" className="text-xs">
                            Button Link
                          </Label>
                          <Input
                            id="hero-button-link"
                            value={template.hero.buttonLink || ""}
                            onChange={(e) => handleHeroChange("buttonLink", e.target.value)}
                            className="h-7 text-sm"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Background Image</Label>
                    <div className="flex items-center justify-center border rounded-md p-4 bg-background">
                      {heroImagePreview ? (
                        <div className="relative w-full">
                          <img
                            src={heroImagePreview || "/placeholder.svg"}
                            alt="Hero Background"
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={() => {
                              setHeroImagePreview(null)
                              handleHeroChange("backgroundImage", undefined)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="h-10 w-10 text-muted-foreground mb-2 mx-auto" />
                          <p className="text-sm text-muted-foreground">No background image</p>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-center">
                      <Label
                        htmlFor="hero-image-upload"
                        className="cursor-pointer flex items-center justify-center text-sm text-primary hover:underline"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        {heroImagePreview ? "Change Image" : "Upload Image"}
                      </Label>
                      <input
                        id="hero-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleHeroImageUpload}
                      />
                    </div>
                  </div>

                  {heroImagePreview && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="overlay-opacity">Overlay Opacity</Label>
                        <span className="text-xs text-muted-foreground">{template.hero.overlayOpacity}</span>
                      </div>
                      <Slider
                        id="overlay-opacity"
                        min={0}
                        max={1}
                        step={0.1}
                        value={[template.hero.overlayOpacity]}
                        onValueChange={(value) => handleHeroChange("overlayOpacity", value[0])}
                      />
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Content Sections</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {template.sections.map((section) => (
                      <AccordionItem key={section.id} value={section.id}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center text-sm">
                            <span className="font-medium">{section.title}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {section.type}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pt-2">
                            <div className="space-y-1">
                              <Label htmlFor={`section-title-${section.id}`} className="text-xs">
                                Title
                              </Label>
                              <Input
                                id={`section-title-${section.id}`}
                                value={section.title}
                                onChange={(e) => handleSectionChange(section.id, "title", e.target.value)}
                                className="h-7 text-sm"
                              />
                            </div>

                            {section.subtitle !== undefined && (
                              <div className="space-y-1">
                                <Label htmlFor={`section-subtitle-${section.id}`} className="text-xs">
                                  Subtitle
                                </Label>
                                <Input
                                  id={`section-subtitle-${section.id}`}
                                  value={section.subtitle}
                                  onChange={(e) => handleSectionChange(section.id, "subtitle", e.target.value)}
                                  className="h-7 text-sm"
                                />
                              </div>
                            )}

                            <div className="space-y-1">
                              <Label htmlFor={`section-content-${section.id}`} className="text-xs">
                                Content
                              </Label>
                              <Textarea
                                id={`section-content-${section.id}`}
                                value={section.content}
                                onChange={(e) => handleSectionChange(section.id, "content", e.target.value)}
                                className="text-sm"
                                rows={3}
                              />
                            </div>

                            {section.type === "contact" && section.contactInfo && (
                              <div className="space-y-3 pt-2 border-t mt-3">
                                <h4 className="text-xs font-medium">Contact Information</h4>
                                <div className="space-y-1">
                                  <Label htmlFor={`contact-email-${section.id}`} className="text-xs">
                                    Email
                                  </Label>
                                  <Input
                                    id={`contact-email-${section.id}`}
                                    value={section.contactInfo.email}
                                    onChange={(e) => handleContactInfoChange(section.id, "email", e.target.value)}
                                    className="h-7 text-sm"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label htmlFor={`contact-phone-${section.id}`} className="text-xs">
                                    Phone
                                  </Label>
                                  <Input
                                    id={`contact-phone-${section.id}`}
                                    value={section.contactInfo.phone}
                                    onChange={(e) => handleContactInfoChange(section.id, "phone", e.target.value)}
                                    className="h-7 text-sm"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label htmlFor={`contact-address-${section.id}`} className="text-xs">
                                    Address
                                  </Label>
                                  <Input
                                    id={`contact-address-${section.id}`}
                                    value={section.contactInfo.address}
                                    onChange={(e) => handleContactInfoChange(section.id, "address", e.target.value)}
                                    className="h-7 text-sm"
                                  />
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                  <Label className="text-xs">Show Social Links</Label>
                                  <Switch
                                    checked={section.contactInfo.showSocialLinks}
                                    onCheckedChange={(checked) =>
                                      handleContactInfoChange(section.id, "showSocialLinks", checked)
                                    }
                                  />
                                </div>

                                {section.contactInfo.showSocialLinks && (
                                  <div className="space-y-2 pt-2">
                                    <div className="space-y-1">
                                      <Label
                                        htmlFor={`social-facebook-${section.id}`}
                                        className="text-xs flex items-center"
                                      >
                                        <Facebook className="h-3 w-3 mr-1" /> Facebook
                                      </Label>
                                      <Input
                                        id={`social-facebook-${section.id}`}
                                        value={section.contactInfo.socialLinks.facebook}
                                        onChange={(e) => handleSocialLinkChange(section.id, "facebook", e.target.value)}
                                        className="h-7 text-sm"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label
                                        htmlFor={`social-twitter-${section.id}`}
                                        className="text-xs flex items-center"
                                      >
                                        <Twitter className="h-3 w-3 mr-1" /> Twitter
                                      </Label>
                                      <Input
                                        id={`social-twitter-${section.id}`}
                                        value={section.contactInfo.socialLinks.twitter}
                                        onChange={(e) => handleSocialLinkChange(section.id, "twitter", e.target.value)}
                                        className="h-7 text-sm"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label
                                        htmlFor={`social-instagram-${section.id}`}
                                        className="text-xs flex items-center"
                                      >
                                        <Instagram className="h-3 w-3 mr-1" /> Instagram
                                      </Label>
                                      <Input
                                        id={`social-instagram-${section.id}`}
                                        value={section.contactInfo.socialLinks.instagram}
                                        onChange={(e) =>
                                          handleSocialLinkChange(section.id, "instagram", e.target.value)
                                        }
                                        className="h-7 text-sm"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label
                                        htmlFor={`social-linkedin-${section.id}`}
                                        className="text-xs flex items-center"
                                      >
                                        <Linkedin className="h-3 w-3 mr-1" /> LinkedIn
                                      </Label>
                                      <Input
                                        id={`social-linkedin-${section.id}`}
                                        value={section.contactInfo.socialLinks.linkedin}
                                        onChange={(e) => handleSocialLinkChange(section.id, "linkedin", e.target.value)}
                                        className="h-7 text-sm"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {(section.type === "features" ||
                              section.type === "gallery" ||
                              section.type === "testimonials") &&
                              section.items && (
                                <div className="space-y-3 pt-2 border-t mt-3">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-medium">
                                      {section.type === "features"
                                        ? "Features"
                                        : section.type === "gallery"
                                          ? "Gallery Items"
                                          : "Testimonials"}
                                    </h4>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleAddSectionItem(section.id, section.type)}
                                      className="h-6 text-xs"
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add Item
                                    </Button>
                                  </div>

                                  <div className="space-y-3">
                                    {section.items.map((item) => (
                                      <Card key={item.id} className="overflow-hidden">
                                        <CardContent className="p-3">
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium">
                                              {item.title || item.author || "Item"}
                                            </span>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-6 w-6 text-destructive"
                                              onClick={() => handleRemoveSectionItem(section.id, item.id)}
                                            >
                                              <Trash className="h-3 w-3" />
                                            </Button>
                                          </div>

                                          {section.type === "features" && (
                                            <div className="space-y-2">
                                              <div className="space-y-1">
                                                <Label htmlFor={`item-title-${item.id}`} className="text-xs">
                                                  Title
                                                </Label>
                                                <Input
                                                  id={`item-title-${item.id}`}
                                                  value={item.title}
                                                  onChange={(e) =>
                                                    handleSectionItemChange(
                                                      section.id,
                                                      item.id,
                                                      "title",
                                                      e.target.value,
                                                    )
                                                  }
                                                  className="h-7 text-xs"
                                                />
                                              </div>
                                              <div className="space-y-1">
                                                <Label htmlFor={`item-desc-${item.id}`} className="text-xs">
                                                  Description
                                                </Label>
                                                <Textarea
                                                  id={`item-desc-${item.id}`}
                                                  value={item.description}
                                                  onChange={(e) =>
                                                    handleSectionItemChange(
                                                      section.id,
                                                      item.id,
                                                      "description",
                                                      e.target.value,
                                                    )
                                                  }
                                                  className="text-xs"
                                                  rows={2}
                                                />
                                              </div>
                                              <div className="space-y-1">
                                                <Label htmlFor={`item-icon-${item.id}`} className="text-xs">
                                                  Icon
                                                </Label>
                                                <Select
                                                  value={item.icon}
                                                  onValueChange={(value) =>
                                                    handleSectionItemChange(section.id, item.id, "icon", value)
                                                  }
                                                >
                                                  <SelectTrigger id={`item-icon-${item.id}`} className="h-7 text-xs">
                                                    <SelectValue placeholder="Select icon" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    {ICONS.map((icon) => (
                                                      <SelectItem key={icon} value={icon} className="text-xs">
                                                        {icon}
                                                      </SelectItem>
                                                    ))}
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            </div>
                                          )}

                                          {section.type === "gallery" && (
                                            <div className="space-y-2">
                                              <div className="space-y-1">
                                                <Label htmlFor={`item-title-${item.id}`} className="text-xs">
                                                  Title
                                                </Label>
                                                <Input
                                                  id={`item-title-${item.id}`}
                                                  value={item.title}
                                                  onChange={(e) =>
                                                    handleSectionItemChange(
                                                      section.id,
                                                      item.id,
                                                      "title",
                                                      e.target.value,
                                                    )
                                                  }
                                                  className="h-7 text-xs"
                                                />
                                              </div>
                                              <div className="space-y-1">
                                                <Label htmlFor={`item-desc-${item.id}`} className="text-xs">
                                                  Description
                                                </Label>
                                                <Textarea
                                                  id={`item-desc-${item.id}`}
                                                  value={item.description}
                                                  onChange={(e) =>
                                                    handleSectionItemChange(
                                                      section.id,
                                                      item.id,
                                                      "description",
                                                      e.target.value,
                                                    )
                                                  }
                                                  className="text-xs"
                                                  rows={2}
                                                />
                                              </div>
                                              <div className="space-y-1">
                                                <Label className="text-xs">Image</Label>
                                                <div className="border rounded-md p-2 bg-background">
                                                  <img
                                                    src={item.image || "/placeholder.svg"}
                                                    alt={item.title}
                                                    className="w-full h-20 object-cover rounded-md"
                                                  />
                                                </div>
                                                <Label
                                                  htmlFor={`item-image-${item.id}`}
                                                  className="cursor-pointer flex items-center justify-center text-xs text-primary hover:underline mt-1"
                                                >
                                                  <Upload className="h-3 w-3 mr-1" />
                                                  Change Image
                                                </Label>
                                                <input
                                                  id={`item-image-${item.id}`}
                                                  type="file"
                                                  accept="image/*"
                                                  className="hidden"
                                                  onChange={(e) => handleItemImageUpload(e, section.id, item.id)}
                                                />
                                              </div>
                                            </div>
                                          )}

                                          {section.type === "testimonials" && (
                                            <div className="space-y-2">
                                              <div className="space-y-1">
                                                <Label htmlFor={`item-quote-${item.id}`} className="text-xs">
                                                  Quote
                                                </Label>
                                                <Textarea
                                                  id={`item-quote-${item.id}`}
                                                  value={item.quote}
                                                  onChange={(e) =>
                                                    handleSectionItemChange(
                                                      section.id,
                                                      item.id,
                                                      "quote",
                                                      e.target.value,
                                                    )
                                                  }
                                                  className="text-xs"
                                                  rows={2}
                                                />
                                              </div>
                                              <div className="space-y-1">
                                                <Label htmlFor={`item-author-${item.id}`} className="text-xs">
                                                  Author
                                                </Label>
                                                <Input
                                                  id={`item-author-${item.id}`}
                                                  value={item.author}
                                                  onChange={(e) =>
                                                    handleSectionItemChange(
                                                      section.id,
                                                      item.id,
                                                      "author",
                                                      e.target.value,
                                                    )
                                                  }
                                                  className="h-7 text-xs"
                                                />
                                              </div>
                                              <div className="space-y-1">
                                                <Label htmlFor={`item-company-${item.id}`} className="text-xs">
                                                  Company
                                                </Label>
                                                <Input
                                                  id={`item-company-${item.id}`}
                                                  value={item.company}
                                                  onChange={(e) =>
                                                    handleSectionItemChange(
                                                      section.id,
                                                      item.id,
                                                      "company",
                                                      e.target.value,
                                                    )
                                                  }
                                                  className="h-7 text-xs"
                                                />
                                              </div>
                                              <div className="space-y-1">
                                                <Label className="text-xs">Author Image</Label>
                                                <div className="border rounded-md p-2 bg-background">
                                                  <img
                                                    src={item.image || "/placeholder.svg"}
                                                    alt={item.author}
                                                    className="w-16 h-16 object-cover rounded-full mx-auto"
                                                  />
                                                </div>
                                                <Label
                                                  htmlFor={`item-image-${item.id}`}
                                                  className="cursor-pointer flex items-center justify-center text-xs text-primary hover:underline mt-1"
                                                >
                                                  <Upload className="h-3 w-3 mr-1" />
                                                  Change Image
                                                </Label>
                                                <input
                                                  id={`item-image-${item.id}`}
                                                  type="file"
                                                  accept="image/*"
                                                  className="hidden"
                                                  onChange={(e) => handleItemImageUpload(e, section.id, item.id)}
                                                />
                                              </div>
                                            </div>
                                          )}
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Footer Settings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Show Copyright</Label>
                      <Switch
                        checked={template.footer.showCopyright}
                        onCheckedChange={(checked) => handleFooterChange("showCopyright", checked)}
                      />
                    </div>

                    {template.footer.showCopyright && (
                      <div className="space-y-1">
                        <Label htmlFor="footer-copyright" className="text-xs">
                          Copyright Text
                        </Label>
                        <Input
                          id="footer-copyright"
                          value={template.footer.copyrightText}
                          onChange={(e) => handleFooterChange("copyrightText", e.target.value)}
                          className="h-7 text-sm"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Show Navigation Links</Label>
                      <Switch
                        checked={template.footer.showNavLinks}
                        onCheckedChange={(checked) => handleFooterChange("showNavLinks", checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Show Social Links</Label>
                      <Switch
                        checked={template.footer.showSocialLinks}
                        onCheckedChange={(checked) => handleFooterChange("showSocialLinks", checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="footer-bg-color">Background Color</Label>
                    <Input
                      id="footer-bg-color"
                      type="color"
                      value={template.footer.backgroundColor}
                      onChange={(e) => handleFooterChange("backgroundColor", e.target.value)}
                      className="h-10 p-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="footer-text-color">Text Color</Label>
                    <Input
                      id="footer-text-color"
                      type="color"
                      value={template.footer.textColor}
                      onChange={(e) => handleFooterChange("textColor", e.target.value)}
                      className="h-10 p-1"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="styles" className="p-4 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Colors</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <Input
                        id="primary-color"
                        type="color"
                        value={template.colors.primary}
                        onChange={(e) => handleColorChange("primary", e.target.value)}
                        className="h-10 p-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondary-color">Secondary Color</Label>
                      <Input
                        id="secondary-color"
                        type="color"
                        value={template.colors.secondary}
                        onChange={(e) => handleColorChange("secondary", e.target.value)}
                        className="h-10 p-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accent-color">Accent Color</Label>
                      <Input
                        id="accent-color"
                        type="color"
                        value={template.colors.accent}
                        onChange={(e) => handleColorChange("accent", e.target.value)}
                        className="h-10 p-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="background-color">Background Color</Label>
                      <Input
                        id="background-color"
                        type="color"
                        value={template.colors.background}
                        onChange={(e) => handleColorChange("background", e.target.value)}
                        className="h-10 p-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="text-color">Text Color</Label>
                      <Input
                        id="text-color"
                        type="color"
                        value={template.colors.text}
                        onChange={(e) => handleColorChange("text", e.target.value)}
                        className="h-10 p-1"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Typography</h3>
                  <div className="space-y-2">
                    <Label htmlFor="heading-font">Heading Font</Label>
                    <Select
                      value={template.fonts.heading}
                      onValueChange={(value) => handleFontChange("heading", value)}
                    >
                      <SelectTrigger id="heading-font">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        {FONTS.map((font) => (
                          <SelectItem key={font} value={font}>
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="body-font">Body Font</Label>
                    <Select value={template.fonts.body} onValueChange={(value) => handleFontChange("body", value)}>
                      <SelectTrigger id="body-font">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        {FONTS.map((font) => (
                          <SelectItem key={font} value={font}>
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Spacing</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="section-padding">Section Padding</Label>
                      <span className="text-xs text-muted-foreground">{template.spacing.sectionPadding}px</span>
                    </div>
                    <Slider
                      id="section-padding"
                      min={20}
                      max={200}
                      step={10}
                      value={[template.spacing.sectionPadding]}
                      onValueChange={(value) => handleSpacingChange("sectionPadding", value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="content-width">Content Width</Label>
                      <span className="text-xs text-muted-foreground">{template.spacing.contentWidth}px</span>
                    </div>
                    <Slider
                      id="content-width"
                      min={800}
                      max={1600}
                      step={50}
                      value={[template.spacing.contentWidth]}
                      onValueChange={(value) => handleSpacingChange("contentWidth", value[0])}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Animations</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="page-transition">Page Transitions</Label>
                      <Switch
                        id="page-transition"
                        checked={template.animations.pageTransition}
                        onCheckedChange={(checked) => handleAnimationChange("pageTransition", checked)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="scroll-animation">Scroll Animations</Label>
                      <Switch
                        id="scroll-animation"
                        checked={template.animations.scrollAnimation}
                        onCheckedChange={(checked) => handleAnimationChange("scrollAnimation", checked)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hover-effects">Hover Effects</Label>
                      <Switch
                        id="hover-effects"
                        checked={template.animations.hoverEffects}
                        onCheckedChange={(checked) => handleAnimationChange("hoverEffects", checked)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Preview area */}
        <div className="flex-1 bg-muted/20 overflow-auto flex flex-col">
          <div className="sticky top-0 z-10 bg-background border-b p-2 flex justify-center items-center">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("desktop")}
                className="w-10 h-8"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "tablet" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("tablet")}
                className="w-10 h-8"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "mobile" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("mobile")}
                className="w-10 h-8"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 p-4 flex justify-center">
            <div
              ref={previewRef}
              className={cn(
                "bg-white border shadow-sm transition-all duration-300 h-full overflow-auto",
                viewMode === "desktop" ? "w-full" : viewMode === "tablet" ? "w-[768px]" : "w-[375px]",
              )}
              style={{
                fontFamily: template.fonts.body + ", sans-serif",
                color: template.colors.text,
              }}
            >
              {/* Header */}
              <header
                style={{
                  backgroundColor: template.colors.background,
                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    maxWidth: `${template.spacing.contentWidth}px`,
                    margin: "0 auto",
                    padding: "1rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {template.logo ? (
                      <img src={template.logo || "/placeholder.svg"} alt="Logo" style={{ height: "40px" }} />
                    ) : (
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.5rem",
                          fontFamily: template.fonts.heading + ", sans-serif",
                          color: template.colors.primary,
                        }}
                      >
                        {template.name}
                      </div>
                    )}
                  </div>

                  <nav>
                    <ul
                      style={{
                        display: "flex",
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        gap: "1.5rem",
                      }}
                    >
                      {template.navItems.map((item) => (
                        <li key={item.id}>
                          <a
                            href={item.link}
                            style={{
                              color: template.colors.text,
                              textDecoration: "none",
                              fontWeight: "500",
                              transition: "color 0.2s ease",
                            }}
                            onMouseOver={(e) => {
                              if (template.animations.hoverEffects) {
                                e.currentTarget.style.color = template.colors.primary
                              }
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.color = template.colors.text
                            }}
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {template.showAuth && (
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <button
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          color: template.colors.text,
                          cursor: "pointer",
                        }}
                      >
                        Login
                      </button>
                      <button
                        style={{
                          backgroundColor: template.colors.primary,
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "0.5rem 1rem",
                          cursor: "pointer",
                          transition: template.animations.hoverEffects ? "all 0.2s ease" : "none",
                        }}
                        onMouseOver={(e) => {
                          if (template.animations.hoverEffects) {
                            e.currentTarget.style.backgroundColor = template.colors.secondary
                            e.currentTarget.style.transform = "translateY(-2px)"
                          }
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = template.colors.primary
                          e.currentTarget.style.transform = "translateY(0)"
                        }}
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </header>

              {/* Hero Section */}
              <section
                style={{
                  minHeight: "60vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: `${template.spacing.sectionPadding}px 1rem`,
                  background: template.hero.backgroundImage
                    ? `url(${template.hero.backgroundImage}) no-repeat center center / cover`
                    : template.hero.backgroundColor || template.colors.background,
                  color: template.hero.textColor || template.colors.text,
                  position: "relative",
                }}
              >
                {template.hero.backgroundImage && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: `rgba(0, 0, 0, ${template.hero.overlayOpacity})`,
                    }}
                  ></div>
                )}

                <div
                  style={{
                    maxWidth: `${template.spacing.contentWidth}px`,
                    margin: "0 auto",
                    textAlign: template.hero.alignment,
                    position: "relative",
                    zIndex: 1,
                    width: "100%",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "clamp(2rem, 5vw, 3.5rem)",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                      fontFamily: template.fonts.heading + ", sans-serif",
                    }}
                  >
                    {template.hero.title}
                  </h1>
                  <p
                    style={{
                      fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                      marginBottom: "2rem",
                      maxWidth: "800px",
                      margin:
                        template.hero.alignment === "center"
                          ? "0 auto 2rem"
                          : template.hero.alignment === "right"
                            ? "0 0 2rem auto"
                            : "0 auto 2rem 0",
                    }}
                  >
                    {template.hero.subtitle}
                  </p>

                  {template.hero.showButton && (
                    <button
                      style={{
                        backgroundColor: template.colors.primary,
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "0.75rem 1.5rem",
                        fontSize: "1.1rem",
                        cursor: "pointer",
                        transition: template.animations.hoverEffects ? "all 0.3s ease" : "none",
                      }}
                      onMouseOver={(e) => {
                        if (template.animations.hoverEffects) {
                          e.currentTarget.style.backgroundColor = template.colors.secondary
                          e.currentTarget.style.transform = "translateY(-2px)"
                        }
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = template.colors.primary
                        e.currentTarget.style.transform = "translateY(0)"
                      }}
                    >
                      {template.hero.buttonText || "Get Started"}
                    </button>
                  )}
                </div>
              </section>

              {/* Content Sections */}
              {template.sections.map((section, index) => {
                // Determine background color - alternate between white and light gray for better visual separation
                const sectionBackground =
                  section.background || (index % 2 === 0 ? template.colors.background : "#f8f9fa")

                return (
                  <section
                    key={section.id}
                    id={section.id}
                    style={{
                      padding: `${template.spacing.sectionPadding}px 1rem`,
                      backgroundColor: sectionBackground,
                      color: section.textColor || template.colors.text,
                    }}
                  >
                    <div
                      style={{
                        maxWidth: `${template.spacing.contentWidth}px`,
                        margin: "0 auto",
                      }}
                    >
                      <h2
                        style={{
                          fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                          fontWeight: "bold",
                          marginBottom: "1.5rem",
                          fontFamily: template.fonts.heading + ", sans-serif",
                          textAlign: "center",
                        }}
                      >
                        {section.title}
                      </h2>

                      {section.subtitle && (
                        <p
                          style={{
                            fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                            marginBottom: "2rem",
                            textAlign: "center",
                          }}
                        >
                          {section.subtitle}
                        </p>
                      )}

                      <p
                        style={{
                          textAlign: "center",
                          marginBottom: "3rem",
                        }}
                      >
                        {section.content}
                      </p>

                      {/* Render section content based on type */}
                      {section.type === "features" && section.items && (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "2rem",
                          }}
                        >
                          {section.items.map((item) => (
                            <div
                              key={item.id}
                              style={{
                                padding: "1.5rem",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "white",
                                transition: template.animations.hoverEffects ? "all 0.3s ease" : "none",
                              }}
                            >
                              <div
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  borderRadius: "50%",
                                  backgroundColor: template.colors.primary,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginBottom: "1rem",
                                  margin: "0 auto 1rem",
                                  color: "white",
                                  fontSize: "1.5rem",
                                }}
                              >
                                {/* Display icon name as placeholder */}
                                {item.icon?.charAt(0) || "★"}
                              </div>
                              <h3
                                style={{
                                  fontSize: "1.25rem",
                                  fontWeight: "bold",
                                  marginBottom: "0.5rem",
                                  fontFamily: template.fonts.heading + ", sans-serif",
                                  textAlign: "center",
                                }}
                              >
                                {item.title}
                              </h3>
                              <p style={{ textAlign: "center" }}>{item.description}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.type === "gallery" && section.items && (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "2rem",
                          }}
                        >
                          {section.items.map((item) => (
                            <div
                              key={item.id}
                              style={{
                                borderRadius: "8px",
                                overflow: "hidden",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "white",
                                transition: template.animations.hoverEffects ? "all 0.3s ease" : "none",
                              }}
                            >
                              <div
                                style={{
                                  height: "200px",
                                  overflow: "hidden",
                                }}
                              >
                                <img
                                  src={item.image || "/placeholder.svg?height=200&width=400"}
                                  alt={item.title}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: template.animations.hoverEffects ? "transform 0.5s ease" : "none",
                                  }}
                                />
                              </div>
                              <div style={{ padding: "1.5rem" }}>
                                <h3
                                  style={{
                                    fontSize: "1.25rem",
                                    fontWeight: "bold",
                                    marginBottom: "0.5rem",
                                    fontFamily: template.fonts.heading + ", sans-serif",
                                  }}
                                >
                                  {item.title}
                                </h3>
                                <p>{item.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.type === "testimonials" && section.items && (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "2rem",
                          }}
                        >
                          {section.items.map((item) => (
                            <div
                              key={item.id}
                              style={{
                                padding: "2rem",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "white",
                                transition: template.animations.hoverEffects ? "all 0.3s ease" : "none",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: "1.5rem",
                                }}
                              >
                                {item.image && (
                                  <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.author}
                                    style={{
                                      width: "60px",
                                      height: "60px",
                                      borderRadius: "50%",
                                      objectFit: "cover",
                                      marginRight: "1rem",
                                    }}
                                  />
                                )}
                                <div>
                                  <h3
                                    style={{
                                      fontSize: "1.1rem",
                                      fontWeight: "bold",
                                      marginBottom: "0.25rem",
                                      fontFamily: template.fonts.heading + ", sans-serif",
                                    }}
                                  >
                                    {item.author}
                                  </h3>
                                  <p
                                    style={{
                                      fontSize: "0.9rem",
                                      color: "#666",
                                    }}
                                  >
                                    {item.company}
                                  </p>
                                </div>
                              </div>
                              <div
                                style={{
                                  fontSize: "3rem",
                                  color: template.colors.primary,
                                  marginBottom: "1rem",
                                  lineHeight: "1",
                                }}
                              >
                                "
                              </div>
                              <p
                                style={{
                                  fontSize: "1.1rem",
                                  fontStyle: "italic",
                                  marginBottom: "1.5rem",
                                }}
                              >
                                {item.quote}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.type === "contact" && section.contactInfo && (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "2rem",
                          }}
                        >
                          <div>
                            <h3
                              style={{
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                marginBottom: "1rem",
                                fontFamily: template.fonts.heading + ", sans-serif",
                              }}
                            >
                              Get in Touch
                            </h3>
                            <p style={{ marginBottom: "1.5rem" }}>
                              Have questions or want to learn more? Fill out the form or contact us directly.
                            </p>

                            <div style={{ marginBottom: "1rem" }}>
                              <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                                <span
                                  style={{
                                    marginRight: "0.5rem",
                                    color: template.colors.primary,
                                    fontSize: "1.2rem",
                                  }}
                                >
                                  ✉
                                </span>
                                <span>{section.contactInfo.email}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                                <span
                                  style={{
                                    marginRight: "0.5rem",
                                    color: template.colors.primary,
                                    fontSize: "1.2rem",
                                  }}
                                >
                                  ☎
                                </span>
                                <span>{section.contactInfo.phone}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                                <span
                                  style={{
                                    marginRight: "0.5rem",
                                    color: template.colors.primary,
                                    fontSize: "1.2rem",
                                  }}
                                >
                                  📍
                                </span>
                                <span>{section.contactInfo.address}</span>
                              </div>
                            </div>

                            {section.contactInfo.showSocialLinks && (
                              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                                <a
                                  href={section.contactInfo.socialLinks.facebook}
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    backgroundColor: template.colors.primary,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    textDecoration: "none",
                                  }}
                                >
                                  f
                                </a>
                                <a
                                  href={section.contactInfo.socialLinks.twitter}
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    backgroundColor: template.colors.primary,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    textDecoration: "none",
                                  }}
                                >
                                  t
                                </a>
                                <a
                                  href={section.contactInfo.socialLinks.instagram}
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    backgroundColor: template.colors.primary,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    textDecoration: "none",
                                  }}
                                >
                                  i
                                </a>
                                <a
                                  href={section.contactInfo.socialLinks.linkedin}
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    backgroundColor: template.colors.primary,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    textDecoration: "none",
                                  }}
                                >
                                  in
                                </a>
                              </div>
                            )}
                          </div>

                          <div>
                            <form
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                              }}
                            >
                              <div>
                                <label
                                  style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    fontWeight: "500",
                                  }}
                                >
                                  Name
                                </label>
                                <input
                                  type="text"
                                  style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    borderRadius: "4px",
                                    border: "1px solid #ddd",
                                  }}
                                />
                              </div>
                              <div>
                                <label
                                  style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    fontWeight: "500",
                                  }}
                                >
                                  Email
                                </label>
                                <input
                                  type="email"
                                  style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    borderRadius: "4px",
                                    border: "1px solid #ddd",
                                  }}
                                />
                              </div>
                              <div>
                                <label
                                  style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    fontWeight: "500",
                                  }}
                                >
                                  Message
                                </label>
                                <textarea
                                  rows={4}
                                  style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    borderRadius: "4px",
                                    border: "1px solid #ddd",
                                    resize: "vertical",
                                  }}
                                ></textarea>
                              </div>
                              <button
                                type="button"
                                style={{
                                  backgroundColor: template.colors.primary,
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  padding: "0.75rem 1.5rem",
                                  cursor: "pointer",
                                  transition: template.animations.hoverEffects ? "all 0.3s ease" : "none",
                                  alignSelf: "flex-start",
                                }}
                              >
                                Send Message
                              </button>
                            </form>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                )
              })}

              {/* Footer */}
              <footer
                style={{
                  backgroundColor: template.footer.backgroundColor,
                  color: template.footer.textColor,
                  padding: "3rem 1rem",
                }}
              >
                <div
                  style={{
                    maxWidth: `${template.spacing.contentWidth}px`,
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: viewMode === "mobile" ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: viewMode === "mobile" ? "center" : "flex-start",
                    gap: "2rem",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "400px",
                      textAlign: viewMode === "mobile" ? "center" : "left",
                    }}
                  >
                    {template.logo ? (
                      <img
                        src={template.logo || "/placeholder.svg"}
                        alt="Logo"
                        style={{
                          height: "40px",
                          marginBottom: "1rem",
                          filter: "brightness(0) invert(1)",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.5rem",
                          marginBottom: "1rem",
                          fontFamily: template.fonts.heading + ", sans-serif",
                        }}
                      >
                        {template.name}
                      </div>
                    )}
                    <p style={{ marginBottom: "1.5rem" }}>
                      Creating stunning websites with our AI-powered template editor. Customize every aspect of your
                      site with ease.
                    </p>
                  </div>

                  {template.footer.showNavLinks && (
                    <div>
                      <h3
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          marginBottom: "1rem",
                          fontFamily: template.fonts.heading + ", sans-serif",
                          textAlign: viewMode === "mobile" ? "center" : "left",
                        }}
                      >
                        Quick Links
                      </h3>
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                          textAlign: viewMode === "mobile" ? "center" : "left",
                        }}
                      >
                        {template.navItems.map((item) => (
                          <li key={item.id} style={{ marginBottom: "0.5rem" }}>
                            <a
                              href={item.link}
                              style={{
                                color: template.footer.textColor,
                                textDecoration: "none",
                                transition: "color 0.2s ease",
                              }}
                              onMouseOver={(e) => {
                                if (template.animations.hoverEffects) {
                                  e.currentTarget.style.color = template.colors.primary
                                }
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.color = template.footer.textColor
                              }}
                            >
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {template.footer.showSocialLinks && (
                    <div>
                      <h3
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          marginBottom: "1rem",
                          fontFamily: template.fonts.heading + ", sans-serif",
                          textAlign: viewMode === "mobile" ? "center" : "left",
                        }}
                      >
                        Connect With Us
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          justifyContent: viewMode === "mobile" ? "center" : "flex-start",
                        }}
                      >
                        <a
                          href="#"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(255,255,255,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: template.footer.textColor,
                            textDecoration: "none",
                            transition: template.animations.hoverEffects ? "all 0.3s ease" : "none",
                          }}
                        >
                          f
                        </a>
                        <a
                          href="#"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(255,255,255,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: template.footer.textColor,
                            textDecoration: "none",
                            transition: template.animations.hoverEffects ? "all 0.3s ease" : "none",
                          }}
                        >
                          t
                        </a>
                        <a
                          href="#"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(255,255,255,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: template.footer.textColor,
                            textDecoration: "none",
                            transition: template.animations.hoverEffects ? "all 0.3s ease" : "none",
                          }}
                        >
                          i
                        </a>
                        <a
                          href="#"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(255,255,255,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: template.footer.textColor,
                            textDecoration: "none",
                            transition: template.animations.hoverEffects ? "all 0.3s ease" : "none",
                          }}
                        >
                          in
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {template.footer.showCopyright && (
                  <div
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.1)",
                      marginTop: "2rem",
                      paddingTop: "2rem",
                      textAlign: "center",
                      maxWidth: `${template.spacing.contentWidth}px`,
                      margin: "2rem auto 0",
                    }}
                  >
                    <p>{template.footer.copyrightText}</p>
                  </div>
                )}
              </footer>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
            <DialogDescription>Preview how your template will look on different devices</DialogDescription>
          </DialogHeader>

          <div className="flex justify-center space-x-4 my-4">
            <Button variant={viewMode === "desktop" ? "default" : "outline"} onClick={() => setViewMode("desktop")}>
              <Monitor className="h-4 w-4 mr-2" />
              Desktop
            </Button>
            <Button variant={viewMode === "tablet" ? "default" : "outline"} onClick={() => setViewMode("tablet")}>
              <Tablet className="h-4 w-4 mr-2" />
              Tablet
            </Button>
            <Button variant={viewMode === "mobile" ? "default" : "outline"} onClick={() => setViewMode("mobile")}>
              <Smartphone className="h-4 w-4 mr-2" />
              Mobile
            </Button>
          </div>

          <div className="border rounded-lg overflow-auto h-[60vh] flex justify-center">
            <div
              className={cn(
                "bg-white transition-all duration-300 h-full overflow-auto",
                viewMode === "desktop" ? "w-full" : viewMode === "tablet" ? "w-[768px]" : "w-[375px]",
              )}
              style={{
                fontFamily: template.fonts.body + ", sans-serif",
                color: template.colors.text,
              }}
            >
              {/* Header */}
              <header
                style={{
                  backgroundColor: template.colors.background,
                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    maxWidth: `${template.spacing.contentWidth}px`,
                    margin: "0 auto",
                    padding: "1rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {template.logo ? (
                      <img src={template.logo || "/placeholder.svg"} alt="Logo" style={{ height: "40px" }} />
                    ) : (
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.5rem",
                          fontFamily: template.fonts.heading + ", sans-serif",
                          color: template.colors.primary,
                        }}
                      >
                        {template.name}
                      </div>
                    )}
                  </div>

                  <nav>
                    <ul
                      style={{
                        display: "flex",
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        gap: "1.5rem",
                      }}
                    >
                      {template.navItems.map((item) => (
                        <li key={item.id}>
                          <a
                            href={item.link}
                            style={{
                              color: template.colors.text,
                              textDecoration: "none",
                              fontWeight: "500",
                              transition: "color 0.2s ease",
                            }}
                            onMouseOver={(e) => {
                              if (template.animations.hoverEffects) {
                                e.currentTarget.style.color = template.colors.primary
                              }
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.color = template.colors.text
                            }}
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {template.showAuth && (
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <button
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          color: template.colors.text,
                          cursor: "pointer",
                        }}
                      >
                        Login
                      </button>
                      <button
                        style={{
                          backgroundColor: template.colors.primary,
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "0.5rem 1rem",
                          cursor: "pointer",
                        }}
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </header>

              {/* Hero Section */}
              <section
                style={{
                  minHeight: "60vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: `${template.spacing.sectionPadding}px 1rem`,
                  background: template.hero.backgroundImage
                    ? `url(${template.hero.backgroundImage}) no-repeat center center / cover`
                    : template.hero.backgroundColor || template.colors.background,
                  color: template.hero.textColor || template.colors.text,
                  position: "relative",
                }}
              >
                {template.hero.backgroundImage && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: `rgba(0, 0, 0, ${template.hero.overlayOpacity})`,
                    }}
                  ></div>
                )}

                <div
                  style={{
                    maxWidth: `${template.spacing.contentWidth}px`,
                    margin: "0 auto",
                    textAlign: template.hero.alignment,
                    position: "relative",
                    zIndex: 1,
                    width: "100%",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "clamp(2rem, 5vw, 3.5rem)",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                      fontFamily: template.fonts.heading + ", sans-serif",
                    }}
                  >
                    {template.hero.title}
                  </h1>
                  <p
                    style={{
                      fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                      marginBottom: "2rem",
                      maxWidth: "800px",
                      margin:
                        template.hero.alignment === "center"
                          ? "0 auto 2rem"
                          : template.hero.alignment === "right"
                            ? "0 0 2rem auto"
                            : "0 auto 2rem 0",
                    }}
                  >
                    {template.hero.subtitle}
                  </p>

                  {template.hero.showButton && (
                    <button
                      style={{
                        backgroundColor: template.colors.primary,
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "0.75rem 1.5rem",
                        fontSize: "1.1rem",
                        cursor: "pointer",
                      }}
                    >
                      {template.hero.buttonText || "Get Started"}
                    </button>
                  )}
                </div>
              </section>

              {/* Display a few sample sections */}
              <section
                style={{
                  padding: `${template.spacing.sectionPadding}px 1rem`,
                  backgroundColor: template.colors.background,
                }}
              >
                <div
                  style={{
                    maxWidth: `${template.spacing.contentWidth}px`,
                    margin: "0 auto",
                    textAlign: "center",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                      fontFamily: template.fonts.heading + ", sans-serif",
                    }}
                  >
                    Full Preview
                  </h2>
                  <p>This preview shows how your template will look with all your customizations applied.</p>
                </div>
              </section>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExport} onOpenChange={setShowExport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Template</DialogTitle>
            <DialogDescription>Choose a format to export your template</DialogDescription>
          </DialogHeader>

          <div className="flex space-x-4 my-4">
            <Button
              variant={exportFormat === "react" ? "default" : "outline"}
              onClick={() => setExportFormat("react")}
              className="flex-1"
            >
              <Code className="h-4 w-4 mr-2" />
              React Code
            </Button>
            <Button
              variant={exportFormat === "png" ? "default" : "outline"}
              onClick={() => setExportFormat("png")}
              className="flex-1"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              PNG Image
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExport(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

