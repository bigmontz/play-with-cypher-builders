import Cypher from "@neo4j/cypher-builder";

export namespace Database {
  export const PersonNode = new Cypher.Node({ labels: ['Person'] });
  export const MovieNode = new Cypher.Node({ labels: ['Movie']});
  export const GenericRel = new Cypher.Relationship()
  // can't dynamic type multiple relationships, so it needs to use
  // raw cypher
  export function typeOfRel (rel: Cypher.Relationship): Cypher.RawCypher {
    return new Cypher.RawCypher((env) => `type(${env.getReferences().get(rel)})`)
  }
}
