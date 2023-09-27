import { defineStore } from "pinia";

export const useTableColumns = defineStore("tableColumns", {
  state: () => ({
    functionsTypesList: [
      {
        name: "name",
        align: "left",
        label: "Nome da função",
        field: "name",
        sortable: true,
      },
      {
        name: "description",
        align: "left",
        label: "Descrição",
        field: "description",
        sortable: true,
      },
      {
        name: "status",
        align: "left",
        label: "Status",
        field: (row) => row.status.status,
        sortable: true,
      },
    ],
    usersList: [
      {
        name: "name",
        align: "left",
        label: "Nome de usuário",
        field: "name",
        sortable: true,
      },
      {
        name: "document",
        align: "left",
        label: "CPF",
        field: "document",
        sortable: true,
      },
      {
        name: "status",
        align: "left",
        label: "Status",
        field: (row) => row.status.status,
        sortable: true,
      },
    ],
    usersListInsideClass: [
      {
        name: "name",
        align: "left",
        label: "Nome de usuário",
        field: "name",
        sortable: true,
      },
    ],
    classesList: [
      {
        name: "className",
        align: "left",
        label: "Nome da turma",
        field: "className",
        sortable: true,
      },
      // {
      //   name: "document",
      //   align: "left",
      //   label: "CPF",
      //   field: "document",
      //   sortable: true,
      // },
      {
        name: "status",
        align: "left",
        label: "Status",
        field: 'status',
        sortable: true,
      },
    ],
  }),
});
