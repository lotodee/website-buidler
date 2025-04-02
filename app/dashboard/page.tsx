"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Settings, Trash2, Edit, Eye, MoreHorizontal, Grid, List } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function Dashboard() {
  const router = useRouter()

  // Mock data for websites
  const websites = [
    {
      id: 1,
      name: "Marketing Landing Page",
      status: "Published",
      lastEdited: "2 days ago",
      views: 245,
      template: "modern-business",
    },
    {
      id: 2,
      name: "Product Launch",
      status: "Draft",
      lastEdited: "5 hours ago",
      views: 0,
      template: "creative-portfolio",
    },
    {
      id: 3,
      name: "Newsletter Signup",
      status: "Published",
      lastEdited: "1 week ago",
      views: 189,
      template: "modern-business",
    },
    {
      id: 4,
      name: "Portfolio Site",
      status: "Draft",
      lastEdited: "3 days ago",
      views: 0,
      template: "creative-portfolio",
    },
  ]

  // Mock data for templates
  const templates = [
    {
      id: "modern-business",
      name: "Modern Business",
      description: "A clean, professional template for business websites",
      image:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "creative-portfolio",
      name: "Creative Portfolio",
      description: "A vibrant, creative template for portfolios",
      image:
        "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "e-commerce",
      name: "E-commerce",
      description: "A complete template for online stores",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
    },
  ]

  const [activeTab, setActiveTab] = useState("websites")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            
            <Image
              alt="digi-logo"
              src="/digi-logo.png"
              width={20}
              height={20}
            />
            {/* <Sparkles className="h-6 w-6 text-primary" /> */}
            <span className="font-bold text-xl">DigiZap</span>
          </Link>

          <Button onClick={() => router.push("/builder")}>
            <Plus className="mr-2 h-4 w-4" />
            New Website
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Websites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{websites.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {websites.reduce((sum, site) => sum + site.views, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +122 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Published Sites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {websites.filter((site) => site.status === "Published").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +1 from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-4">
            <Tabs
              defaultValue="websites"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {activeTab === "websites" ? "Your Websites" : "Templates"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === "websites"
                      ? "Manage and edit your websites"
                      : "Choose from our pre-built templates"}
                  </p>
                </div>

                <TabsList>
                  <TabsTrigger value="websites">Websites</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex items-center gap-2 mb-4 justify-end">
                <Tabs defaultValue="grid" className="w-auto">
                  <TabsList className="grid w-16 grid-cols-2">
                    <TabsTrigger value="grid">
                      <Grid className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="list">
                      <List className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              <TabsContent value="websites" className="m-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {websites.map((site) => (
                    <Card key={site.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted-foreground/10 relative">
                        <img
                          src={`https://images.unsplash.com/photo-${
                            1550000000000 + site.id * 1000
                          }-abcdefghijkl?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60`}
                          alt={site.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1481487196290-c152efe083f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60";
                          }}
                        />
                        <div className="absolute top-2 right-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/template-editor?template=${site.template}`
                                  )
                                }
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  window.alert(
                                    "Preview functionality would open the site in a new tab"
                                  )
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  window.alert(
                                    "Delete functionality would remove this site"
                                  )
                                }
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{site.name}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              site.status === "Published"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {site.status}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last edited: {site.lastEdited}
                        </div>
                        {site.status === "Published" && (
                          <div className="text-xs mt-1">{site.views} views</div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  <Card className="border-dashed flex items-center justify-center h-full min-h-[200px]">
                    <Button
                      variant="ghost"
                      className="flex flex-col h-full w-full p-6"
                      onClick={() => router.push("/builder")}
                    >
                      <Plus className="h-8 w-8 mb-2" />
                      <span>Create New Website</span>
                    </Button>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="templates" className="m-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted-foreground/10 relative">
                        <img
                          src={template.image || "/placeholder.svg"}
                          alt={template.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1481487196290-c152efe083f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button
                            variant="secondary"
                            onClick={() =>
                              router.push(
                                `/template-editor?template=${template.id}`
                              )
                            }
                          >
                            Preview
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1">{template.name}</h3>
                        <p className="text-xs text-muted-foreground mb-3">
                          {template.description}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() =>
                            router.push(
                              `/template-editor?template=${template.id}`
                            )
                          }
                        >
                          Use This Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

