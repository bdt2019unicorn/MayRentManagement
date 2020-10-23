var dashboard = Vue.component
(
    "dashboard", 
    {
        mixins: [support_mixin], 
        data()
        {
            return {
                backup_restore_tab: 0, 
                current_tab: 0, 
                file: undefined,
                leaseagrm: [], 
                leaseagrm_edit: undefined, 
                leaseagrm_table: "Contracts with no tenants and apartment", 
                revenue_expense: 
                {
                    revenue: [], 
                    expense: []
                }
            }
        }, 
        // components: {...bootstrap, Multiselect: window.VueMultiselect.default}, 

        computed: 
        {
            LeaseagrmCategorized()
            {
                let partition_all_null = R.partition(leaseagrm=>(leaseagrm["Apartment"]==undefined && leaseagrm["Tenant Name"]==undefined), this.leaseagrm); 
                let apartment_tenant_partition = R.partition(leaseagrm=>leaseagrm["Apartment"]==undefined, partition_all_null[1]); 
                return {
                    "Contracts with no tenants and apartment": partition_all_null[0], 
                    "Contract with no apartment": apartment_tenant_partition[0], 
                    "Contract with no head tenant": apartment_tenant_partition[1]
                }; 
            }, 

            LeaseagrmCurrentTable()
            {
                let data= this.LeaseagrmCategorized[this.leaseagrm_table]; 
                if(data.length==0)
                {
                    return undefined; 
                }
                let columns = Object.keys(data[0]).map
                (
                    column=>
                    (
                        {
                            field: column, 
                            label: column, 
                            searchable: true, 
                            sortable: true, 
                            centered: true
                        }
                    )
                ); 
                return {
                    data: data, 
                    columns: columns
                }; 
            }
        },
        
        created() 
        {
            let data = this.AjaxRequest("server/dashboard_controller/dashboard.php"); 
            data = JSON.parse(data); 
            Object.keys(data).forEach(key=>this[key] = data[key]); 
        },

        methods: 
        {
            DeleteBuilding(building_id)
            {
                var url = `server/database_controller/delete.php?table=buildings`; 
                var result = this.SubmitData("delete", url, [building_id]); 
                if(result)
                {
                    this.BuildingsData(); 
                    alert("Delete Building Success!"); 
                }
                else 
                {
                    alert("Delete building fails! There seems to be a server issue"); 
                }
            }    
        },

        watch: 
        {
            backup_restore_tab: function(new_value, old_value)
            {
                this.file = undefined; 
            }, 

            current_tab: function(new_value, old_value)
            {
                this.file = undefined; 
            }

        },

        template: 
        `
            <vs-row vs-justify="center">
                <vs-col vs-w="10">
                    <vs-tabs alignment="fixed" v-model="current_tab">

                        <!--<vs-tab label="Contract need attention">
                            <b-form-select size="lg" class="my-3" style="text-align-last: center;" :options="Object.keys(LeaseagrmCategorized)" v-model="leaseagrm_table"></b-form-select>
                            <!--<b-table class="my-3" v-if="LeaseagrmCurrentTable" v-bind="LeaseagrmCurrentTable" :selected.sync="leaseagrm_edit"></b-table>-->
                        </vs-tab>
                        <vs-tab label="Buildings">
                            <vs-row>
                                <vs-button class="mx-1 my-1" color="primary" type="gradient" icon="add_circle_outline">Add</vs-button>
                                <vs-button class="mx-1 my-1" color="success" type="gradient" icon="grid_on">Import Excel</vs-button>
                            </vs-row>
                            <vs-row class="my-2">
                                <vs-col v-for="building in StateObject('buildings_data')" type="flex" vs-w="4">
                                    <vs-card fixedHeight>
                                        <h6 class="text-center" slot="header">{{building.name}}</h6>
                                        <div class="text-center">
                                            <img src="img/logo.jpeg" alt="logo">
                                        </div>
                                        <vs-row slot="footer" vs-justify="flex-end">
                                            <b-button title="Delete" class="mx-1" variant="danger" @click="DeleteBuilding(building.id)"><b-icon icon="trash"></b-icon></b-button>
                                            <vs-button class="mx-1" color="secondary" type="gradient" icon="edit" title="Edit"></vs-button>
                                        </vs-row>
                                    </vs-card>
                                </vs-col>
                            </vs-row>
                        </vs-tab>

                        <vs-tab label="Income/Expense Types">
                            <div>Need to have 2 tables showing the expense and income types, potentially do it like a to do list</div>
                        </vs-tab>

                        <vs-tab label="Backup/Restore Data">
                            <b-tabs content-class="mt-3" justified vertical pills lazy nav-wrapper-class="col-4" nav-class="text-center" v-model="backup_restore_tab">
                                <b-tab title="Backup">
                                    <b-button variant="link" href="#">
                                        <b-icon-cloud-upload></b-icon-cloud-upload>
                                        Download back up file
                                    </b-button>
                                </b-tab>
                                <b-tab title="Restore">
                                    <vs-upload 
                                        limit="1" 
                                        :show-upload-button="false" 
                                        text="Upload the restore File" 
                                        @change="file = arguments[1][arguments[1].length-1]" 
                                        @on-delete="file=undefined" 
                                    />
                                    <br>
                                    <submit-button v-if="file" title="Backup data"></submit-button>
                                </b-tab>
                            </b-tabs>
                        </vs-tab>
                    </vs-tabs>
                </vs-col>
            </vs-row>
        `
    }
); 