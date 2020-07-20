Vue.component
(
    "utilities-overview", 
    {
        mixins: [support_mixin], 
        data() 
        {
            return {
                apartments: [], 
                table_data: []
            }
        },

        computed: 
        {
            TableDataUrl()
            {
                return `server/overview_controller/utilities.php?building_id=${this.BuildingId}`; 
            }
        },

        created() 
        {
            this.apartments = this.TableData("apartment");     
        },


        methods: 
        {
            Search(search_data, search_button=false)
            {
                if(search_button)
                {
                    this.table_data = JSON.parse(this.AjaxRequest(this.TableDataUrl, search_data,"post")); 
                }
            }
        },

        template: 
        `
            <general-utilities @search-data-changed="Search" :table_data="table_data">
                <template #form_apartments_select="slotProps">
                    <select-input :select_data="apartments" v-bind="slotProps.select_data" name="apartment_id" :not_required="true">All Apartment</select-input>
                    <div class="col-2">
                        <button type="submit" class="btn btn-primary">Search</button>
                    </div>
                </template>

                <template #add_utilities>
                    <div class="col-2">
                        <button type="button" class="btn btn-primary">Add</button>
                    </div>
                </template>

            </general-utilities>
        `
    }
); 

Vue.component
(
    "apartment-utilities", 
    {
        mixins: [support_mixin], 
        data() 
        {
            return {
                table_data: []
            }
        },

        computed: 
        {
            TableDataUrl()
            {
                return `server/overview_controller/utilities.php?building_id=${this.BuildingId}`; 
            }
        },

        created() 
        {

        },


        methods: 
        {
            Search(search_data, search_button=false)
            {
                window.test_search_data = search_data; 
                if(search_button)
                {
                    this.table_data = JSON.parse(this.AjaxRequest(this.TableDataUrl, search_data,"post")); 
                }
            }
        },
        template: 
        `
            <general-utilities @search-data-changed="Search" :table_data="table_data">
            </general-utilities>
        `
    }
); 




