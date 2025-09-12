"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sparkles, Eye, Send, CheckCircle, Clock, X, Plus, Linkedin, Users, TrendingUp } from "lucide-react"

export function LinkedInPostsSection() {
  const [bulletPoints, setBulletPoints] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [generatedPost, setGeneratedPost] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [postStatus, setPostStatus] = useState<"draft" | "posting" | "posted" | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const generatePost = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedPost(`🎯 Just attended an incredible event! Here are my key takeaways:

${bulletPoints
  .split("\n")
  .map((point) => point.trim())
  .filter((point) => point)
  .map((point) => `• ${point}`)
  .join("\n")}

The networking opportunities and insights shared were truly valuable. Looking forward to implementing these learnings and connecting with fellow professionals who share similar interests.

#Networking #ProfessionalDevelopment #EventHighlights #Learning`)
      setIsGenerating(false)
    }, 2000)
  }

  const postToLinkedIn = () => {
    setPostStatus("posting")
    setTimeout(() => {
      setPostStatus("posted")
      setTimeout(() => setPostStatus(null), 3000)
    }, 1500)
  }

  const recentPosts = [
    {
      id: 1,
      title: "Tech Conference 2024 Highlights",
      date: "2 hours ago",
      engagement: { likes: 45, comments: 12, shares: 8 },
      status: "posted",
    },
    {
      id: 2,
      title: "AI Workshop Key Insights",
      date: "1 day ago",
      engagement: { likes: 78, comments: 23, shares: 15 },
      status: "posted",
    },
    {
      id: 3,
      title: "Startup Pitch Event Learnings",
      date: "3 days ago",
      engagement: { likes: 34, comments: 7, shares: 4 },
      status: "draft",
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">LinkedIn Event Posts</h1>
        <p className="text-muted-foreground">
          Transform your event experiences into engaging LinkedIn content with AI assistance.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Post Generator */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Event Post Generator</CardTitle>
                  <CardDescription>Create professional LinkedIn posts from your event notes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Highlights & Key Points</label>
                <Textarea
                  placeholder="Enter bullet points about the event you attended...&#10;• Key insight from speaker&#10;• Interesting networking connection&#10;• Main takeaway or learning"
                  value={bulletPoints}
                  onChange={(e) => setBulletPoints(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Event Images (Optional)</label>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Event image ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {images.length < 6 && (
                    <label className="flex h-20 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                      <div className="text-center">
                        <Plus className="h-4 w-4 mx-auto text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1">Add Image</span>
                      </div>
                      <Input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>

              <Button onClick={generatePost} disabled={!bulletPoints.trim() || isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Generating Post...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate LinkedIn Post
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Recent Posts</CardTitle>
                  <CardDescription>Your latest LinkedIn event posts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{post.title}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{post.date}</span>
                      {post.status === "posted" && (
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {post.engagement.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {post.engagement.comments}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge variant={post.status === "posted" ? "default" : "secondary"}>{post.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Post Preview & Actions */}
        <div className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Post Preview</CardTitle>
                  <CardDescription>Review your generated LinkedIn post</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedPost ? (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Linkedin className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Your Name</p>
                        <p className="text-xs text-muted-foreground">Professional Title • Now</p>
                      </div>
                    </div>

                    <div className="p-4 bg-background border rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm font-normal leading-relaxed">{generatedPost}</pre>
                    </div>

                    {images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {images.slice(0, 4).map((image, index) => (
                          <img
                            key={index}
                            src={image || "/placeholder.svg"}
                            alt={`Event image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <Eye className="mr-2 h-4 w-4" />
                        Edit Post
                      </Button>
                      <Button variant="outline">Save Draft</Button>
                    </div>

                    <Button
                      onClick={postToLinkedIn}
                      disabled={postStatus === "posting"}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {postStatus === "posting" ? (
                        <>
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                          Posting to LinkedIn...
                        </>
                      ) : postStatus === "posted" ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Posted Successfully!
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Post to LinkedIn
                        </>
                      )}
                    </Button>

                    {postStatus === "posted" && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Your post has been successfully published to LinkedIn!
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-2">No Post Generated Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add your event highlights and generate a professional LinkedIn post
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">LinkedIn Analytics</CardTitle>
              <CardDescription>Your recent post performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">157</div>
                  <div className="text-xs text-muted-foreground">Total Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">42</div>
                  <div className="text-xs text-muted-foreground">Comments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">27</div>
                  <div className="text-xs text-muted-foreground">Shares</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
