var dashboard = Vue.component
(
    "dashboard", 
    {
        mixins: [support_mixin], 
        data()
        {
            return {
            }
        }, 
        components: {...bootstrap}, 
        computed: 
        {
        },

        methods: 
        {
            TestMethod()
            {
                alert("good"); 
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
            <vs-row vs-justify="center">
                <vs-col vs-w="10">
                    <vs-tabs alignment="fixed">
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

                        <vs-tab label="Backup/Restore Data">
                            <b-tabs content-class="mt-3" justified>
                                <b-tab title="Backup" lazy>
                                    <p>I'm the first tab</p>
                                </b-tab>
                                <b-tab title="Restore" lazy>
                                    <p>I'm the second tab</p>
                                    <p>I'm the first tab</p>
                                    <p>I'm the first tab</p>
                                    <p>I'm the first tab</p>
                                    <p>I'm the first tab</p>
                                    <p>I'm the first tab</p>
                                    <p>I'm the first tab</p>
                                    <p>I'm the first tab</p>
                                    <p>I'm the first tab</p>
                                    <p>I'm the first tab</p>
                                </b-tab>
                            </b-tabs>
                        </vs-tab>
                    </vs-tabs>
                </vs-col>
            </vs-row>
        `
    }
); 