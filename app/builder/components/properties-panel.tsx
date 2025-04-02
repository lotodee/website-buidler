"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Settings,
  Palette,
  Layers,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react"
import type { ElementType } from "../page"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface PropertiesPanelProps {
  selectedElementId: string | null
  elements: ElementType[]
  onUpdateElement: (id: string, updates: Partial<ElementType>) => void
}

export default function PropertiesPanel({ selectedElementId, elements, onUpdateElement }: PropertiesPanelProps) {
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(null)
  const [fontSize, setFontSize] = useState<number>(16)
  const [textColor, setTextColor] = useState<string>("#000000")
  const [bgColor, setBgColor] = useState<string>("#FFFFFF")
  const [padding, setPadding] = useState<number>(16)
  const [margin, setMargin] = useState<number>(16)
  const [borderRadius, setBorderRadius] = useState<number>(4)
  const [borderWidth, setBorderWidth] = useState<number>(0)
  const [borderColor, setBorderColor] = useState<string>("#e0e0e0")
  const [fontFamily, setFontFamily] = useState<string>("Inter")
  const [buttonAction, setButtonAction] = useState<string>("")
  const [linkUrl, setLinkUrl] = useState<string>("")
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null)

  // Update local state when selected element changes
  useEffect(() => {
    if (selectedElementId) {
      const element = elements.find((el) => el.id === selectedElementId) || null
      setSelectedElement(element)

      if (element?.styles) {
        // Extract values from styles
        setFontSize(Number.parseInt(element.styles.fontSize) || 16)
        setTextColor(element.styles.color || "#000000")
        setBgColor(element.styles.backgroundColor || "#FFFFFF")
        setPadding(Number.parseInt(element.styles.padding) || 16)
        setMargin(Number.parseInt(element.styles.marginBottom) || 16)
        setBorderRadius(Number.parseInt(element.styles.borderRadius) || 4)
        setBorderWidth(Number.parseInt(element.styles.borderWidth) || 0)
        setBorderColor(element.styles.borderColor || "#e0e0e0")
        setFontFamily(element.styles.fontFamily?.split(",")[0] || "Inter")
      }

      if (element?.type === "button" && element.events?.click) {
        setButtonAction(element.events.click)
      } else {
        setButtonAction("")
      }

      if (element?.attributes?.href) {
        setLinkUrl(element.attributes.href)
      } else {
        setLinkUrl("")
      }
    } else {
      setSelectedElement(null)
    }
  }, [selectedElementId, elements])

  // Update element styles
  const updateStyles = (styles: Record<string, any>) => {
    if (selectedElementId && selectedElement) {
      onUpdateElement(selectedElementId, {
        styles: {
          ...selectedElement.styles,
          ...styles,
        },
      })
    }
  }

  // Update element attributes
  const updateAttributes = (attributes: Record<string, any>) => {
    if (selectedElementId && selectedElement) {
      onUpdateElement(selectedElementId, {
        attributes: {
          ...selectedElement.attributes,
          ...attributes,
        },
      })
    }
  }

  // Update element events
  const updateEvents = (events: Record<string, string>) => {
    if (selectedElementId && selectedElement) {
      onUpdateElement(selectedElementId, {
        events: {
          ...selectedElement.events,
          ...events,
        },
      })
    }
  }

  // Handle font size change
  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0])
    updateStyles({ fontSize: `${value[0]}px` })
  }

  // Handle text color change
  const handleTextColorChange = (value: string) => {
    setTextColor(value)
    updateStyles({ color: value })
  }

  // Handle background color change
  const handleBgColorChange = (value: string) => {
    setBgColor(value)
    updateStyles({ backgroundColor: value })
  }

  // Handle padding change
  const handlePaddingChange = (value: number[]) => {
    setPadding(value[0])
    updateStyles({ padding: `${value[0]}px` })
  }

  // Handle margin change
  const handleMarginChange = (value: number[]) => {
    setMargin(value[0])
    updateStyles({ marginBottom: `${value[0]}px` })
  }

  // Handle border radius change
  const handleBorderRadiusChange = (value: number[]) => {
    setBorderRadius(value[0])
    updateStyles({ borderRadius: `${value[0]}px` })
  }

  // Handle border width change
  const handleBorderWidthChange = (value: number[]) => {
    setBorderWidth(value[0])
    updateStyles({
      borderWidth: `${value[0]}px`,
      borderStyle: value[0] > 0 ? "solid" : "none",
    })
  }

  // Handle border color change
  const handleBorderColorChange = (value: string) => {
    setBorderColor(value)
    updateStyles({ borderColor: value })
  }

  // Handle text alignment
  const handleTextAlign = (align: "left" | "center" | "right" | "justify") => {
    updateStyles({ textAlign: align })
  }

  // Handle font style
  const handleFontStyle = (style: "bold" | "italic" | "underline") => {
    if (style === "bold") {
      updateStyles({ fontWeight: selectedElement?.styles?.fontWeight === "bold" ? "normal" : "bold" })
    } else if (style === "italic") {
      updateStyles({ fontStyle: selectedElement?.styles?.fontStyle === "italic" ? "normal" : "italic" })
    } else if (style === "underline") {
      updateStyles({ textDecoration: selectedElement?.styles?.textDecoration === "underline" ? "none" : "underline" })
    }
  }

  // Handle font family change
  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value)
    updateStyles({ fontFamily: `${value}, sans-serif` })
  }

  // Handle button action change
  const handleButtonActionChange = (value: string) => {
    setButtonAction(value)
    updateEvents({ click: value })
  }

  // Handle link URL change
  const handleLinkUrlChange = (value: string) => {
    setLinkUrl(value)
    updateAttributes({ href: value })
  }

  // Color picker component
  const ColorPicker = ({
    color,
    onChange,
    onClose,
  }: { color: string; onChange: (color: string) => void; onClose: () => void }) => {
    const [selectedColor, setSelectedColor] = useState(color)

    const colors = [
      "#000000",
      "#FFFFFF",
      "#F44336",
      "#E91E63",
      "#9C27B0",
      "#673AB7",
      "#3F51B5",
      "#2196F3",
      "#03A9F4",
      "#00BCD4",
      "#009688",
      "#4CAF50",
      "#8BC34A",
      "#CDDC39",
      "#FFEB3B",
      "#FFC107",
      "#FF9800",
      "#FF5722",
      "#795548",
      "#9E9E9E",
    ]

    return (
      <div className="p-2">
        <div className="grid grid-cols-5 gap-2 mb-2">
          {colors.map((c) => (
            <div
              key={c}
              className={`w-6 h-6 rounded-full cursor-pointer ${c === selectedColor ? "ring-2 ring-primary" : ""}`}
              style={{ backgroundColor: c }}
              onClick={() => {
                setSelectedColor(c)
                onChange(c)
              }}
            />
          ))}
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Input
            type="text"
            value={selectedColor}
            onChange={(e) => {
              setSelectedColor(e.target.value)
              onChange(e.target.value)
            }}
          />
          <Button size="sm" onClick={onClose}>
            Apply
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium">Properties</h3>
        {selectedElement ? (
          <p className="text-xs text-muted-foreground">Editing: {selectedElement.type} element</p>
        ) : (
          <p className="text-xs text-muted-foreground">Select an element to edit its properties</p>
        )}
      </div>

      <Tabs defaultValue="style">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
          <TabsTrigger
            value="style"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            <Palette className="h-4 w-4 mr-2" />
            Style
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            <Layers className="h-4 w-4 mr-2" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="style" className="p-4 space-y-6">
            {!selectedElement ? (
              <div className="text-center py-8 text-muted-foreground">Select an element to edit its styles</div>
            ) : (
              <>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Typography</h4>

                  <div className="space-y-2">
                    <Label htmlFor="font-family">Font Family</Label>
                    <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
                      <SelectTrigger id="font-family">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                        <SelectItem value="Merriweather">Merriweather</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="font-size">Font Size</Label>
                      <span className="text-xs">{fontSize}px</span>
                    </div>
                    <Slider
                      id="font-size"
                      value={[fontSize]}
                      onValueChange={handleFontSizeChange}
                      max={72}
                      min={8}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Text Style</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant={selectedElement?.styles?.fontWeight === "bold" ? "default" : "outline"}
                        size="icon"
                        onClick={() => handleFontStyle("bold")}
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={selectedElement?.styles?.fontStyle === "italic" ? "default" : "outline"}
                        size="icon"
                        onClick={() => handleFontStyle("italic")}
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={selectedElement?.styles?.textDecoration === "underline" ? "default" : "outline"}
                        size="icon"
                        onClick={() => handleFontStyle("underline")}
                      >
                        <Underline className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Text Alignment</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant={selectedElement?.styles?.textAlign === "left" ? "default" : "outline"}
                        size="icon"
                        onClick={() => handleTextAlign("left")}
                      >
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={selectedElement?.styles?.textAlign === "center" ? "default" : "outline"}
                        size="icon"
                        onClick={() => handleTextAlign("center")}
                      >
                        <AlignCenter className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={selectedElement?.styles?.textAlign === "right" ? "default" : "outline"}
                        size="icon"
                        onClick={() => handleTextAlign("right")}
                      >
                        <AlignRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={selectedElement?.styles?.textAlign === "justify" ? "default" : "outline"}
                        size="icon"
                        onClick={() => handleTextAlign("justify")}
                      >
                        <AlignJustify className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Colors</h4>

                  <div className="space-y-2">
                    <Label htmlFor="text-color">Text Color</Label>
                    <div className="flex space-x-2">
                      <Popover
                        open={showColorPicker === "text"}
                        onOpenChange={(open) => setShowColorPicker(open ? "text" : null)}
                      >
                        <PopoverTrigger asChild>
                          <div
                            className="w-8 h-8 rounded-full border cursor-pointer"
                            style={{ backgroundColor: textColor }}
                          ></div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <ColorPicker
                            color={textColor}
                            onChange={handleTextColorChange}
                            onClose={() => setShowColorPicker(null)}
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        id="text-color"
                        value={textColor}
                        onChange={(e) => handleTextColorChange(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bg-color">Background Color</Label>
                    <div className="flex space-x-2">
                      <Popover
                        open={showColorPicker === "bg"}
                        onOpenChange={(open) => setShowColorPicker(open ? "bg" : null)}
                      >
                        <PopoverTrigger asChild>
                          <div
                            className="w-8 h-8 rounded-full border cursor-pointer"
                            style={{ backgroundColor: bgColor }}
                          ></div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <ColorPicker
                            color={bgColor}
                            onChange={handleBgColorChange}
                            onClose={() => setShowColorPicker(null)}
                          />
                        </PopoverContent>
                      </Popover>
                      <Input id="bg-color" value={bgColor} onChange={(e) => handleBgColorChange(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Border</h4>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="border-radius">Border Radius</Label>
                      <span className="text-xs">{borderRadius}px</span>
                    </div>
                    <Slider
                      id="border-radius"
                      value={[borderRadius]}
                      onValueChange={handleBorderRadiusChange}
                      max={50}
                      min={0}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="border-width">Border Width</Label>
                      <span className="text-xs">{borderWidth}px</span>
                    </div>
                    <Slider
                      id="border-width"
                      value={[borderWidth]}
                      onValueChange={handleBorderWidthChange}
                      max={10}
                      min={0}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="border-color">Border Color</Label>
                    <div className="flex space-x-2">
                      <Popover
                        open={showColorPicker === "border"}
                        onOpenChange={(open) => setShowColorPicker(open ? "border" : null)}
                      >
                        <PopoverTrigger asChild>
                          <div
                            className="w-8 h-8 rounded-full border cursor-pointer"
                            style={{ backgroundColor: borderColor }}
                          ></div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <ColorPicker
                            color={borderColor}
                            onChange={handleBorderColorChange}
                            onClose={() => setShowColorPicker(null)}
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        id="border-color"
                        value={borderColor}
                        onChange={(e) => handleBorderColorChange(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Spacing</h4>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="padding">Padding</Label>
                      <span className="text-xs">{padding}px</span>
                    </div>
                    <Slider
                      id="padding"
                      value={[padding]}
                      onValueChange={handlePaddingChange}
                      max={100}
                      min={0}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="margin">Margin Bottom</Label>
                      <span className="text-xs">{margin}px</span>
                    </div>
                    <Slider
                      id="margin"
                      value={[margin]}
                      onValueChange={handleMarginChange}
                      max={100}
                      min={0}
                      step={1}
                    />
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="settings" className="p-4 space-y-6">
            {!selectedElement ? (
              <div className="text-center py-8 text-muted-foreground">Select an element to edit its settings</div>
            ) : (
              <>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Element Settings</h4>

                  <div className="space-y-2">
                    <Label htmlFor="element-id">Element ID</Label>
                    <Input id="element-id" value={selectedElement.id} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="element-class">CSS Classes</Label>
                    <Input
                      id="element-class"
                      placeholder="Enter CSS classes"
                      onChange={(e) => updateStyles({ className: e.target.value })}
                    />
                  </div>

                  {selectedElement.type === "button" && (
                    <div className="space-y-2">
                      <Label htmlFor="button-action">Button Action</Label>
                      <Textarea
                        id="button-action"
                        placeholder="Enter JavaScript code to run when button is clicked"
                        value={buttonAction}
                        onChange={(e) => handleButtonActionChange(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Example: alert('Button clicked!') or window.location.href = '/contact'
                      </p>
                    </div>
                  )}

                  {(selectedElement.type === "button" || selectedElement.type === "text") && (
                    <div className="space-y-2">
                      <Label htmlFor="link-url">Link URL</Label>
                      <Input
                        id="link-url"
                        placeholder="Enter URL"
                        value={linkUrl}
                        onChange={(e) => handleLinkUrlChange(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Visibility</h4>

                  <div className="space-y-2">
                    <Label>Device Visibility</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="desktop-visible"
                        defaultChecked
                        onChange={(e) => updateStyles({ hideOnDesktop: !e.target.checked })}
                      />
                      <Label htmlFor="desktop-visible" className="text-sm flex items-center">
                        <Monitor className="h-4 w-4 mr-1" />
                        Desktop
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="tablet-visible"
                        defaultChecked
                        onChange={(e) => updateStyles({ hideOnTablet: !e.target.checked })}
                      />
                      <Label htmlFor="tablet-visible" className="text-sm flex items-center">
                        <Tablet className="h-4 w-4 mr-1" />
                        Tablet
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="mobile-visible"
                        defaultChecked
                        onChange={(e) => updateStyles({ hideOnMobile: !e.target.checked })}
                      />
                      <Label htmlFor="mobile-visible" className="text-sm flex items-center">
                        <Smartphone className="h-4 w-4 mr-1" />
                        Mobile
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Interactions</h4>

                  <div className="space-y-2">
                    <Label>Hover Effect</Label>
                    <Select
                      defaultValue="none"
                      onValueChange={(value) => {
                        switch (value) {
                          case "scale":
                            updateStyles({
                              transition: "transform 0.3s ease",
                              ":hover": { transform: "scale(1.05)" },
                            })
                            break
                          case "shadow":
                            updateStyles({
                              transition: "box-shadow 0.3s ease",
                              ":hover": { boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" },
                            })
                            break
                          case "color":
                            updateStyles({
                              transition: "background-color 0.3s ease",
                              ":hover": { backgroundColor: "hsl(var(--primary))" },
                            })
                            break
                          default:
                            updateStyles({
                              transition: "none",
                              ":hover": {},
                            })
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select hover effect" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="scale">Scale</SelectItem>
                        <SelectItem value="shadow">Shadow</SelectItem>
                        <SelectItem value="color">Color Change</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Cursor</Label>
                    <Select
                      defaultValue={selectedElement?.styles?.cursor || "default"}
                      onValueChange={(value) => updateStyles({ cursor: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cursor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="pointer">Pointer</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="move">Move</SelectItem>
                        <SelectItem value="not-allowed">Not Allowed</SelectItem>
                        <SelectItem value="grab">Grab</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="p-4 space-y-6">
            {!selectedElement ? (
              <div className="text-center py-8 text-muted-foreground">
                Select an element to edit advanced properties
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Position</h4>

                  <div className="space-y-2">
                    <Label htmlFor="position-type">Position Type</Label>
                    <Select
                      defaultValue={selectedElement?.styles?.position || "static"}
                      onValueChange={(value) => updateStyles({ position: value })}
                    >
                      <SelectTrigger id="position-type">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="static">Static</SelectItem>
                        <SelectItem value="relative">Relative</SelectItem>
                        <SelectItem value="absolute">Absolute</SelectItem>
                        <SelectItem value="fixed">Fixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="position-top">Top</Label>
                      <Input
                        id="position-top"
                        placeholder="Auto"
                        defaultValue={selectedElement?.styles?.top || ""}
                        onChange={(e) => updateStyles({ top: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position-right">Right</Label>
                      <Input
                        id="position-right"
                        placeholder="Auto"
                        defaultValue={selectedElement?.styles?.right || ""}
                        onChange={(e) => updateStyles({ right: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position-bottom">Bottom</Label>
                      <Input
                        id="position-bottom"
                        placeholder="Auto"
                        defaultValue={selectedElement?.styles?.bottom || ""}
                        onChange={(e) => updateStyles({ bottom: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position-left">Left</Label>
                      <Input
                        id="position-left"
                        placeholder="Auto"
                        defaultValue={selectedElement?.styles?.left || ""}
                        onChange={(e) => updateStyles({ left: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Custom CSS</h4>

                  <div className="space-y-2">
                    <Label htmlFor="custom-css">CSS Code</Label>
                    <Textarea
                      id="custom-css"
                      className="font-mono text-sm"
                      placeholder=".my-class { property: value; }"
                      onChange={(e) => {
                        try {
                          // In a real implementation, this would parse and apply the CSS
                          toast({
                            title: "Custom CSS applied",
                            description: "Your custom CSS has been applied to the element",
                            duration: 2000,
                          })
                        } catch (error) {
                          toast({
                            title: "Error applying CSS",
                            description: "There was an error applying your custom CSS",
                            variant: "destructive",
                            duration: 3000,
                          })
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">JavaScript</h4>

                  <div className="space-y-2">
                    <Label htmlFor="custom-js">Event Handlers</Label>
                    <Textarea
                      id="custom-js"
                      className="font-mono text-sm"
                      placeholder="onClick: () => { alert('Clicked!') }"
                      onChange={(e) => {
                        try {
                          // In a real implementation, this would parse and apply the JS
                          toast({
                            title: "Event handlers applied",
                            description: "Your event handlers have been applied to the element",
                            duration: 2000,
                          })
                        } catch (error) {
                          toast({
                            title: "Error applying event handlers",
                            description: "There was an error applying your event handlers",
                            variant: "destructive",
                            duration: 3000,
                          })
                        }
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

