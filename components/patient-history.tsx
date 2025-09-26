"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Plus, Calendar, TrendingUp, FileText, Smile, Meh, Frown, AlertCircle } from "lucide-react"
import type { Patient, PatientNote } from "@/app/page"

interface PatientHistoryProps {
  patient: Patient
  onBack: () => void
  onAddNote: (patientId: string, content: string, mood: PatientNote["mood"]) => void
}

export function PatientHistory({ patient, onBack, onAddNote }: PatientHistoryProps) {
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [newNoteContent, setNewNoteContent] = useState("")
  const [newNoteMood, setNewNoteMood] = useState<PatientNote["mood"]>("neutral")

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getMoodIcon = (mood: PatientNote["mood"]) => {
    switch (mood) {
      case "excellent":
        return <Smile className="h-4 w-4 text-green-600" />
      case "good":
        return <Smile className="h-4 w-4 text-blue-600" />
      case "neutral":
        return <Meh className="h-4 w-4 text-yellow-600" />
      case "concerning":
        return <Frown className="h-4 w-4 text-orange-600" />
      case "critical":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Meh className="h-4 w-4 text-gray-600" />
    }
  }

  const getMoodLabel = (mood: PatientNote["mood"]) => {
    switch (mood) {
      case "excellent":
        return "Excelente"
      case "good":
        return "Bueno"
      case "neutral":
        return "Neutral"
      case "concerning":
        return "Preocupante"
      case "critical":
        return "Crítico"
      default:
        return "Sin evaluar"
    }
  }

  const getMoodColor = (mood: PatientNote["mood"]) => {
    switch (mood) {
      case "excellent":
        return "bg-green-100 text-green-800 border-green-200"
      case "good":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "neutral":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "concerning":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const sortedNotes = [...patient.notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const getProgressTrend = () => {
    if (patient.notes.length < 2) return null

    const moodValues = {
      critical: 1,
      concerning: 2,
      neutral: 3,
      good: 4,
      excellent: 5,
    }

    const recentNotes = sortedNotes.slice(0, 3)
    const averageRecent =
      recentNotes.reduce((sum, note) => sum + moodValues[note.mood || "neutral"], 0) / recentNotes.length

    const olderNotes = sortedNotes.slice(3, 6)
    if (olderNotes.length === 0) return null

    const averageOlder =
      olderNotes.reduce((sum, note) => sum + moodValues[note.mood || "neutral"], 0) / olderNotes.length

    const trend = averageRecent - averageOlder

    if (trend > 0.5) return "improving"
    if (trend < -0.5) return "declining"
    return "stable"
  }

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      onAddNote(patient.id, newNoteContent.trim(), newNoteMood)
      setNewNoteContent("")
      setNewNoteMood("neutral")
      setIsAddingNote(false)
    }
  }

  const trend = getProgressTrend()

  return (
    <main className="flex-1 flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {getInitials(patient.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">{patient.name}</h1>
                <p className="text-sm text-muted-foreground">{calculateAge(patient.birthDate)} años</p>
              </div>
            </div>
          </div>
          <Button onClick={() => setIsAddingNote(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Nota
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Patient Summary */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Notas</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{patient.notes.length}</div>
                <p className="text-xs text-muted-foreground">Sesiones registradas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estado Actual</CardTitle>
                {sortedNotes.length > 0 && getMoodIcon(sortedNotes[0].mood)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sortedNotes.length > 0 ? getMoodLabel(sortedNotes[0].mood) : "Sin evaluar"}
                </div>
                <p className="text-xs text-muted-foreground">Última evaluación</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tendencia</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {trend === "improving" && "↗️ Mejorando"}
                  {trend === "stable" && "→ Estable"}
                  {trend === "declining" && "↘️ Requiere atención"}
                  {trend === null && "Sin datos"}
                </div>
                <p className="text-xs text-muted-foreground">Últimas 3 sesiones</p>
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Historial de Notas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sortedNotes.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Sin notas registradas</h3>
                  <p className="text-muted-foreground">Agrega la primera nota para comenzar el seguimiento.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedNotes.map((note, index) => (
                    <div key={note.id} className="relative">
                      {/* Timeline line */}
                      {index < sortedNotes.length - 1 && <div className="absolute left-6 top-12 w-0.5 h-6 bg-border" />}

                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            {getMoodIcon(note.mood)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-foreground">{formatDate(note.date)}</h4>
                            <Badge variant="outline" className={getMoodColor(note.mood)}>
                              {getMoodLabel(note.mood)}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{note.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Note Dialog */}
      <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nueva Nota - {patient.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Estado del paciente</label>
              <Select value={newNoteMood} onValueChange={(value: PatientNote["mood"]) => setNewNoteMood(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">
                    <div className="flex items-center gap-2">
                      <Smile className="h-4 w-4 text-green-600" />
                      Excelente
                    </div>
                  </SelectItem>
                  <SelectItem value="good">
                    <div className="flex items-center gap-2">
                      <Smile className="h-4 w-4 text-blue-600" />
                      Bueno
                    </div>
                  </SelectItem>
                  <SelectItem value="neutral">
                    <div className="flex items-center gap-2">
                      <Meh className="h-4 w-4 text-yellow-600" />
                      Neutral
                    </div>
                  </SelectItem>
                  <SelectItem value="concerning">
                    <div className="flex items-center gap-2">
                      <Frown className="h-4 w-4 text-orange-600" />
                      Preocupante
                    </div>
                  </SelectItem>
                  <SelectItem value="critical">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      Crítico
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Notas de la sesión</label>
              <Textarea
                placeholder="Describe los puntos clave de la sesión, progreso observado, técnicas utilizadas, tareas asignadas, etc."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddNote} disabled={!newNoteContent.trim()}>
                Guardar Nota
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
