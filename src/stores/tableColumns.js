import { defineStore } from "pinia";

export const useTableColumns = defineStore("tableColumns", {
  state: () => ({
    usersList: [
      {
        name: "name",
        align: "left",
        label: "Nome de usuário",
        field: "name",
        sortable: true,
      },
      {
        name: "email",
        align: "left",
        label: "E-mail",
        field: "email",
        sortable: true,
      },
      {
        name: "status",
        align: "left",
        label: "Status",
        field: (row) => row.status.status,
        sortable: true,
      },
      // {
      //   name: "organismConfigName",
      //   align: "left",
      //   label: "Tipo de organismo",
      //   field: "organismConfigName",
      //   sortable: true,
      // },
      // {
      //   name: "organismParentName",
      //   align: "left",
      //   label: "Organismo superior",
      //   field: "organismParentName",
      //   sortable: true,
      // },
    ],
    organismList: [
      {
        name: "nome",
        align: "left",
        label: "Nome do organismo",
        field: "nome",
        sortable: true,
      },
      {
        name: "data_de_criacao",
        align: "left",
        label: "Data de criação",
        field: (row) => row.data_de_criacao.dateLocale,
        sortable: true,
      },
      {
        name: "organismConfigName",
        align: "left",
        label: "Tipo de organismo",
        field: "organismConfigName",
        sortable: true,
      },
      {
        name: "organismParentName",
        align: "left",
        label: "Organismo superior",
        field: "organismParentName",
        sortable: true,
      },
    ],
  }),
});
