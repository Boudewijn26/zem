<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <p v-for="person of persons" :key="person.id">
      {{person.firstName}}
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Person } from "@/models";
import DatabaseService from "@/services/DatabaseService";

@Component({})
export default class Home extends Vue {
  private persons: Person[] = [];

  async mounted() {
    const db = await DatabaseService.get();
    db.persons.find({selector: {}}).$.subscribe((persons: Person[]) => this.persons = persons);
  }
}
</script>
