import { defineStore } from "pinia";

export const useTableColumns = defineStore("tableColumns", {
  state: () => ({
    postsList: [
      {
        name: "name",
        align: "left",
        label: "Nome da postagem",
        field: (row) => row.postData.detail[0].value,
        sortable: true,
      },
      {
        name: "visualizations",
        align: "left",
        label: "Visualizações",
        field: "visualizations",
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
