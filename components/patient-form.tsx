"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Patient } from "@/app/page"

interface PatientFormProps {
  patient?: Patient | null
  onSubmit: (data: Omit<Patient, "id" | "createdAt" | "notes"> & { notes: string }) => void
  onCancel: () => void
}

export function PatientForm({ patient, onSubmit, onCancel }: PatientFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    phone: "",
    notes: "",
  })

  useEffect(() => {
    if (patient) {
      const latestNote =
        patient.notes.length > 0
          ? patient.notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].content
          : ""

      setFormData({
        name: patient.name,
        birthDate: patient.birthDate,
        phone: patient.phone,
        notes: latestNote,
      })
    } else {
      setFormData({
        name: "",
        birthDate: "",
        phone: "",
        notes: "",
      })
    }
  }, [patient])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ingrese el nombre completo"
            required
          />
        </div>

        <div>
          <Label htmlFor="birthDate">Fecha de nacimiento</Label>
          <Input
            id="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleChange("birthDate", e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+34 612 345 678"
            required
          />
        </div>

        <div>
          <Label htmlFor="notes">{patient ? "Nota adicional (opcional)" : "Nota inicial (opcional)"}</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder={
              patient
                ? "Agregar una nueva nota sobre el paciente..."
                : "Notas iniciales sobre el paciente, motivo de consulta, observaciones..."
            }
            rows={4}
          />
          {patient && (
            <p className="text-xs text-muted-foreground mt-1">
              Para ver y gestionar todas las notas, usa el historial del paciente.
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{patient ? "Actualizar" : "Guardar"}</Button>
      </div>
    </form>
  )
}
