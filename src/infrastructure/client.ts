import { Clause } from "@neo4j/cypher-builder";
import { Driver, Record, resultTransformers } from "neo4j-driver";



type Dict<Key extends PropertyKey = PropertyKey, Value = any> = {
  [K in Key]: Value
}

export interface FromDriverConfig {
  driver: Driver
  database: string
}

export interface ExecuteClauseConfig {
  
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
