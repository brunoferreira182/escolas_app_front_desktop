import { defineStore } from "pinia";

export const useTableColumns = defineStore("tableColumns", {
  state: () => ({
    solicitationsList: [
      {
        name: "departmentName",
        align: "left",
        label: "Departamento",
        field: "departmentName",
        sortable: true,
      },
      {
        name: "openedBy",
        align: "left",
        label: "Aberto por",
        field: "openedBy",
        sortable: true,
      },
      {
        name: "createdAt",
        align: "left",
        label: "Data de abertura",
        field: "createdAt",
        sortable: true,
      },
    ],
    departmentsList: [
      {
        name: "name",
        align: "left",
        label: "Nome",
        field: "name",
        sortable: true,
      },
      {
        name: "isActive",
        align: "left",
        label: "Ativo",
        field: "isActive",
        sortable: true,
      },
    ],
    notesList: [
      {
        name: "noteName",
        align: "left",
        label: "Nome do recado",
        field: "noteName",
        sortable: true,
      },
      {
        name: "label",
        align: "left",
        label: "Tempo de expiração",
        field: (row) => row.remaningDate.label,
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
    menuList: [
      // {
      //   name: "name",
      //   align: "left",
      //   label: "Nome do menu",
      //   field: "name",
      //   sortable: true,
      // },
      {
        name: "date",
        align: "left",
        label: "Data Início - Data Fim",
        field: (row) => {
          if (row.date && row.date.from && row.date.to) {
            return `${row.date.from} - ${row.date.to}`;
          } else if (row.date && !row.date.from) {
            return `${row.date} - Fim do Dia`;
          }
        },
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
    schoolEvents: [
      {
        name: "eventName",
        align: "left",
        label: "Nome do evento",
        field: "eventName",
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
    eventsList: [
      {
        name: "name",
        align: "left",
        label: "Nome da atividade",
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
    archivesList: [
      {
        type: "type",
        align: "left",
        label: "Tipo do arquivo",
        field: "type",
        sortable: true,
      },
      {
        name: "name",
        align: "left",
        label: "Destinatário",
        field: "name",
        sortable: true,
      },
      {
        name: "createdAt",
        align: "left",
        label: "Data",
        field: "createdAt",
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
    postsList: [
      {
        name: "name",
        align: "left",
        label: "Nome da postagem",
        field: (row) => row.postData.resume.title,
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
    childrenList: [
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
    ],
    childsList: [
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
        name: "birthdate",
        align: "left",
        label: "Data de nascimento",
        field: "birthdate",
        sortable: true,
      }
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
    attendanceList: [
      {
        name: 'name',
        label: 'Nome',
        align: 'left',
        field: 'name',
        style: 'min-width: 150px;'
      },
      {
        name: 'document',
        label: 'Documento ',
        align: 'left',
        field: 'document',
        style: 'min-width: 150px;'
      },
      {
        name: 'attendance',
        label: 'Presença',
        align: 'left',
        field: 'attendance',
        style: 'min-width: 100px;'
      },
      {
        name: 'date',
        label: 'Data',
        align: 'center',
        field: 'date',
        style: 'min-width: 120px;'
      },
    ],
    attendanceListClasses: [
      {
        name: 'name',
        label: 'Nome',
        align: 'left',
        field: 'name',
        style: 'min-width: 150px;'
      },
      {
        name: 'document',
        label: 'Documento ',
        align: 'left',
        field: 'document',
        style: 'min-width: 150px;'
      },
      {
        name: 'attendance',
        label: 'Presença',
        align: 'left',
        field: 'attendance',
        style: 'min-width: 100px;'
      },
      {
        name: 'date',
        label: 'Data',
        align: 'center',
        field: 'date',
        style: 'min-width: 120px;'
      },
      {
        name: 'className',
        label: 'Turma',
        align: 'center',
        field: 'className',
        style: 'min-width: 150px;'
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
