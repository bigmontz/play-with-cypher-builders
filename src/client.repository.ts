import { Driver } from "neo4j-driver";
import Cypher from "@neo4j/cypher-builder";
import { MovieCastProvider } from "./providers";
import { CastElement } from "./entity";
import CypherClient from "./infrastructure/client";
import { Database } from "./database";

export namespace ClientRepository {
  const cast = new Cypher.Pattern(Database.PersonNode)
    .related(Database.GenericRel)
    .to(Database.MovieNode)

  export function newMovieCastProvider(driver: Driver): MovieCastProvider {
    const client = CypherClient.fromDriver({ driver, database: 'neo4j' })

    return async function (movieName: string): Promise<CastElement[]> {
      // can't dynamic type multiple relationships, so it needs to use
      // raw cypher
      const clause = new Cypher.Match(cast)
        .where(Database.MovieNode, { title: new Cypher.Param(movieName) })
        .and(Cypher.in(Database.typeOfRel(Database.GenericRel), new Cypher.Param([
          'ACTED_IN',
          'DIRECTED',
          'PRODUCED',
          'WROTE'
        ])))
        .return(
          [Database.PersonNode.property('name'), 'name'],
          [Database.PersonNode.property('born'), 'born'],
          [Database.typeOfRel(Database.GenericRel), 'role']
        )

      return client.executeClause(clause)
    }

  }
}
