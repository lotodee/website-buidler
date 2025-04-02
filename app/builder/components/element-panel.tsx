"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Layout,
  Type,
  Image,
  Video,
  CreditCard,
  FormInput,
  Search,
  Columns,
  Rows,
  Square,
  Heading,
  AlignLeft,
  ImageIcon,
  Youtube,
  CreditCardIcon,
  ListIcon,
  Mail,
  LinkIcon,
  FileText,
  Table,
  Map,
  Calendar,
  Clock,
  Star,
  Share2,
  ShoppingCart,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { ElementType } from "../page"

interface ElementPanelProps {
  onSelectElement: (element: string) => ElementType
  onDragStart: (element: ElementType) => void
}

export default function ElementPanel({ onSelectElement, onDragStart }: ElementPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const elementCategories = [
    {
      name: "Layout",
      icon: <Layout className="h-4 w-4" />,
      elements: [
        { id: "section", name: "Section", icon: <Square className="h-4 w-4" /> },
        { id: "container", name: "Container", icon: <Square className="h-4 w-4" /> },
        { id: "columns", name: "Columns", icon: <Columns className="h-4 w-4" /> },
        { id: "rows", name: "Rows", icon: <Rows className="h-4 w-4" /> },
      ],
    },
    {
      name: "Basic",
      icon: <Type className="h-4 w-4" />,
      elements: [
        { id: "heading", name: "Heading", icon: <Heading className="h-4 w-4" /> },
        { id: "text", name: "Text", icon: <AlignLeft className="h-4 w-4" /> },
        { id: "image", name: "Image", icon: <ImageIcon className="h-4 w-4" /> },
        { id: "button", name: "Button", icon: <Square className="h-4 w-4" /> },
        { id: "list", name: "List", icon: <ListIcon className="h-4 w-4" /> },
        { id: "link", name: "Link", icon: <LinkIcon className="h-4 w-4" /> },
      ],
    },
    {
      name: "Media",
      icon: <Image className="h-4 w-4" />,
      elements: [
        { id: "gallery", name: "Gallery", icon: <Image className="h-4 w-4" /> },
        { id: "video", name: "Video", icon: <Video className="h-4 w-4" /> },
        { id: "youtube", name: "YouTube", icon: <Youtube className="h-4 w-4" /> },
        { id: "map", name: "Map", icon: <Map className="h-4 w-4" /> },
      ],
    },
    {
      name: "Forms",
      icon: <FormInput className="h-4 w-4" />,
      elements: [
        { id: "form", name: "Form", icon: <FormInput className="h-4 w-4" /> },
        { id: "input", name: "Input", icon: <FormInput className="h-4 w-4" /> },
        { id: "textarea", name: "Text Area", icon: <AlignLeft className="h-4 w-4" /> },
        { id: "checkbox", name: "Checkbox", icon: <Square className="h-4 w-4" /> },
        { id: "contact", name: "Contact Form", icon: <Mail className="h-4 w-4" /> },
      ],
    },
    {
      name: "Commerce",
      icon: <CreditCard className="h-4 w-4" />,
      elements: [
        { id: "product", name: "Product", icon: <CreditCardIcon className="h-4 w-4" /> },
        { id: "pricing", name: "Pricing", icon: <CreditCardIcon className="h-4 w-4" /> },
        { id: "cart", name: "Shopping Cart", icon: <ShoppingCart className="h-4 w-4" /> },
        { id: "checkout", name: "Checkout", icon: <CreditCard className="h-4 w-4" /> },
      ],
    },
    {
      name: "Interactive",
      icon: <Star className="h-4 w-4" />,
      elements: [
        { id: "tabs", name: "Tabs", icon: <FileText className="h-4 w-4" /> },
        { id: "accordion", name: "Accordion", icon: <Rows className="h-4 w-4" /> },
        { id: "carousel", name: "Carousel", icon: <Image className="h-4 w-4" /> },
        { id: "modal", name: "Modal", icon: <Square className="h-4 w-4" /> },
        { id: "rating", name: "Rating", icon: <Star className="h-4 w-4" /> },
        { id: "share", name: "Share", icon: <Share2 className="h-4 w-4" /> },
      ],
    },
    {
      name: "Data",
      icon: <Table className="h-4 w-4" />,
      elements: [
        { id: "table", name: "Table", icon: <Table className="h-4 w-4" /> },
        { id: "chart", name: "Chart", icon: <FileText className="h-4 w-4" /> },
        { id: "calendar", name: "Calendar", icon: <Calendar className="h-4 w-4" /> },
        { id: "timer", name: "Timer", icon: <Clock className="h-4 w-4" /> },
      ],
    },
  ]

  const filteredCategories =
    searchTerm.trim() === ""
      ? elementCategories
      : elementCategories
          .map((category) => ({
            ...category,
            elements: category.elements.filter((element) =>
              element.name.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
          }))
          .filter((category) => category.elements.length > 0)

  // Handle element drag start
  const handleElementDragStart = (e: React.DragEvent, elementId: string) => {
    // Create a temporary element to be used during drag
    const element = {
      id: `temp-${elementId}-${Date.now()}`,
      type: elementId,
      content: "",
      styles: {},
    }

    e.dataTransfer.setData("text/plain", JSON.stringify(element))
    onDragStart(element)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search elements..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {filteredCategories.map((category) => (
            <div key={category.name}>
              <h3 className="flex items-center text-sm font-medium mb-2">
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {category.elements.map((element) => (
                  <Button
                    key={element.id}
                    variant="outline"
                    size="sm"
                    className="h-auto py-2 px-3 justify-start hover:bg-primary/10 hover:text-primary"
                    onClick={() => {
                      const newElement = onSelectElement(element.id)
                      toast({
                        title: "Element added",
                        description: `${element.name} has been added to your canvas`,
                        duration: 2000,
                      })
                    }}
                    draggable
                    onDragStart={(e) => handleElementDragStart(e, element.id)}
                  >
                    {element.icon}
                    <span className="ml-2 text-xs">{element.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No elements found matching "{searchTerm}"</div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

