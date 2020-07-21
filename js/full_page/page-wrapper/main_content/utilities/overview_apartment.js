Vue.component
(
    "utilities-overview", 
    {
        mixins: [utilities_mixin], 
        data() 
        {
            return {
                apartments: [], 
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
        mixins: [utilities_mixin], 
        methods: 
        {
            Search(search_data)
            {
                try 
                {
                    search_data.append("apartment_id", this.StateObject("object_id")); 
                    let apartment_utitlities_json = this.AjaxRequest(this.TableDataUrl, search_data,"post"); 
                    let url = "server/utilities_controller/apartment_utilities.php"; 
                    let table_data = this.SubmitData("apartment_utilities", url, apartment_utitlities_json, false); 
                    console.log(table_data); 
                    this.table_data = JSON.parse(apartment_utitlities_json); 
                }
                catch {}
            }
        },
        template: `<general-utilities @search-data-changed="Search" :table_data="table_data"></general-utilities>`
    }
); 



