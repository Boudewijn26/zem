import { createRxDatabase, addRxPlugin } from "rxdb/plugins/core";

// import modules
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";

if (process.env.NODE_ENV === "development") {
  // in dev-mode we add the dev-mode plugin
  // which does many checks and adds full error messages
  addRxPlugin(RxDBDevModePlugin);
}

import { RxDBValidatePlugin } from "rxdb/plugins/validate";
addRxPlugin(RxDBValidatePlugin);

import {
  pullQueryBuilderFromRxSchema,
  pushQueryBuilderFromRxSchema,
  RxDBReplicationGraphQLPlugin,
} from "rxdb/plugins/replication-graphql";
import { personSchema } from "@/schemas/PersonSchema";
import { PersonDatabase, PersonsCollections } from "@/RxDB";
addRxPlugin(RxDBReplicationGraphQLPlugin);

import * as PouchdbMemoryAdapter from "pouchdb-adapter-memory";
import { SubscriptionClient } from "subscriptions-transport-ws";
addRxPlugin(PouchdbMemoryAdapter);

const collections = {
  persons: {
    schema: personSchema,
  },
};

const pullQueryBuilder = pullQueryBuilderFromRxSchema("persons", {
  schema: personSchema,
  feedKeys: ["updatedAt"],
  deletedFlag: "isDeleted",
});

const pushQueryBuilder = pushQueryBuilderFromRxSchema("persons", {
  schema: personSchema,
  feedKeys: ["updatedAt"],
  deletedFlag: "isDeleted",
});

async function _create(): Promise<PersonDatabase> {
  const db = await createRxDatabase<PersonsCollections>({
    name: "persons",
    adapter: "memory",
  });
  await db.addCollections(collections);
  const personReplication = db.collections.persons.syncGraphQL({
    url: "/graphql",
    push: { queryBuilder: pushQueryBuilder },
    pull: { queryBuilder: pullQueryBuilder },
    live: true,
    liveInterval: 60 * 60 * 1000,
    deletedFlag: "isDeleted",
  });
  console.log(personReplication);
  const wsClient = new SubscriptionClient("ws://localhost:8080/subscriptions", {
    reconnect: true,
  });
  wsClient
    .request({
      query: `subscription onChangedPerson {
      changedPerson {
        id
      }
    }`,
    })
    .subscribe({ next: () => personReplication.run() });

  return db;
}
const DatabaseService = {
  DB_CREATE_PROMISE: _create(),
  get(): Promise<PersonDatabase> {
    return this.DB_CREATE_PROMISE;
  },
};
export default DatabaseService;
