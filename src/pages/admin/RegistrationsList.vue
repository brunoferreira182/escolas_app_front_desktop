<template>
	<q-page-container class="no-padding">
		<q-page>
			<q-table
				flat class="bg-accent"
				title="Rematrículas"
				:columns="columnsData"
				:rows="registrationsList"
				row-key="_id"
				@row-click="clkOpenRegistrationDetail"
				virtual-scroll
				rows-per-page-label="Registros por página"
				no-data-label="Nenhum dado inserido até o momento"
				no-results-label="A pesquisa não retornou nenhum resultado"
				:rows-per-page-options="[10, 20, 30, 50]"
				:filter="filter"
				v-model:pagination="pagination"
				@request="nextPage">
				<template #top-right>
					<div class="flex row q-gutter-sm items-center text-right">
						<div class="col">
							<q-select
								outlined
								dense
								label="Filtro"
								debounce="300"
								v-model="selectFilter"
								:options="selectStatus"
								@update:model-value="getRegistrations"
							></q-select>
						</div>
						<div class="col">
							<q-input
								@keyup="getRegistrations"
								outlined
								dense
								debounce="300"
								v-model="filter"
								placeholder="Procurar"
							>
								<template #append>
									<q-icon name="search" />
								</template>
							</q-input>
						</div>
						<div class="col text-right">
							<q-btn
								@click="$router.push('/admin/newRegistration')"
								color="primary"
								unelevated
								no-caps
								rounded
								icon="add"
								class="q-pa-sm text-caption"
								label="Abrir rematrícula"
								/>
						</div>
					</div>
				</template>
				<template #body-cell-status="props">
          <q-td :props="props">
            <q-chip
              outline
              :color="`${ props.row.isActive === 1 ? 'green-8' : 'red-8'}`"
              size="14px"
            >
              {{  props.row.isActive === 1 ? 'Ativo' : 'Inativo' }}
            </q-chip>
          </q-td>
        </template>
				<template #body-cell-initialDate="props">
          <q-td :props="props">
						{{ props.row.initialDate.split('-')[2] }}/
						{{ props.row.initialDate.split('-')[1] }}/
						{{ props.row.initialDate.split('-')[0] }}
          </q-td>
        </template>
				<template #body-cell-finalDate="props">
          <q-td :props="props">
						{{ props.row.finalDate.split('-')[2] }}/
						{{ props.row.finalDate.split('-')[1] }}/
						{{ props.row.finalDate.split('-')[0] }}
          </q-td>
        </template>
			</q-table>
		</q-page>
	</q-page-container>
</template>
<script>
import { defineComponent } from "vue";
import useFetch from "../../boot/useFetch";
import { useTableColumns } from "stores/tableColumns";

export default defineComponent({
	name: "RegistrationsList",
	data() {
		return {
			columnsData: useTableColumns().registrationsList,
			registrationsList: [],
			selectStatus: ["Ativos", "Inativos"],
			selectFilter: null,
			filter: "",
			pagination: {
				page: 1,
				rowsPerPage: 10,
				rowsNumber: 0,
				sortBy: "",
			},
			userPermissionsOptions: [],
		};
	},
	mounted() {
		this.$q.loading.hide();
	},
	beforeMount() {
		this.getRegistrations();
	},
	methods: {
		clkOpenRegistrationDetail(e, r){
			const registrationId = r._id
			this.$router.push('/admin/registrationDetail?registrationId=' + registrationId)
		},
		getRegistrations() {
			const page = this.pagination.page
			const rowsPerPage = this.pagination.rowsPerPage
			const searchString = this.filter
			const sortBy = this.pagination.sortBy
			const opt = {
				route: "/desktop/adm/getRegistrations",
				body: {
					page: page,
					rowsPerPage: rowsPerPage,
					searchString: searchString,
					sortBy: sortBy,
				},
			};
			switch(this.selectFilter){
				case 'Ativos:':
					opt.body.status = 'active'
				break;
				case 'Inativos:':
					opt.body.status = 'inactive'
				break;
			}
			useFetch(opt).then((r) => {
				this.registrationsList = r.data[0].list
				r.data[0].count[0] ? this.pagination.rowsNumber = r.data[0].count[0].count : this.pagination.rowsNumber = 0
			});
		},
		nextPage(e) {
			this.pagination.page = e.pagination.page;
			this.pagination.sortBy = e.pagination.sortBy;
			this.pagination.rowsPerPage = e.pagination.rowsPerPage;
			this.getRegistrations();
		},
	},
});
</script>
