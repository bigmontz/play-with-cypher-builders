import Cypher from "@neo4j/cypher-builder";
import { Movie, Person } from "./entity";
import { CypherClientNode } from "./infrastructure/client";

export namespace Database {
  export const PersonNode = new CypherClientNode<Person>({ labels: ['Person'] });
  export const MovieNode = new CypherClientNode<Movie>({ labels: ['Movie']});
  export const GenericRel = new Cypher.Relationship()
  // can't dynamic type multiple relationships, so it needs to use
  // raw cypher
  export function typeOfRel (rel: Cypher.Relationship): Cypher.RawCypher {
    return new Cypher.RawCypher((env) => `type(${env.getReferences().get(rel)})`)
  }
}
