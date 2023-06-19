import neo4j, { Driver, QueryConfig, resultTransformers } from 'neo4j-driver'
export namespace Neo4jDriver {
  export async function configure (): Promise<Driver> {
    const driver = neo4j.driver('neo4j://localhost:7687', neo4j.auth.basic('neo4j', 'password'), {
      disableLosslessIntegers: true
    })
    try {
      await driver.verifyConnectivity({ database: 'neo4j' })
      return driver
    } catch (e) {
      await driver.close()
      throw e
    }
  }

  export function queryConfig<ElementType> (): QueryConfig<ElementType[]> {
    return { 
      database: 'neo4j',
      resultTransformer: resultTransformers.mappedResultTransformer<ElementType, ElementType[]>({
        map: (rec) => rec.toObject() as ElementType,
        collect: (recs) => recs
      })
    }
  }
}
