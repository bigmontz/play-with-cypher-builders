import { Driver } from "neo4j-driver";
import { CypherQueryBuilderRepository } from "./src/cypher-query-build.repository";
import { DriverRepository } from "./src/driver.repository";
import { Neo4jDriver } from "./src/infrastructure/driver";
import { Neo4jCypherBuilderRepository } from "./src/neo4j-cypher-builder.repository";
import { MovieCastProvider } from "./src/providers";
import { ClientRepository } from "./src/client.repository";
import CypherClient from "./src/infrastructure/client";


async function start() {
  const driver = await Neo4jDriver.configure()
  const client = CypherClient.fromDriver({ driver, database: 'neo4j' })
  try {
    const executeTask = getMainTaskExecutor(driver, client)
    await executeTask()
  } finally {
    await driver.close()
  }
}

function getMainTaskExecutor(driver: Driver, client: CypherClient) {
  const task = (process.env.CYPHER_TASK ?? 'PRINT_KEANU').toUpperCase()
  switch (task) {
    case 'PRINT_MATRIX_CAST':
      return () => printMatrixCast(driver, client);
    case 'PRINT_KEANU':
    default:
      return () => printKeanu(client)
  }
}

async function printMatrixCast(driver: Driver, client: CypherClient) {
  const getMovieCast = newMovieCastProvider(driver)
  const matrixCast = await getMovieCast('The Matrix')
  printJson(matrixCast)
}

async function printKeanu(client: CypherClient) {
  const getPerson = ClientRepository.newGetPersonByNameProvider(client)
  const person = await getPerson('Keanu Reeves')
  printJson(person)
}

function newMovieCastProvider(driver: Driver): MovieCastProvider {
  const provider = (process.env.QUERY_PROVIDER ?? 'DRIVER').toString();
  switch (provider) {
    case 'NEO4J_CYPHER_BUILDER':
      return Neo4jCypherBuilderRepository.newMovieCastProvider(driver);
    case 'CYPHER_QUERY_BUILDER':
      return CypherQueryBuilderRepository.newMovieCastProvider(driver);
    case 'CLIENT':
      const client = CypherClient.fromDriver({ driver, database: 'neo4j' })
      return ClientRepository.newMovieCastProvider(client);
    case 'DRIVER':
    default:
      return DriverRepository.newMovieCastProvider(driver);
  }
}

function printJson(object?: any) {
  console.log(JSON.stringify(object, undefined, 4));
}

start()
  .catch(e => console.error('Fatal error', e))
