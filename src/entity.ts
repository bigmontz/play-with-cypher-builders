export interface Movie {
  name: string
}

export interface Person {
  name: string
  born: number
}

export type Role = 'ACTED_IN' | 'DIRECTED' | 'PRODUCED' | 'WROTE'

export interface CastElement extends Person {
  role: Role
}
