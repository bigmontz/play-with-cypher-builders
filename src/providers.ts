import { CastElement, Person } from "./entity";

export interface MovieCastProvider {
  (movieName: string): Promise<CastElement[]>
}

export interface GetPersonByNameProvider {
  (personName: string): Promise<Person | undefined>
}
