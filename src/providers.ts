import { CastElement } from "./entity";

export interface MovieCastProvider {
  (movieName: string): Promise<CastElement[]>
}
