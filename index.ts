import { Driver } from "neo4j-driver";
import { CypherQueryBuilderRepository } from "./src/cypher-query-build.repository";
import { DriverRepository } from "./src/driver.repository";
import { Neo4jDriver } from "./src/infrastructure/driver";
import { Neo4jCypherBuilderRepository } from "./src/neo4j-cypher-builder.repository";
import { MovieCastProvider } from "./src/providers";
import { ClientRepository } from "./src/client.repository";


async function start() {
  const driver = await Neo4jDriver.configure()
  try {
    const getMovieCast = newMovieCastProvider(driver)
    const matrixCast = await getMovieCast('The Matrix')
    console.log(JSON.stringify(matrixCast, undefined, 4))
  } finally {
    await driver.close()
  }
}

function newMovieCastProvider(driver: Driver): MovieCastProvider  {
  const provider = (process.env.QUERY_PROVIDER ?? 'DRIVER').toString();
  switch (provider) {
    case 'NEO4J_CYPHER_BUILDER':
      return Neo4jCypherBuilderRepository.newMovieCastProvider(driver);
    case 'CYPHER_QUERY_BUILDER':
      return CypherQueryBuilderRepository.newMovieCastProvider(driver);
    case 'CLIENT':
      return ClientRepository.newMovieCastProvider(driver);
    case 'DRIVER':
    default:
      return DriverRepository.newMovieCastProvider(driver);
  }
}

start()
  .catch(e => console.error('Fatal error', e))
