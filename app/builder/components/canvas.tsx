"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { PlusCircle, Copy, Trash2, MoveUp, MoveDown, GripVertical } from "lucide-react"
import type { ElementType } from "../page"
import { toast } from "@/components/ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

interface CanvasProps {
  viewMode: "desktop" | "tablet" | "mobile"
  elements: ElementType[]
  selectedElementId: string | null
  onSelectElement: (id: string | null) => void
  onUpdateElement: (id: string, updates: Partial<ElementType>) => void
  onDeleteElement: (id: string) => void
  onDuplicateElement: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  dragOverElementId: string | null
  onDragStart: (element: ElementType) => void
  onDragOver: (id: string | null) => void
  onDrop: (id: string | null) => void
}

export default function Canvas({
  viewMode,
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onMoveUp,
  onMoveDown,
  dragOverElementId,
  onDragStart,
  onDragOver,
  onDrop,
}: CanvasProps) {
  const [resizing, setResizing] = useState(false)
  const [resizeStartX, setResizeStartX] = useState(0)
  const [resizeStartY, setResizeStartY] = useState(0)
  const [resizeStartWidth, setResizeStartWidth] = useState(0)
  const [resizeStartHeight, setResizeStartHeight] = useState(0)
  const [resizingElementId, setResizingElementId] = useState<string | null>(null)
  const elementRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Handle element selection
  const handleElementClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onSelectElement(id)
  }

  // Handle content editing
  const handleContentEdit = (id: string, content: string) => {
    onUpdateElement(id, { content })
  }

  // Handle element resize start
  const handleResizeStart = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    e.preventDefault()

    const element = elements.find((el) => el.id === id)
    if (!element) return

    setResizing(true)
    setResizingElementId(id)
    setResizeStartX(e.clientX)
    setResizeStartY(e.clientY)

    const elementRef = elementRefs.current[id]
    if (elementRef) {
      setResizeStartWidth(elementRef.offsetWidth)
      setResizeStartHeight(elementRef.offsetHeight)
    }

    document.addEventListener("mousemove", handleResizeMove)
    document.addEventListener("mouseup", handleResizeEnd)
  }

  // Handle element resize move
  const handleResizeMove = (e: MouseEvent) => {
    if (!resizing || !resizingElementId) return

    const element = elements.find((el) => el.id === resizingElementId)
    if (!element) return

    const deltaX = e.clientX - resizeStartX
    const deltaY = e.clientY - resizeStartY

    const newWidth = Math.max(50, resizeStartWidth + deltaX)
    const newHeight = Math.max(20, resizeStartHeight + deltaY)

    onUpdateElement(resizingElementId, {
      styles: {
        ...element.styles,
        width: `${newWidth}px`,
        height: element.type === "image" ? `${newHeight}px` : "auto",
      },
    })
  }

  // Handle element resize end
  const handleResizeEnd = () => {
    setResizing(false)
    setResizingElementId(null)

    document.removeEventListener("mousemove", handleResizeMove)
    document.removeEventListener("mouseup", handleResizeEnd)
  }

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleResizeMove)
      document.removeEventListener("mouseup", handleResizeEnd)
    }
  }, [])

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, element: ElementType) => {
    e.dataTransfer.setData("text/plain", element.id)
    onDragStart(element)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    onDragOver(id)
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    onDrop(id)
  }

  // Render element based on type
  const renderElement = (element: ElementType) => {
    const isSelected = selectedElementId === element.id
    const isDraggedOver = dragOverElementId === element.id

    const elementStyle = {
      ...element.styles,
      outline: isSelected ? "2px solid hsl(var(--primary))" : undefined,
      outlineOffset: isSelected ? "2px" : undefined,
      backgroundColor: isDraggedOver ? "rgba(var(--primary), 0.1)" : element.styles?.backgroundColor,
    }

    switch (element.type) {
      case "heading":
        return (
          <h2
            style={elementStyle}
            contentEditable={isSelected}
            suppressContentEditableWarning
            onBlur={(e) => handleContentEdit(element.id, e.currentTarget.textContent || "")}
          >
            {element.content}
          </h2>
        )
      case "text":
        return (
          <p
            style={elementStyle}
            contentEditable={isSelected}
            suppressContentEditableWarning
            onBlur={(e) => handleContentEdit(element.id, e.currentTarget.textContent || "")}
          >
            {element.content}
          </p>
        )
      case "button":
        return (
          <button
            style={elementStyle}
            onClick={(e) => {
              if (isSelected) {
                e.preventDefault()
              } else if (element.events?.click) {
                try {
                  // In a real implementation, this would be handled more safely
                  toast({
                    title: "Button clicked",
                    description: `Action: ${element.events.click}`,
                    duration: 2000,
                  })
                } catch (error) {
                  console.error("Error executing button action:", error)
                }
              }
            }}
          >
            <span
              contentEditable={isSelected}
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit(element.id, e.currentTarget.textContent || "")}
            >
              {element.content}
            </span>
          </button>
        )
      case "image":
        return (
          <div style={elementStyle} className="flex items-center justify-center">
            <span className="text-muted-foreground">Image Placeholder</span>
          </div>
        )
      case "section":
        return (
          <div style={elementStyle} className="p-4">
            <span className="text-muted-foreground">Section Container</span>
          </div>
        )
      case "columns":
        return (
          <div style={elementStyle} className="grid grid-cols-2 gap-4">
            <div className="border border-dashed p-4 rounded-md">
              <span className="text-muted-foreground">Column 1</span>
            </div>
            <div className="border border-dashed p-4 rounded-md">
              <span className="text-muted-foreground">Column 2</span>
            </div>
          </div>
        )
      case "form":
        return (
          <form
            style={elementStyle}
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (!isSelected) {
                toast({
                  title: "Form submitted",
                  description: "Form data would be processed here",
                  duration: 2000,
                })
              }
            }}
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your name"
                disabled={isSelected}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your email"
                disabled={isSelected}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Message</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={4}
                placeholder="Enter your message"
                disabled={isSelected}
              ></textarea>
            </div>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md" disabled={isSelected}>
              Submit
            </button>
          </form>
        )
      case "input":
        return (
          <input
            type={element.attributes?.type || "text"}
            placeholder={element.attributes?.placeholder || "Enter text"}
            style={elementStyle}
            className="p-2 border rounded-md"
            disabled={isSelected}
          />
        )
      case "textarea":
        return (
          <textarea
            placeholder={element.attributes?.placeholder || "Enter text"}
            style={elementStyle}
            className="p-2 border rounded-md"
            rows={4}
            disabled={isSelected}
          ></textarea>
        )
      default:
        return <div style={elementStyle}>{element.content}</div>
    }
  }

  return (
    <div className="p-8 h-full flex justify-center">
      <div
        className={`bg-background border rounded-md shadow-sm transition-all duration-300 ${
          viewMode === "desktop" ? "w-full max-w-6xl" : viewMode === "tablet" ? "w-[768px]" : "w-[375px]"
        }`}
        onClick={() => onSelectElement(null)}
      >
        {elements.length === 0 ? (
          <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center p-8">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <PlusCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Your canvas is empty</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Drag and drop elements from the left panel to start building your page, or use the AI assistant to
              generate content.
            </p>
          </div>
        ) : (
          <div className="p-4 min-h-[calc(100vh-200px)]">
            {elements.map((element) => (
              <div
                key={element.id}
                ref={(el) => (elementRefs.current[element.id] = el)}
                className={`relative p-2 my-2 border border-dashed rounded-md cursor-pointer transition-all ${
                  selectedElementId === element.id
                    ? "border-primary border-2"
                    : dragOverElementId === element.id
                      ? "border-primary/50 border-2"
                      : "border-transparent hover:border-primary/30"
                }`}
                onClick={(e) => handleElementClick(element.id, e)}
                draggable
                onDragStart={(e) => handleDragStart(e, element)}
                onDragOver={(e) => handleDragOver(e, element.id)}
                onDrop={(e) => handleDrop(e, element.id)}
              >
                {renderElement(element)}

                {/* Element controls when selected */}
                {selectedElementId === element.id && (
                  <>
                    <div className="absolute -top-4 right-0 flex space-x-1 bg-background border rounded-md shadow-sm p-1 z-10">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <GripVertical className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2">
                          <div className="space-y-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start"
                              onClick={(e) => {
                                e.stopPropagation()
                                onDuplicateElement(element.id)
                              }}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start"
                              onClick={(e) => {
                                e.stopPropagation()
                                onDeleteElement(element.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start"
                              onClick={(e) => {
                                e.stopPropagation()
                                onMoveUp(element.id)
                              }}
                            >
                              <MoveUp className="h-4 w-4 mr-2" />
                              Move Up
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start"
                              onClick={(e) => {
                                e.stopPropagation()
                                onMoveDown(element.id)
                              }}
                            >
                              <MoveDown className="h-4 w-4 mr-2" />
                              Move Down
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDuplicateElement(element.id)
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteElement(element.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Resize handle */}
                    <div
                      className="absolute bottom-0 right-0 w-4 h-4 bg-primary cursor-se-resize"
                      onMouseDown={(e) => handleResizeStart(e, element.id)}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

