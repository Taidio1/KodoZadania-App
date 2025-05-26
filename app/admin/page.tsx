"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { challenges } from "@/lib/challenges"
import CodeEditor from "@/components/code-editor"

export default function AdminPage() {
  const [newChallenge, setNewChallenge] = useState({
    id: "",
    title: "",
    difficulty: "Easy" as const,
    description: "",
    hint: "",
    starterCode: "",
    solution: "",
    solutionKeywords: "",
  })

  const handleChange = (field: string, value: string) => {
    setNewChallenge((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to a database
    alert("Challenge saved! (This is a demo - no actual saving occurs)")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Existing Challenges</CardTitle>
              <CardDescription>{challenges.length} challenges available</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {challenges.map((challenge) => (
                  <li key={challenge.id} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                    <div className="font-medium">{challenge.title}</div>
                    <div className="text-sm text-gray-500">{challenge.difficulty}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Add New Challenge</CardTitle>
                <CardDescription>Create a new programming challenge</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">Challenge ID</Label>
                    <Input
                      id="id"
                      value={newChallenge.id}
                      onChange={(e) => handleChange("id", e.target.value)}
                      placeholder="unique-id"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={newChallenge.difficulty}
                      onValueChange={(value) => handleChange("difficulty", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newChallenge.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Challenge title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newChallenge.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Describe the challenge"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hint">Hint (Optional)</Label>
                  <Textarea
                    id="hint"
                    value={newChallenge.hint}
                    onChange={(e) => handleChange("hint", e.target.value)}
                    placeholder="Provide a hint"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="starterCode">Starter Code</Label>
                  <div className="h-[200px] border rounded-md">
                    <CodeEditor
                      value={newChallenge.starterCode}
                      onChange={(value) => handleChange("starterCode", value)}
                      language="python"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="solution">Solution</Label>
                  <div className="h-[200px] border rounded-md">
                    <CodeEditor
                      value={newChallenge.solution}
                      onChange={(value) => handleChange("solution", value)}
                      language="python"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="solutionKeywords">Solution Keywords</Label>
                  <Input
                    id="solutionKeywords"
                    value={newChallenge.solutionKeywords}
                    onChange={(e) => handleChange("solutionKeywords", e.target.value)}
                    placeholder="Key solution patterns to check for"
                  />
                  <p className="text-xs text-gray-500">
                    Enter keywords or patterns that should be present in a correct solution. In a real app, you would
                    define test cases instead.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Save Challenge
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
