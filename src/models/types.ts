export type Role = 'admin' | 'teacher'

export type Student = {
  id: string
  fullName: string
  phone: string
  email?: string
  hours: number
  balance: number
}

export type ClassSlot = {
  id: string
  name: string
  teacher: string
  day: string
  time: string
  room: string
  students: string[]
}

export type AttendanceMap = Record<string, Record<string, boolean>>
