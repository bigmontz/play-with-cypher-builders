import { Driver } from "neo4j-driver";
import Cypher from "@neo4j/cypher-builder";
import { MovieCastProvider } from "./providers";
import { CastElement } from "./entity";
import { Neo4jDriver } from "./infrastructure/driver";
import { Database } from "./database";

export namespace Neo4jCypherBuilderRepository {
  const cast = new Cypher.Pattern(Database.PersonNode)
    .related(Database.GenericRel)
    .to(Database.MovieNode)

  export function newMovieCastProvider(driver: Driver): MovieCastProvider {
    return async function (movieName: string): Promise<CastElement[]> {
      const { cypher, params } = new Cypher.Match(cast)
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
        .build()

      return driver.executeQuery(cypher, params, Neo4jDriver.queryConfig())
    }

  }
}
