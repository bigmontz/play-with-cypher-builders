import { Driver, Integer, Node } from "neo4j-driver";
import Cypher from "@neo4j/cypher-builder";
import { GetPersonByNameProvider, MovieCastProvider } from "./providers";
import { CastElement, Person } from "./entity";
import CypherClient, { Neo4jClientNode } from "./infrastructure/client";
import { Database } from "./database";

export namespace ClientRepository {
  const cast = new Cypher.Pattern(Database.PersonNode)
    .related(Database.GenericRel)
    .to(Database.MovieNode)

  export function newMovieCastProvider(client: CypherClient): MovieCastProvider {
    return async function (movieName: string): Promise<CastElement[]> {
      const clause = new Cypher.Match(cast)
        .where(Database.MovieNode, { title: new Cypher.Param(movieName) })
        .and(Cypher.in(Database.typeOfRel(Database.GenericRel), new Cypher.Param([
          'ACTED_IN',
          'DIRECTED',
          'PRODUCED',
          'WROTE'
        ])))
        .return(
          [Database.PersonNode.typedProperty('name'), 'name'],
          [Database.PersonNode.typedProperty('born'), 'born'],
          [Database.typeOfRel(Database.GenericRel), 'role']
        )

      return client.executeClause(clause)
    }
  }

  export function newGetPersonByNameProvider (client: CypherClient): GetPersonByNameProvider {
    return async function (personName: string): Promise<Person | undefined> {
      interface RecordShape {
        person: Neo4jClientNode<Person>
      }

      const clause = new Cypher.Match(Database.PersonNode)
        .where(Database.PersonNode, { name: new Cypher.Param(personName)})
        .return([Database.PersonNode, 'person'])

      const personList = await client.executeClause<RecordShape>(clause)
      return personList[0]?.person?.properties
    }
  }
}
