"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Edit, Trash2, Phone, Calendar, FileText, History } from "lucide-react"
import type { Patient } from "@/app/page"

interface PatientListProps {
  patients: Patient[]
  onEdit: (patient: Patient) => void
  onDelete: (id: string) => void
  onViewHistory: (patientId: string) => void
}

export function PatientList({ patients, onEdit, onDelete, onViewHistory }: PatientListProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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

  const getLatestNote = (patient: Patient) => {
    if (patient.notes.length === 0) return "Sin notas"
    const sortedNotes = [...patient.notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return sortedNotes[0].content
  }

  const getMoodColor = (patient: Patient) => {
    if (patient.notes.length === 0) return "bg-gray-500"
    const sortedNotes = [...patient.notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const latestMood = sortedNotes[0].mood

    switch (latestMood) {
      case "excellent":
        return "bg-green-500"
      case "good":
        return "bg-blue-500"
      case "neutral":
        return "bg-yellow-500"
      case "concerning":
        return "bg-orange-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No hay pacientes</h3>
        <p className="text-muted-foreground">Comienza agregando tu primer paciente al sistema.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Mobile View */}
      <div className="block md:hidden space-y-4">
        {patients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(patient.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getMoodColor(patient)}`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-foreground truncate">{patient.name}</h3>
                    <Badge variant="secondary" className="ml-2">
                      {calculateAge(patient.birthDate)} años
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(patient.birthDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 mt-0.5" />
                      <span className="line-clamp-2">{getLatestNote(patient)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      <span>
                        {patient.notes.length} nota{patient.notes.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => onViewHistory(patient.id)} className="flex-1">
                      <History className="h-4 w-4 mr-2" />
                      Historial
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onEdit(patient)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(patient.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-foreground">Paciente</th>
                  <th className="text-left p-4 font-medium text-foreground">Fecha de Nacimiento</th>
                  <th className="text-left p-4 font-medium text-foreground">Teléfono</th>
                  <th className="text-left p-4 font-medium text-foreground">Última Nota</th>
                  <th className="text-left p-4 font-medium text-foreground">Notas</th>
                  <th className="text-right p-4 font-medium text-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                              {getInitials(patient.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getMoodColor(patient)}`}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{patient.name}</div>
                          <div className="text-sm text-muted-foreground">{calculateAge(patient.birthDate)} años</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{formatDate(patient.birthDate)}</td>
                    <td className="p-4 text-muted-foreground">{patient.phone}</td>
                    <td className="p-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-muted-foreground line-clamp-2">{getLatestNote(patient)}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">
                        {patient.notes.length} nota{patient.notes.length !== 1 ? "s" : ""}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => onViewHistory(patient.id)}>
                          <History className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onEdit(patient)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete(patient.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
