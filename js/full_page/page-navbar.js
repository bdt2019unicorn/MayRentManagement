Vue.component
(
    "logo-image", 
    {
        props: ["img_class"], 
        template: 
        `
            <a href="javascript:window.store_track.commit('RedirectUrl',{});">
                <img :class="img_class" src="img/logo.jpeg" alt="logo">
            </a>
        `
    }
); 

Vue.component 
(
    "main-nav-item", 
    {
        props: ["grid_area_surfix", "icon", "id", "index", "name", "params"], 
        mixins: [support_mixin], 
        computed: 
        {
            Href()
            {
                let href = ""; 
                Object.keys(this.params).forEach
                (
                    param=>
                    {
                        href+=`javascript:window.store_track.commit('RedirectUrl', {param: '${param}',value:'${this.params[param]}'}); `; 
                    }
                ); 
                return (href)?href:undefined; 
            }, 
            ItemStyle()
            {
                return { 
                    gridArea: (this.grid_area_surfix)?this.grid_area_surfix+"-"+this.index:undefined, 
                    textAlign: "center"
                }
            }
        }, 
        template: 
        `
            <a :style="ItemStyle" :href="Href">
                <i style="font-size: xx-large;" :class="['fas', 'fa-'+ this.icon]"></i>
                <p>{{name}}</p>
            </a>
        `
    }
); 

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


                <main-nav-item
                    v-for="index in buildings_data.length"
                    v-bind="buildings_data[index-1]"
                    :class="ItemsClasses(buildings_data[index-1].id, StateObject('building_id'), ['btn'], 'btn-warning', 'btn-primary')" 
                    :index="index"
                    :icon="(buildings_data[index-1].icon)?buildings_data[index-1].icon: default_icon"
                    :grid_area_surfix="grid_area_surfix"
                    :key="index"
                >
                </main-nav-item>
                <a 
                    class="btn btn-success" 
                    title="Import Excel Data"
                    v-if="StateObject('building_id') && StateObject('controller')!='overview'"
                    :style="'grid-area: '+grid_area_surfix+'-'+(buildings_data.length+1)+';'"
                    href='javascript: window.store_track.commit("RedirectUrl",{param: "action", value: "import-export"});'
                >
                    <i class="fas fa-table" style="font-size: xx-large;"></i>
                </a>
            </div>
        `
    }
); 