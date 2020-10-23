Vue.component
(
    "buildings", 
    {
        mixins: [support_mixin], 
        components: {...bootstrap, ...vueFragment}, 
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

        template: 
        `
            <fragment>
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
            </fragment>
        `
    }
); 