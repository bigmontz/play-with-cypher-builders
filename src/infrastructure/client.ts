import { Clause, Node, Relationship } from "@neo4j/cypher-builder";
import { PropertyRef } from "@neo4j/cypher-builder/dist/references/PropertyRef";
import { Driver, Record, resultTransformers } from "neo4j-driver";



type Dict<Key extends PropertyKey = PropertyKey, Value = any> = {
  [K in Key]: Value
}

type Shape<Key extends string = string, Value = any> = {
  [K in Key]: Value
}

export interface FromDriverConfig {
  driver: Driver
  database: string
}

export interface ExecuteClauseConfig {
  
}

/**
 * CypherClientNode and CypherClientRelationship show a need for type safe 
 * information in the Cypher.Node and Cypher.Relationship.
 * 
 * This shapes can be also be used in the driver return.
 */

export class CypherClientNode<NodeShape extends Shape = Shape> extends Node {
  typedProperty<K extends keyof NodeShape = keyof NodeShape>  (prop: K): PropertyRef {
    return this.property(prop as string)
  }
}

export class CypherClientRelationship<NodeShape extends Shape = Shape> extends Relationship {
  typedProperty<K extends keyof NodeShape = keyof NodeShape>  (prop: K): PropertyRef {
    return this.property(prop as string)
  }
}

export class CypherClient {

  static fromDriver({ driver, database }: FromDriverConfig): CypherClient {
    return new CypherClient(driver, database)
  }

  private constructor (
    private _driver: Driver,
    private _database: string
  ) {

  }

  async executeClause<RecordShape extends Dict = Dict>(clause: Clause, config?: ExecuteClauseConfig): Promise<RecordShape[]> {
    // it can be good to have if the query is read or write, somehow.
    const { cypher, params } = clause.build()
    return await this._driver.executeQuery(cypher, params, {
      database: this._database,
      resultTransformer: resultTransformers.mappedResultTransformer<RecordShape, RecordShape[]>({
        map: (rec) => rec.toObject(),
        collect: (recs) => recs
      }),
      ...config
    })
  }
}

export default CypherClient
