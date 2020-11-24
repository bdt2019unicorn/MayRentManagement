Vue.component
(
    "main-nav-items", 
    {
        props: ["buildings_data", "default_icon"], 
        mixins: [support_mixin], 
        components: {...bootstrap}, 
        computed: 
        {
            CurrentBuilding()
            {
                return this.buildings_data.find(building=>building.id==this.$route.params.building_id); 
            }
        }, 
        template: 

        `
            <div class="container-fluid">

                <div class="row w-100">
                    <div class="col-2"></div>
                    <div class="col">
                        <b-dropdown 
                            :text="CurrentBuilding?CurrentBuilding.name: 'Buildings'" 
                            block 
                            lazy 
                            menu-class="w-100" 
                            :variant="CurrentBuilding?'warning':'info'"
                        >
                            <b-dropdown-item v-for="index in buildings_data.length">
                                <router-link
                                    :to="'/'+ buildings_data[index-1]['id']"
                                    :class="ItemsClasses(buildings_data[index-1].id, $route.params.building_id, ['btn', 'w-100'], 'btn-warning', 'btn-primary')" 
                                >
                                    <p><i style="font-size: xx-large;" :class="['fas', 'fa-'+ default_icon]"></i>&nbsp;{{buildings_data[index-1]["name"]}}</p>
                                </router-link>
                            </b-dropdown-item>
                        </b-dropdown>
                    </div>
                    <div class="col-2"></div>
                </div>
            </div>
        `
    }
); 