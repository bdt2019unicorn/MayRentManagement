Vue.component
(
    "main-nav-items", 
    {
        props: ["buildings_data", "default_icon", "grid_area_surfix"], 
        mixins: [support_mixin], 
        computed: 
        {
            MainNavItems()
            {
                let total = this.buildings_data.length +3; 
                let percentage = 100/total; 
                var main_nav_items = 
                {
                    display: "grid", 
                    gridTemplateRows: "auto", 
                    gridColumnGap: "1%", 
                    gridTemplateColumns: "", 
                    gridTemplateAreas: "'"
                }; 
                for (let index = 0; index < total; index++) 
                {
                    main_nav_items.gridTemplateColumns+=percentage+"% "; 
                    main_nav_items.gridTemplateAreas+= this.grid_area_surfix + "-"+index+ " "; 
                }
                main_nav_items.gridTemplateAreas = main_nav_items.gridTemplateAreas.trim() + "'"; 
                return main_nav_items;  
            }
        },

        template: 

        `
            <div :style="MainNavItems">

                <router-link
                    v-for="index in buildings_data.length"
                    :class="ItemsClasses(buildings_data[index-1].id, $route.params.building_id, ['btn'], 'btn-warning', 'btn-primary')" 
                    :style='{textAlign: "center", gridArea: grid_area_surfix+"-"+index}'
                    :to="'/'+ buildings_data[index-1]['id']"
                >
                    <i style="font-size: xx-large;" :class="['fas', 'fa-'+ default_icon]"></i>
                    <p>{{buildings_data[index-1]["name"]}}</p>
                </router-link>

                <router-link
                    class="btn btn-success" 
                    title="Import Excel Data"
                    v-if="$route.params.building_id && $route.params.controller"
                    :style="'grid-area: '+grid_area_surfix+'-'+(buildings_data.length+1)+';'"
                    :to='"/" + $route.params.building_id + "/" + $route.params.controller + "/import-export"'
                >
                    <i class="fas fa-table" style="font-size: xx-large;"></i>
                </router-link>
            </div>
        `
    }
); 