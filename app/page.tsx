"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sidebar } from "@/components/sidebar"
import { PatientForm } from "@/components/patient-form"
import { PatientList } from "@/components/patient-list"
import { PatientHistory } from "@/components/patient-history"
import { Search, Plus, Users, Heart } from "lucide-react"

export interface PatientNote {
  id: string
  content: string
  date: string
  mood?: "excellent" | "good" | "neutral" | "concerning" | "critical"
}

export interface Patient {
  id: string
  name: string
  birthDate: string
  phone: string
  notes: PatientNote[]
  createdAt: string
}

export default function HomePage() {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      name: "María González",
      birthDate: "1985-03-15",
      phone: "+34 612 345 678",
      notes: [
        {
          id: "n1",
          content:
            "Primera sesión. Paciente presenta síntomas de ansiedad generalizada. Se muestra colaborativa y motivada para el tratamiento.",
          date: "2024-01-15",
          mood: "neutral",
        },
        {
          id: "n2",
          content:
            "Segunda sesión. Trabajamos técnicas de respiración. Paciente reporta mejora en episodios de ansiedad nocturna.",
          date: "2024-01-22",
          mood: "good",
        },
        {
          id: "n3",
          content:
            "Tercera sesión. Progreso notable en manejo de situaciones estresantes. Implementando técnicas cognitivo-conductuales.",
          date: "2024-01-29",
          mood: "good",
        },
      ],
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Carlos Rodríguez",
      birthDate: "1978-11-22",
      phone: "+34 698 765 432",
      notes: [
        {
          id: "n4",
          content: "Terapia de pareja. Primera sesión individual para evaluar dinámicas relacionales.",
          date: "2024-01-20",
          mood: "neutral",
        },
        {
          id: "n5",
          content: "Trabajando en comunicación asertiva. Paciente muestra resistencia inicial pero progreso gradual.",
          date: "2024-01-27",
          mood: "good",
        },
      ],
      createdAt: "2024-01-20",
    },
    {
      id: "3",
      name: "Ana Martín",
      birthDate: "1992-07-08",
      phone: "+34 655 123 789",
      notes: [
        {
          id: "n6",
          content: "Terapia cognitivo-conductual para depresión. Evaluación inicial completa.",
          date: "2024-02-01",
          mood: "concerning",
        },
        {
          id: "n7",
          content: "Mostrando mejoras significativas en estado de ánimo. Adherencia excelente al tratamiento.",
          date: "2024-02-08",
          mood: "excellent",
        },
      ],
      createdAt: "2024-02-01",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)

  const filteredPatients = patients.filter((patient) => patient.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAddPatient = (patientData: Omit<Patient, "id" | "createdAt" | "notes"> & { notes: string }) => {
    const newPatient: Patient = {
      ...patientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      notes: patientData.notes
        ? [
            {
              id: `n${Date.now()}`,
              content: patientData.notes,
              date: new Date().toISOString().split("T")[0],
              mood: "neutral",
            },
          ]
        : [],
    }
    setPatients([...patients, newPatient])
    setIsFormOpen(false)
  }

  const handleEditPatient = (patientData: Omit<Patient, "id" | "createdAt" | "notes"> & { notes: string }) => {
    if (editingPatient) {
      setPatients(
        patients.map((p) => {
          if (p.id === editingPatient.id) {
            const updatedNotes = patientData.notes.trim()
              ? [
                  ...p.notes,
                  {
                    id: `n${Date.now()}`,
                    content: patientData.notes,
                    date: new Date().toISOString().split("T")[0],
                    mood: "neutral" as const,
                  },
                ]
              : p.notes

            return {
              ...p,
              name: patientData.name,
              birthDate: patientData.birthDate,
              phone: patientData.phone,
              notes: updatedNotes,
            }
          }
          return p
        }),
      )
      setEditingPatient(null)
      setIsFormOpen(false)
    }
  }

  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter((p) => p.id !== id))
  }

  const handleAddNote = (patientId: string, noteContent: string, mood: PatientNote["mood"]) => {
    setPatients(
      patients.map((patient) => {
        if (patient.id === patientId) {
          const newNote: PatientNote = {
            id: `n${Date.now()}`,
            content: noteContent,
            date: new Date().toISOString().split("T")[0],
            mood,
          }
          return {
            ...patient,
            notes: [...patient.notes, newNote],
          }
        }
        return patient
      }),
    )
  }

  const openEditForm = (patient: Patient) => {
    setEditingPatient(patient)
    setIsFormOpen(true)
  }

  const openAddForm = () => {
    setEditingPatient(null)
    setIsFormOpen(true)
  }

  const openPatientHistory = (patientId: string) => {
    setSelectedPatientId(patientId)
  }

  const selectedPatient = selectedPatientId ? patients.find((p) => p.id === selectedPatientId) : null

  if (selectedPatient) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar onNavigateToPatients={() => setSelectedPatientId(null)} />
        <PatientHistory patient={selectedPatient} onBack={() => setSelectedPatientId(null)} onAddNote={handleAddNote} />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">Pacientes</h1>
            </div>
            <Button onClick={openAddForm} className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Paciente
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar pacientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{patients.length}</div>
                <p className="text-xs text-muted-foreground">Pacientes registrados</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nuevos este mes</CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">+20% respecto al mes anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activos</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{patients.length}</div>
                <p className="text-xs text-muted-foreground">En tratamiento activo</p>
              </CardContent>
            </Card>
          </div>

          {/* Patient List */}
          <PatientList
            patients={filteredPatients}
            onEdit={openEditForm}
            onDelete={handleDeletePatient}
            onViewHistory={openPatientHistory}
          />
        </div>
      </main>

      {/* Patient Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingPatient ? "Editar Paciente" : "Agregar Nuevo Paciente"}</DialogTitle>
          </DialogHeader>
          <PatientForm
            patient={editingPatient}
            onSubmit={editingPatient ? handleEditPatient : handleAddPatient}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
