import { Person } from "@/models";
import { RxJsonSchema } from "rxdb";
import PersonSchema from "../../../../specs/models/schema/registration/person.json";

export const personSchema: RxJsonSchema<Person> = { ...PersonSchema } as RxJsonSchema<Person>;
