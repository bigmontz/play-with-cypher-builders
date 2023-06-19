import { Driver, QueryConfig, resultTransformers } from "neo4j-driver";
import Cypher, { Clause } from "@neo4j/cypher-builder";
import { MovieCastProvider } from "./providers";
import { CastElement } from "./entity";
import { Neo4jDriver } from "./infrastructure/driver";
import CypherClient from "./infrastructure/client";

export namespace ClientRepository {
  const movieNode = new Cypher.Node({
    labels: ['Movie']
  })

  const personNode = new Cypher.Node({
    labels: ['Person']
  })

  const castRel = new Cypher.Relationship({})

  const cast = new Cypher.Pattern(personNode)
    .related(castRel)
    .to(movieNode)

  export function newMovieCastProvider (driver: Driver): MovieCastProvider {
    const client = CypherClient.fromDriver({ driver, database: 'neo4j'})

    return async function (movieName: string): Promise<CastElement[]> {
      // can't dynamic type multiple relationships, so it needs to use
      // raw cypher
      const clause = new Cypher.Match(cast)
        .where(movieNode, { title: new Cypher.Param(movieName)})
          .and(Cypher.in(new Cypher.RawCypher(`type(this1)`), new Cypher.Param([
            'ACTED_IN',
            'DIRECTED',
            'PRODUCED',
            'WROTE'
          ])))
        .return([personNode.property('name'), 'name'], [personNode.property('born'), 'born'], new Cypher.RawCypher('type(this1) as role'))
      
      return client.executeClause(clause)
    }
  
  }
}
