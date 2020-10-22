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
                file: undefined 
            }
        }, 
        components: {...bootstrap}, 

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
                            <div>Test</div>
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