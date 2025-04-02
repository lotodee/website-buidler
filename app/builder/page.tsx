"use client"

import { Input } from "@/components/ui/input"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Save,
  Settings,
  Undo,
  Redo,
  Smartphone,
  Tablet,
  Monitor,
  Sparkles,
  Code,
  Eye,
  Download,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Copy,
  Trash2,
  MoveUp,
  MoveDown,
} from "lucide-react"
import ElementPanel from "./components/element-panel"
import Canvas from "./components/canvas"
import PropertiesPanel from "./components/properties-panel"
import AIPanel from "./components/ai-panel"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"

export interface ElementType {
  id: string
  type: string
  content: string
  styles?: Record<string, any>
  children?: ElementType[]
  attributes?: Record<string, any>
  events?: Record<string, string>
}

export default function Builder() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [elements, setElements] = useState<ElementType[]>([])
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [history, setHistory] = useState<ElementType[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showCodeExport, setShowCodeExport] = useState(false)
  const [exportFormat, setExportFormat] = useState<"html" | "react">("html")
  const [showPreview, setShowPreview] = useState(false)
  const [draggedElement, setDraggedElement] = useState<ElementType | null>(null)
  const [dragOverElementId, setDragOverElementId] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [projectName, setProjectName] = useState("Untitled Project")
  const [autoSave, setAutoSave] = useState(true)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Initialize history with empty state
  useEffect(() => {
    if (history.length === 0) {
      setHistory([[]])
      setHistoryIndex(0)
    }
  }, [history.length])

  // Auto save every 30 seconds
  useEffect(() => {
    if (!autoSave) return

    const interval = setInterval(() => {
      if (elements.length > 0) {
        handleSave(true)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [autoSave, elements])

  // Add element to canvas
  const handleAddElement = useCallback(
    (elementType: string) => {
      const newElement = {
        id: `element-${Date.now()}`,
        type: elementType,
        content: getDefaultContent(elementType),
        styles: getDefaultStyles(elementType),
        attributes: getDefaultAttributes(elementType),
        events: elementType === "button" ? { click: "alert('Button clicked!')" } : {},
      }

      // Save current state to history
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push([...elements])

      setElements((prev) => [...prev, newElement])
      setSelectedElementId(newElement.id)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)

      return newElement
    },
    [elements, history, historyIndex],
  )

  // Update element properties
  const handleUpdateElement = useCallback(
    (id: string, updates: Partial<ElementType>) => {
      // Save current state to history
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push([...elements])

      setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)))
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    },
    [elements, history, historyIndex],
  )

  // Delete element
  const handleDeleteElement = useCallback(
    (id: string) => {
      // Save current state to history
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push([...elements])

      setElements((prev) => prev.filter((el) => el.id !== id))
      setSelectedElementId(null)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)

      toast({
        title: "Element deleted",
        description: "Element has been removed from the canvas",
        duration: 2000,
      })
    },
    [elements, history, historyIndex],
  )

  // Duplicate element
  const handleDuplicateElement = useCallback(
    (id: string) => {
      const elementToDuplicate = elements.find((el) => el.id === id)
      if (!elementToDuplicate) return

      const newElement = {
        ...elementToDuplicate,
        id: `element-${Date.now()}`,
        content: elementToDuplicate.content,
      }

      // Save current state to history
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push([...elements])

      setElements((prev) => [...prev, newElement])
      setSelectedElementId(newElement.id)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)

      toast({
        title: "Element duplicated",
        description: "Element has been duplicated",
        duration: 2000,
      })
    },
    [elements, history, historyIndex],
  )

  // Move element up in order
  const handleMoveUp = useCallback(
    (id: string) => {
      const index = elements.findIndex((el) => el.id === id)
      if (index <= 0) return

      // Save current state to history
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push([...elements])

      const newElements = [...elements]
      const temp = newElements[index]
      newElements[index] = newElements[index - 1]
      newElements[index - 1] = temp

      setElements(newElements)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    },
    [elements, history, historyIndex],
  )

  // Move element down in order
  const handleMoveDown = useCallback(
    (id: string) => {
      const index = elements.findIndex((el) => el.id === id)
      if (index === -1 || index >= elements.length - 1) return

      // Save current state to history
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push([...elements])

      const newElements = [...elements]
      const temp = newElements[index]
      newElements[index] = newElements[index + 1]
      newElements[index + 1] = temp

      setElements(newElements)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    },
    [elements, history, historyIndex],
  )

  // Handle undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setElements(history[historyIndex - 1])
      toast({
        title: "Undo successful",
        description: "Previous action has been undone",
        duration: 2000,
      })
    }
  }, [history, historyIndex])

  // Handle redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setElements(history[historyIndex + 1])
      toast({
        title: "Redo successful",
        description: "Action has been redone",
        duration: 2000,
      })
    }
  }, [history, historyIndex])

  // Handle save
  const handleSave = useCallback(
    (isAutoSave = false) => {
      // In a real app, this would save to a database
      if (!isAutoSave) {
        toast({
          title: "Project saved",
          description: "Your website has been saved successfully",
          duration: 3000,
        })
      } else {
        console.log("Auto-saved project:", projectName, elements)
      }

      // Save to localStorage for demo purposes
      localStorage.setItem(
        "buildai-project",
        JSON.stringify({
          name: projectName,
          elements: elements,
          lastSaved: new Date().toISOString(),
        }),
      )
    },
    [elements, projectName],
  )

  // Handle export
  const handleExport = useCallback(() => {
    setShowCodeExport(true)
  }, [])

  // Handle preview
  const handlePreview = useCallback(() => {
    setShowPreview(true)
  }, [])

  // Generate HTML code from elements
  const generateHTML = useCallback(() => {
    let html =
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>' +
      projectName +
      "</title>\n  <style>\n"

    // Add CSS
    elements.forEach((element) => {
      if (element.styles) {
        html += `  #${element.id} {\n`
        Object.entries(element.styles).forEach(([key, value]) => {
          // Convert camelCase to kebab-case
          const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase()
          html += `    ${cssKey}: ${value};\n`
        })
        html += "  }\n"
      }
    })

    html += "  </style>\n</head>\n<body>\n"

    // Add HTML elements
    elements.forEach((element) => {
      switch (element.type) {
        case "heading":
          html += `  <h2 id="${element.id}">${element.content}</h2>\n`
          break
        case "text":
          html += `  <p id="${element.id}">${element.content}</p>\n`
          break
        case "button":
          html += `  <button id="${element.id}" onclick="${element.events?.click || ""}">${element.content}</button>\n`
          break
        case "image":
          html += `  <div id="${element.id}" class="image-placeholder">Image Placeholder</div>\n`
          break
        case "section":
          html += `  <section id="${element.id}"><div class="container">Section Container</div></section>\n`
          break
        case "columns":
          html += `  <div id="${element.id}" class="columns">\n    <div class="column">Column 1</div>\n    <div class="column">Column 2</div>\n  </div>\n`
          break
        default:
          html += `  <div id="${element.id}">${element.content}</div>\n`
      }
    })

    html += "  <script>\n"
    // Add JavaScript for events
    elements.forEach((element) => {
      if (element.events && Object.keys(element.events).length > 0) {
        Object.entries(element.events).forEach(([event, handler]) => {
          html += `  document.getElementById('${element.id}').addEventListener('${event}', function() {\n    ${handler}\n  });\n`
        })
      }
    })
    html += "  </script>\n"
    html += "</body>\n</html>"

    return html
  }, [elements, projectName])

  // Generate React code from elements
  const generateReactCode = useCallback(() => {
    let reactCode = "import React from 'react';\n\n"
    reactCode += "export default function GeneratedPage() {\n"

    // Add event handlers
    const eventHandlers = new Set<string>()
    elements.forEach((element) => {
      if (element.events && Object.keys(element.events).length > 0) {
        Object.entries(element.events).forEach(([event, handler]) => {
          const handlerName = `handle${event.charAt(0).toUpperCase() + event.slice(1)}${element.id.replace("element-", "")}`
          eventHandlers.add(`  const ${handlerName} = () => {\n    ${handler}\n  };\n`)
        })
      }
    })

    // Add event handler functions
    eventHandlers.forEach((handler) => {
      reactCode += handler
    })

    // Add JSX
    reactCode += '\n  return (\n    <div className="container">\n'

    // Add elements
    elements.forEach((element) => {
      const styles = element.styles
        ? `style={{${Object.entries(element.styles)
            .map(([k, v]) => `${k}: "${v}"`)
            .join(", ")}}}`
        : ""

      switch (element.type) {
        case "heading":
          reactCode += `      <h2 id="${element.id}" ${styles}>${element.content}</h2>\n`
          break
        case "text":
          reactCode += `      <p id="${element.id}" ${styles}>${element.content}</p>\n`
          break
        case "button":
          const clickHandler = element.events?.click ? `onClick={() => ${element.events.click}}` : ""
          reactCode += `      <button id="${element.id}" ${styles} ${clickHandler}>${element.content}</button>\n`
          break
        case "image":
          reactCode += `      <div id="${element.id}" ${styles} className="image-placeholder">Image Placeholder</div>\n`
          break
        case "section":
          reactCode += `      <section id="${element.id}" ${styles}>\n        <div className="container">Section Container</div>\n      </section>\n`
          break
        case "columns":
          reactCode += `      <div id="${element.id}" ${styles} className="columns">\n        <div className="column">Column 1</div>\n        <div className="column">Column 2</div>\n      </div>\n`
          break
        default:
          reactCode += `      <div id="${element.id}" ${styles}>${element.content}</div>\n`
      }
    })

    reactCode += "    </div>\n  );\n}\n"

    return reactCode
  }, [elements])

  // Handle download of exported code
  const handleDownload = useCallback(() => {
    const code = exportFormat === "html" ? generateHTML() : generateReactCode()
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download =
      exportFormat === "html"
        ? `${projectName.replace(/\s+/g, "-").toLowerCase()}.html`
        : `${projectName.replace(/\s+/g, "-").toLowerCase()}.jsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Code downloaded",
      description: `Your ${exportFormat.toUpperCase()} code has been downloaded`,
      duration: 3000,
    })
  }, [exportFormat, generateHTML, generateReactCode, projectName])

  // Get default content for new elements
  function getDefaultContent(type: string): string {
    switch (type) {
      case "heading":
        return "Your Heading Here"
      case "text":
        return "This is a paragraph of text. Click to edit this text."
      case "button":
        return "Button"
      case "form":
        return "Contact Form"
      case "input":
        return "Input Field"
      case "textarea":
        return "Text Area"
      case "checkbox":
        return "Checkbox"
      case "list":
        return "List Item"
      default:
        return "New Element"
    }
  }

  // Get default styles for new elements
  function getDefaultStyles(type: string): Record<string, any> {
    switch (type) {
      case "heading":
        return {
          fontSize: "32px",
          fontWeight: "bold",
          color: "#000000",
          textAlign: "left",
          marginBottom: "16px",
          fontFamily: "Inter, sans-serif",
        }
      case "text":
        return {
          fontSize: "16px",
          color: "#333333",
          lineHeight: "1.5",
          marginBottom: "16px",
          fontFamily: "Inter, sans-serif",
        }
      case "button":
        return {
          backgroundColor: "hsl(var(--primary))",
          color: "white",
          padding: "8px 16px",
          borderRadius: "4px",
          fontWeight: "500",
          border: "none",
          cursor: "pointer",
          fontFamily: "Inter, sans-serif",
        }
      case "image":
        return {
          width: "100%",
          height: "auto",
          objectFit: "cover",
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
        }
      case "section":
        return {
          width: "100%",
          padding: "40px 0",
          backgroundColor: "#ffffff",
          borderRadius: "4px",
          border: "1px dashed #e0e0e0",
        }
      case "container":
        return {
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
        }
      case "columns":
        return {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          width: "100%",
        }
      case "form":
        return {
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
          maxWidth: "500px",
          padding: "20px",
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
        }
      case "input":
        return {
          width: "100%",
          padding: "8px 12px",
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
          fontSize: "16px",
        }
      case "textarea":
        return {
          width: "100%",
          padding: "8px 12px",
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
          fontSize: "16px",
          minHeight: "100px",
          resize: "vertical",
        }
      default:
        return {}
    }
  }

  // Get default attributes for new elements
  function getDefaultAttributes(type: string): Record<string, any> {
    switch (type) {
      case "input":
        return {
          type: "text",
          placeholder: "Enter text here",
          name: `input-${Date.now()}`,
        }
      case "textarea":
        return {
          placeholder: "Enter text here",
          name: `textarea-${Date.now()}`,
        }
      case "checkbox":
        return {
          checked: false,
          name: `checkbox-${Date.now()}`,
        }
      case "button":
        return {
          type: "button",
        }
      case "image":
        return {
          alt: "Image description",
          src: "/placeholder.svg",
        }
      default:
        return {}
    }
  }

  // Handle drag start
  const handleDragStart = (element: ElementType) => {
    setDraggedElement(element)
  }

  // Handle drag over
  const handleDragOver = (id: string | null) => {
    setDragOverElementId(id)
  }

  // Handle drop
  const handleDrop = (targetId: string | null) => {
    if (!draggedElement) return

    // If dropping on canvas (null targetId)
    if (targetId === null) {
      // If it's a new element from panel
      if (!elements.find((el) => el.id === draggedElement.id)) {
        const newElement = {
          ...draggedElement,
          id: `element-${Date.now()}`,
        }

        // Save current state to history
        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push([...elements])

        setElements((prev) => [...prev, newElement])
        setSelectedElementId(newElement.id)
        setHistory(newHistory)
        setHistoryIndex(newHistory.length - 1)
      }
    } else {
      // Reordering existing elements
      const sourceIndex = elements.findIndex((el) => el.id === draggedElement.id)
      const targetIndex = elements.findIndex((el) => el.id === targetId)

      if (sourceIndex !== -1 && targetIndex !== -1) {
        // Save current state to history
        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push([...elements])

        const newElements = [...elements]
        const [removed] = newElements.splice(sourceIndex, 1)
        newElements.splice(targetIndex, 0, removed)

        setElements(newElements)
        setHistory(newHistory)
        setHistoryIndex(newHistory.length - 1)
      }
    }

    setDraggedElement(null)
    setDragOverElementId(null)
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/"  className="flex items-center space-x-2">
              <Image
                alt="digi-logo"
                src="/digi-logo.png"
                width={20}
                height={20}
              />
              {/* <Sparkles className="h-6 w-6 text-primary" /> */}
              <span className="font-bold text-xl">DigiZap</span>
            </Link>

            <span className="text-sm text-muted-foreground">|</span>
            <span className="text-sm font-medium">{projectName}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
            >
              <Undo className="h-4 w-4 mr-1" />
              Undo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo className="h-4 w-4 mr-1" />
              Redo
            </Button>
            <div className="border-l h-6 mx-2" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("desktop")}
              className={viewMode === "desktop" ? "bg-accent/20" : ""}
            >
              <Monitor
                className={`h-5 w-5 ${
                  viewMode === "desktop" ? "text-primary" : ""
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("tablet")}
              className={viewMode === "tablet" ? "bg-accent/20" : ""}
            >
              <Tablet
                className={`h-5 w-5 ${
                  viewMode === "tablet" ? "text-primary" : ""
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("mobile")}
              className={viewMode === "mobile" ? "bg-accent/20" : ""}
            >
              <Smartphone
                className={`h-5 w-5 ${
                  viewMode === "mobile" ? "text-primary" : ""
                }`}
              />
            </Button>
            <div className="border-l h-6 mx-2" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button variant="ghost" size="sm" onClick={handleExport}>
              <Code className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button size="sm" onClick={() => handleSave()}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 border-r bg-muted/30 flex flex-col">
          <Tabs defaultValue="elements">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
              <TabsTrigger
                value="elements"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Elements
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                AI Assistant
              </TabsTrigger>
            </TabsList>
            <TabsContent value="elements" className="p-0 mt-0">
              <ElementPanel
                onSelectElement={handleAddElement}
                onDragStart={handleDragStart}
              />
            </TabsContent>
            <TabsContent value="ai" className="p-0 mt-0">
              <AIPanel
                onAddContent={(content) => {
                  // Add AI-generated content to canvas
                  const newElement = {
                    id: `element-${Date.now()}`,
                    type: "text",
                    content: content,
                    styles: getDefaultStyles("text"),
                  };

                  setElements((prev) => [...prev, newElement]);
                  setSelectedElementId(newElement.id);

                  // Save to history
                  const newHistory = history.slice(0, historyIndex + 1);
                  newHistory.push([...elements, newElement]);
                  setHistory(newHistory);
                  setHistoryIndex(newHistory.length - 1);

                  toast({
                    title: "Content added",
                    description:
                      "AI-generated content has been added to your canvas",
                    duration: 2000,
                  });
                }}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Canvas */}
        <div
          className="flex-1 bg-muted/50 overflow-auto"
          ref={canvasRef}
          onDragOver={(e) => {
            e.preventDefault();
            handleDragOver(null);
          }}
          onDrop={(e) => {
            e.preventDefault();
            handleDrop(null);
          }}
        >
          <Canvas
            viewMode={viewMode}
            elements={elements}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            onDuplicateElement={handleDuplicateElement}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            dragOverElementId={dragOverElementId}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        </div>

        {/* Right Sidebar */}
        <div className="w-72 border-l bg-muted/30">
          <PropertiesPanel
            selectedElementId={selectedElementId}
            elements={elements}
            onUpdateElement={handleUpdateElement}
          />
        </div>
      </main>

      {/* Code Export Dialog */}
      <Dialog open={showCodeExport} onOpenChange={setShowCodeExport}>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Export Code</DialogTitle>
            <DialogDescription>
              Export your website as HTML or React code
            </DialogDescription>
          </DialogHeader>

          <div className="flex space-x-4 my-4">
            <Button
              variant={exportFormat === "html" ? "default" : "outline"}
              onClick={() => setExportFormat("html")}
            >
              HTML/CSS/JS
            </Button>
            <Button
              variant={exportFormat === "react" ? "default" : "outline"}
              onClick={() => setExportFormat("react")}
            >
              React
            </Button>
          </div>

          <div className="flex-1 min-h-0 overflow-auto">
            <Textarea
              className="font-mono text-sm h-full min-h-[400px]"
              readOnly
              value={
                exportFormat === "html" ? generateHTML() : generateReactCode()
              }
            />
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowCodeExport(false)}>
              Cancel
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download {exportFormat.toUpperCase()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
            <DialogDescription>
              Preview how your website will look
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-auto border rounded-md p-4 bg-white">
            {elements.map((element) => {
              const elementStyle = element.styles || {};

              switch (element.type) {
                case "heading":
                  return (
                    <h2 key={element.id} style={elementStyle}>
                      {element.content}
                    </h2>
                  );
                case "text":
                  return (
                    <p key={element.id} style={elementStyle}>
                      {element.content}
                    </p>
                  );
                case "button":
                  return (
                    <button
                      key={element.id}
                      style={elementStyle}
                      onClick={() => {
                        if (element.events?.click) {
                          toast({
                            title: "Button clicked",
                            description: `Action: ${element.events.click}`,
                            duration: 2000,
                          });
                        }
                      }}
                    >
                      {element.content}
                    </button>
                  );
                case "image":
                  return (
                    <div
                      key={element.id}
                      style={elementStyle}
                      className="image-placeholder"
                    >
                      Image Placeholder
                    </div>
                  );
                case "section":
                  return (
                    <section key={element.id} style={elementStyle}>
                      <div className="container">Section Container</div>
                    </section>
                  );
                case "columns":
                  return (
                    <div
                      key={element.id}
                      style={elementStyle}
                      className="columns"
                    >
                      <div className="column">Column 1</div>
                      <div className="column">Column 2</div>
                    </div>
                  );
                default:
                  return (
                    <div key={element.id} style={elementStyle}>
                      {element.content}
                    </div>
                  );
              }
            })}

            {elements.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No elements added yet. Add elements to see a preview.
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={() => setShowPreview(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Project Settings</DialogTitle>
            <DialogDescription>
              Configure your project settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="auto-save"
                checked={autoSave}
                onCheckedChange={(checked) => setAutoSave(checked as boolean)}
              />
              <Label htmlFor="auto-save">
                Enable auto-save (every 30 seconds)
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Element Alignment Tools</Label>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedElementId) {
                      handleUpdateElement(selectedElementId, {
                        styles: {
                          ...elements.find((el) => el.id === selectedElementId)
                            ?.styles,
                          textAlign: "left",
                        },
                      });
                    }
                  }}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedElementId) {
                      handleUpdateElement(selectedElementId, {
                        styles: {
                          ...elements.find((el) => el.id === selectedElementId)
                            ?.styles,
                          textAlign: "center",
                        },
                      });
                    }
                  }}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedElementId) {
                      handleUpdateElement(selectedElementId, {
                        styles: {
                          ...elements.find((el) => el.id === selectedElementId)
                            ?.styles,
                          textAlign: "right",
                        },
                      });
                    }
                  }}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedElementId) {
                      handleUpdateElement(selectedElementId, {
                        styles: {
                          ...elements.find((el) => el.id === selectedElementId)
                            ?.styles,
                          textAlign: "justify",
                        },
                      });
                    }
                  }}
                >
                  <AlignJustify className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Element Actions</Label>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedElementId) {
                      handleDuplicateElement(selectedElementId);
                    }
                  }}
                  disabled={!selectedElementId}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Duplicate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedElementId) {
                      handleDeleteElement(selectedElementId);
                    }
                  }}
                  disabled={!selectedElementId}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Element Order</Label>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedElementId) {
                      handleMoveUp(selectedElementId);
                    }
                  }}
                  disabled={!selectedElementId}
                >
                  <MoveUp className="h-4 w-4 mr-1" />
                  Move Up
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedElementId) {
                      handleMoveDown(selectedElementId);
                    }
                  }}
                  disabled={!selectedElementId}
                >
                  <MoveDown className="h-4 w-4 mr-1" />
                  Move Down
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

