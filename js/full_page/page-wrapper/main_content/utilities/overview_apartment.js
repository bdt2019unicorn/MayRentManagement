Vue.component
(
    "utilities-overview", 
    {
        mixins: [utilities_mixin], 
        data() 
        {
            return {
                apartments: [], 
                revenue_type_id: undefined
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
                    this.table_data = JSON.parse(this.AjaxRequest(this.OverviewUrl, search_data,"post")); 
                    this.revenue_type_id = search_data.get("revenue_type_id"); 
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
                
                <template #utility_price="slotProps">
                    <h4>{{slotProps.UtilityNameSearchById[revenue_type_id]}} price</h4>
                    <p>quick test</p>

                    <h4>Overview</h4>
                </template>
            </general-utilities>
        `
    }
); 

Vue.component
(
    "apartment-utilities", 
    {
        mixins: [utilities_mixin], 
        methods: 
        {
            Search(search_data)
            {
                try 
                {
                    search_data.append("apartment_id", this.StateObject("object_id")); 
                    let apartment_utitlities_json = this.AjaxRequest(this.OverviewUrl, search_data,"post"); 
                    let apartment_utitlities = JSON.parse(apartment_utitlities_json)[0]; 
                    this.table_data = Object.values(apartment_utitlities.apartment_table).reverse(); 
                }
                catch {}
            }
        },
        template: `<general-utilities @search-data-changed="Search" :table_data="table_data"></general-utilities>`
    }
); 




