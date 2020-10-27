Vue.component
(
    "buildings", 
    {
        mixins: [support_mixin], 
        data() 
        {
            return {
                add_building_form: undefined          
            }
        },
        components: {...bootstrap, ...vueFragment}, 
        methods: 
        {
            AddBuilding(event)
            {
                event.preventDefault();
                let url = "server/database_controller/import.php?import_controller=buildings"; 
                let result = this.SubmitData("excel", url, [this.add_building_form]); 
                if(Number(result))
                {
                    this.BuildingsData(); 
                    alert("Add Building Success!"); 
                    this.add_building_form = undefined; 
                }
                else
                {
                    alert("Add Building Fails! Please try again"); 
                }
            }, 
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

        template: 
        `
            <fragment>
                <vs-row>
                    <vs-button class="mx-1 my-1" color="primary" type="gradient" icon="add_circle_outline" @click="add_building_form={name: ''}">Add</vs-button>
                    <!--<vs-button class="mx-1 my-1" color="success" type="gradient" icon="grid_on">Import Excel</vs-button>-->
                </vs-row>

                <template v-if="add_building_form">
                    <br>
                    <div>
                        <b-form @submit="AddBuilding">
                            <b-form-group label="Building Name">
                                <b-form-input v-model="add_building_form.name" required></b-form-input>
                            </b-form-group>
                            <vs-row vs-type="flex" vs-align="space-between" vs-justify="flex-end">
                                <b-button pill title="Cancel" variant="danger" @click="add_building_form=undefined"><b-icon icon="x-circle"></b-icon></b-button>
                                <submit-button type="submit" title="Add New Buidling"></submit-button>
                            </vs-row>
                        </b-form>
                    </div>
                    <br>
                </template>


                <vs-row class="my-2">
                    <vs-col v-for="building in StateObject('buildings_data')" type="flex" vs-w="4">
                        <vs-card fixedHeight>
                            <h6 class="text-center" slot="header">{{building.name}}</h6>
                            <div class="text-center">
                                <img src="img/logo.jpeg" alt="logo">
                            </div>
                            <vs-row slot="footer" vs-justify="flex-end">
                                <b-button title="Delete" class="mx-1" variant="danger" @click="DeleteBuilding(building.id)"><b-icon icon="trash"></b-icon></b-button>
                                <!--<vs-button class="mx-1" color="secondary" type="gradient" icon="edit" title="Edit"></vs-button>-->
                            </vs-row>
                        </vs-card>
                    </vs-col>
                </vs-row>
            </fragment>
        `
    }
); 