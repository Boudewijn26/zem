import { RxCollection, RxDatabase, RxDocument } from "rxdb";

export { Person } from "./models";
export type PersonDocument = RxDocument<Person>;
export type PersonCollection = RxCollection<Person>;
export interface PersonsCollections {
  persons: PersonCollection;
}
export type PersonDatabase = RxDatabase<PersonsCollections>;
