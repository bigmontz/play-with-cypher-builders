import { Driver, resultTransformers } from 'neo4j-driver'
import { MovieCastProvider } from './providers';
import { CastElement } from './entity';
import { Neo4jDriver } from './infrastructure/driver';


export namespace DriverRepository {
  export function newMovieCastProvider (driver: Driver): MovieCastProvider {
    return async function (movieName: string): Promise<CastElement[]> {
      return  await driver.executeQuery(
        "MATCH (p: Person)-[r]->(Movie { title: $title}) " +
        "WHERE type(r) IN $relationships " +
        "RETURN p.name as name, p.born as born, type(r) as role", 
        {
          title: movieName,
          relationships: [
            'ACTED_IN',
            'DIRECTED',
            'PRODUCED',
            'WROTE'
          ]
        }, 
        Neo4jDriver.queryConfig()
      )
    }
  }
}
