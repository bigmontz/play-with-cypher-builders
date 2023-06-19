import { Driver, resultTransformers } from "neo4j-driver";
import { CastElement } from "./entity";
import { MovieCastProvider } from "./providers";
import { Query, node, relation } from "cypher-query-builder"
import { Neo4jDriver } from "./infrastructure/driver";

export namespace CypherQueryBuilderRepository {
  export function  newMovieCastProvider(driver: Driver): MovieCastProvider  {
    
    return async function (movieName: string): Promise<CastElement[]> {
      const { query, params } = new Query()
        .match([
          node('person', 'Person'),
          relation('out', 'relationship', [
            'ACTED_IN',
            'DIRECTED',
            'PRODUCED',
            'WROTE'
          ]),
          node('movie', 'Movie', { title: movieName })
        ])
        .return(['person.name as name', 'person.born as born', 'type(relationship) as role'])
        .buildQueryObject()

      return driver.executeQuery(query, params, Neo4jDriver.queryConfig())
    }
  }
}
