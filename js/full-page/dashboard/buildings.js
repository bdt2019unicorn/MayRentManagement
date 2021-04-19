Vue.component
(
    "buildings", 
    {
        mixins: [support_mixin], 
        data: () =>
        (
            {
                add_building_form: undefined, 
                display: {}
            }
        ),
        components: {...bootstrap, ...vueFragment}, 
        methods: 
        {
            AddBuilding(data)
            {
                let url = "server/controller/database/import.php?import_controller=buildings"; 
                let result = this.SubmitData("excel", url, [data]); 
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
                var url = `server/controller/database/delete.php?table=buildings`; 
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
            }, 
            EditBuilding(building_id)
            {
                window.router.push 
                (
                    {
                        name: 'general-edit', 
                        params: {controller: 'buildings'}, 
                        query: {id: building_id}
                    }
                ); 
            }    
        },
        created() 
        {
            this.display = this.StateObject("building_user_input").display;     
        },

        template: 
        `
            <fragment>
                <vs-row>
                    <vs-button class="mx-1 my-1" color="primary" type="gradient" icon="add_circle_outline" @click="add_building_form=StateObject('building_user_input')">Add</vs-button>
                    <vs-button class="mx-1 my-1" color="success" type="gradient" icon="grid_on">Import Excel</vs-button>
                </vs-row>

                <template v-if="add_building_form">
                    <br>
                    <div class="container-fluid text-right">
                        <b-button pill title="Cancel" variant="danger" @click="add_building_form=undefined"><b-icon icon="x-circle"></b-icon></b-button>
                    </div>
                    <user-input v-bind="add_building_form" title="Add Building" @form-information-valid="AddBuilding"></user-input>
                    <br>
                </template>


                <vs-row v-else class="my-2">
                    <vs-col v-for="building in StateObject('buildings_data')" type="flex" vs-w="4">
                        <vs-card fixedHeight>
                            <h6 class="text-center" slot="header">{{building.name}}</h6>
                            <template v-for="display_key in Object.keys(display)">
                                <b>{{display[display_key]}}: </b> 
                                <span>{{building[display_key]}}</span>
                                <br>
                            </template>
                            <vs-row slot="footer" vs-justify="flex-end">
                                <b-button title="Delete" class="mx-1" variant="danger" @click="DeleteBuilding(building.id)"><b-icon icon="trash"></b-icon></b-button>
                                <vs-button class="mx-1" color="secondary" type="gradient" icon="edit" title="Edit" @click="EditBuilding(building.id)"></vs-button>
                            </vs-row>
                        </vs-card>
                    </vs-col>
                </vs-row>
            </fragment>
        `
    }
); 