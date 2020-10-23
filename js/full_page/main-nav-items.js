Vue.component
(
    "main-nav-items", 
    {
        props: ["buildings_data", "default_icon"], 
        mixins: [support_mixin], 
        // components: {...bootstrap}, 
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
                        <b-dropdown expanded>
                            <b-button slot="trigger" expanded size="is-large" :type="CurrentBuilding? 'is-warning': 'is-success' + ' is-light'">{{CurrentBuilding?CurrentBuilding.name: 'Buildings'}}</b-button>
                            <b-dropdown-item v-for="index in buildings_data.length">
                                <router-link
                                    :to="'/'+ buildings_data[index-1]['id']"
                                    :class="ItemsClasses(buildings_data[index-1].id, $route.params.building_id, ['btn', 'w-100'], 'btn-warning', 'btn-primary')" 
                                >
                                    <p><i style="font-size: xx-large;" :class="['fas', 'fa-'+ default_icon]"></i>&nbsp;{{buildings_data[index-1]["name"]}}</p>
                                </router-link>

                                <b-button tag="router-link" :to="'/'+ buildings_data[index-1]['id']">
                                </b-button>
                            </b-dropdown-item>
                    </div>
                    <div class="col-2"></div>
                </div>
            </div>
        `
    }
); 