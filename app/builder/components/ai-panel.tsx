"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, MessageSquare, ImageIcon, Send, Loader2, Plus, Code, Layout } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface AIResponse {
  type: string
  content: string
  canAddToCanvas?: boolean
}

interface AITemplateItem {
  id: number
  name: string
  description: string
  image: string
}

interface AIImageItem {
  id: number
  prompt: string
  image: string
}

interface AIPanelProps {
  onAddContent: (content: string) => void
}

export default function AIPanel({ onAddContent }: AIPanelProps) {
  const [prompt, setPrompt] = useState("")
  const [generating, setGenerating] = useState(false)
  const [aiResponses, setAiResponses] = useState<AIResponse[]>([
    {
      type: "text",
      content:
        "I can help you generate content, design elements, and even entire sections for your website. Just tell me what you need!",
    },
  ])

  const [templatePrompt, setTemplatePrompt] = useState("")
  const [generatingTemplate, setGeneratingTemplate] = useState(false)
  const [templates, setTemplates] = useState<AITemplateItem[]>([
    {
      id: 1,
      name: "Landing Page",
      description: "A modern landing page with hero, features, and CTA sections",
      image:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 2,
      name: "About Us",
      description: "Company profile with team section and mission statement",
      image:
        "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 3,
      name: "Product Page",
      description: "Showcase your product with details and pricing",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 4,
      name: "Contact Page",
      description: "Contact form with map and company information",
      image:
        "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    },
  ])

  const [imagePrompt, setImagePrompt] = useState("")
  const [imageSize, setImageSize] = useState("square")
  const [generatingImage, setGeneratingImage] = useState(false)
  const [images, setImages] = useState<AIImageItem[]>([
    {
      id: 1,
      prompt: "Modern office with plants",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: 2,
      prompt: "Abstract digital art",
      image: "https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    },
  ])

  const [codePrompt, setCodePrompt] = useState("")
  const [generatingCode, setGeneratingCode] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || generating) return

    // Add user message to the chat
    setAiResponses([...aiResponses, { type: "user", content: prompt }])

    // Simulate AI response
    setGenerating(true)
    setTimeout(() => {
      const aiContent = generateAIResponse(prompt)

      setAiResponses((prev) => [
        ...prev,
        {
          type: "text",
          content: aiContent,
          canAddToCanvas: true,
        },
      ])
      setPrompt("")
      setGenerating(false)
    }, 1500)
  }

  const generateAIResponse = (userPrompt: string): string => {
    // This is a mock function that would be replaced with actual AI API calls
    const responses = [
      `Here's a section for your website about ${userPrompt}:\n\n${userPrompt.charAt(0).toUpperCase() + userPrompt.slice(1)} is an essential part of modern business. Our approach combines cutting-edge technology with proven methodologies to deliver exceptional results.`,
      `I've created some content about ${userPrompt}:\n\nDiscover the power of ${userPrompt} with our innovative solutions. We help businesses transform their operations and achieve sustainable growth through strategic implementation.`,
      `Here's a compelling ${userPrompt} section for your site:\n\nUnlock the full potential of your business with our ${userPrompt} services. Our team of experts will guide you through every step of the process, ensuring optimal outcomes.`,
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleGenerateTemplate = () => {
    if (!templatePrompt.trim() || generatingTemplate) return

    setGeneratingTemplate(true)

    // Simulate template generation
    setTimeout(() => {
      const newTemplate = {
        id: templates.length + 1,
        name: `Custom ${templatePrompt.split(" ").slice(0, 3).join(" ")}`,
        description: templatePrompt,
        image: `https://images.unsplash.com/photo-${1550000000000 + Math.floor(Math.random() * 10000000)}-abcdefghijkl?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60`,
      }

      setTemplates([newTemplate, ...templates])
      setTemplatePrompt("")
      setGeneratingTemplate(false)

      toast({
        title: "Template generated",
        description: "Your custom template has been created",
        duration: 3000,
      })
    }, 2000)
  }

  const handleGenerateImage = () => {
    if (!imagePrompt.trim() || generatingImage) return

    setGeneratingImage(true)

    // Simulate image generation
    setTimeout(() => {
      const newImage = {
        id: images.length + 1,
        prompt: imagePrompt,
        image: `https://images.unsplash.com/photo-${1550000000000 + Math.floor(Math.random() * 10000000)}-abcdefghijkl?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60`,
      }

      setImages([newImage, ...images])
      setImagePrompt("")
      setGeneratingImage(false)

      toast({
        title: "Image generated",
        description: "Your AI image has been created",
        duration: 3000,
      })
    }, 3000)
  }

  const handleGenerateCode = () => {
    if (!codePrompt.trim() || generatingCode) return

    setGeneratingCode(true)

    // Simulate code generation
    setTimeout(() => {
      let code = ""

      if (codePrompt.toLowerCase().includes("button")) {
        code = `<button 
  class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
  onclick="alert('Button clicked!')"
>
  Click Me
</button>`
      } else if (codePrompt.toLowerCase().includes("form")) {
        code = `<form class="max-w-md mx-auto p-4 bg-white rounded shadow">
  <div class="mb-4">
    <label class="block text-gray-700 mb-2" for="name">Name</label>
    <input class="w-full px-3 py-2 border rounded" id="name" type="text" placeholder="Your name">
  </div>
  <div class="mb-4">
    <label class="block text-gray-700 mb-2" for="email">Email</label>
    <input class="w-full px-3 py-2 border rounded" id="email" type="email" placeholder="Your email">
  </div>
  <button class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600" type="submit">Submit</button>
</form>`
      } else if (codePrompt.toLowerCase().includes("gallery")) {
        code = `<div class="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
  <div class="bg-gray-200 aspect-square rounded overflow-hidden">
    <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72" alt="Image 1" class="w-full h-full object-cover">
  </div>
  <div class="bg-gray-200 aspect-square rounded overflow-hidden">
    <img src="https://images.unsplash.com/photo-1549490349-8643362247b5" alt="Image 2" class="w-full h-full object-cover">
  </div>
  <div class="bg-gray-200 aspect-square rounded overflow-hidden">
    <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d" alt="Image 3" class="w-full h-full object-cover">
  </div>
</div>`
      } else {
        code = `<!-- Generated HTML for "${codePrompt}" -->
<div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
  <h2 class="text-2xl font-bold mb-4">Generated Content</h2>
  <p class="text-gray-700 mb-4">
    This is a custom element based on your prompt: "${codePrompt}".
    You can edit this code or add it directly to your canvas.
  </p>
  <div class="flex justify-end">
    <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Learn More
    </button>
  </div>
</div>`
      }

      setGeneratedCode(code)
      setGeneratingCode(false)

      toast({
        title: "Code generated",
        description: "Your custom code has been generated",
        duration: 3000,
      })
    }, 2000)
  }

  const handleAddToCanvas = (content: string) => {
    onAddContent(content)
  }

  const handleUseTemplate = (template: AITemplateItem) => {
    // In a real implementation, this would add multiple elements to create a template
    onAddContent(`# ${template.name}\n\n${template.description}`)

    toast({
      title: "Template applied",
      description: `The ${template.name} template has been applied to your canvas`,
      duration: 3000,
    })
  }

  const handleUseImage = (image: AIImageItem) => {
    // In a real implementation, this would add an image element
    onAddContent(`![${image.prompt}](${image.image})`)

    toast({
      title: "Image added",
      description: "The AI-generated image has been added to your canvas",
      duration: 3000,
    })
  }

  const handleUseCode = () => {
    // In a real implementation, this would add a code element
    onAddContent(generatedCode)

    toast({
      title: "Code added",
      description: "The generated code has been added to your canvas",
      duration: 3000,
    })
  }

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="chat">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
          <TabsTrigger
            value="chat"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="templates"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            <Layout className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger
            value="images"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Images
          </TabsTrigger>
          <TabsTrigger
            value="code"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            <Code className="h-4 w-4 mr-2" />
            Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="p-0 mt-0 flex flex-col h-[calc(100vh-180px)]">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {aiResponses.map((message, index) => (
                <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {message.content}

                    {message.canAddToCanvas && (
                      <div className="mt-2 flex justify-end">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="text-xs"
                          onClick={() => handleAddToCanvas(message.content)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add to Canvas
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {generating && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-muted flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask AI to generate content..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={generating}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setPrompt("Generate a hero section")}>
                Hero section
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPrompt("Write a product description")}>
                Product description
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPrompt("Create a contact form")}>
                Contact form
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPrompt("Generate a testimonial")}>
                Testimonial
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="p-4 mt-0">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">AI-Generated Templates</h3>
            <p className="text-xs text-muted-foreground">Generate complete page templates with AI</p>

            <div className="space-y-2">
              <Label>What kind of page do you need?</Label>
              <Textarea
                value={templatePrompt}
                onChange={(e) => setTemplatePrompt(e.target.value)}
                placeholder="Describe the page you want to create (e.g., 'A landing page for a fitness app with testimonials and pricing')"
                rows={4}
              />
            </div>

            <Button
              className="w-full"
              onClick={handleGenerateTemplate}
              disabled={generatingTemplate || !templatePrompt.trim()}
            >
              {generatingTemplate ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Template
                </>
              )}
            </Button>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="border rounded-md p-2 hover:border-primary cursor-pointer transition-all"
                  onClick={() => handleUseTemplate(template)}
                >
                  <div className="aspect-video bg-muted mb-2 overflow-hidden">
                    <img
                      src={template.image || "/placeholder.svg"}
                      alt={template.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1481487196290-c152efe083f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                      }}
                    />
                  </div>
                  <p className="text-xs font-medium">{template.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{template.description}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="images" className="p-4 mt-0">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">AI Image Generation</h3>
            <p className="text-xs text-muted-foreground">Generate custom images for your website</p>

            <div className="space-y-2">
              <Label>Image Description</Label>
              <Textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe the image you want to generate (e.g., 'A professional looking office with modern furniture')"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Image Size</Label>
              <Select value={imageSize} onValueChange={setImageSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square (1:1)</SelectItem>
                  <SelectItem value="landscape">Landscape (16:9)</SelectItem>
                  <SelectItem value="portrait">Portrait (9:16)</SelectItem>
                  <SelectItem value="banner">Banner (3:1)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={handleGenerateImage} disabled={generatingImage || !imagePrompt.trim()}>
              {generatingImage ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Image
                </>
              )}
            </Button>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="border rounded-md p-2 hover:border-primary cursor-pointer transition-all"
                  onClick={() => handleUseImage(image)}
                >
                  <div
                    className={`${imageSize === "square" ? "aspect-square" : imageSize === "landscape" ? "aspect-video" : imageSize === "portrait" ? "aspect-[9/16]" : "aspect-[3/1]"} bg-muted overflow-hidden`}
                  >
                    <img
                      src={image.image || "/placeholder.svg"}
                      alt={image.prompt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1481487196290-c152efe083f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{image.prompt}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="code" className="p-4 mt-0">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">AI Code Generation</h3>
            <p className="text-xs text-muted-foreground">Generate custom HTML/CSS code for your website</p>

            <div className="space-y-2">
              <Label>Code Description</Label>
              <Textarea
                value={codePrompt}
                onChange={(e) => setCodePrompt(e.target.value)}
                placeholder="Describe the code you want to generate (e.g., 'A contact form with name, email, and message fields')"
                rows={4}
              />
            </div>

            <Button className="w-full" onClick={handleGenerateCode} disabled={generatingCode || !codePrompt.trim()}>
              {generatingCode ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Code className="h-4 w-4 mr-2" />
                  Generate Code
                </>
              )}
            </Button>

            {generatedCode && (
              <div className="mt-4 space-y-2">
                <Label>Generated Code</Label>
                <div className="relative">
                  <Textarea value={generatedCode} readOnly className="font-mono text-xs h-48" />
                  <Button className="absolute top-2 right-2" size="sm" onClick={handleUseCode}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add to Canvas
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper component
const Label = ({
  htmlFor,
  children,
  className = "",
}: { htmlFor?: string; children: React.ReactNode; className?: string }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium ${className}`}>
    {children}
  </label>
)

