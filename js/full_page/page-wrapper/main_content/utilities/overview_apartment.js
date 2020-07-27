Vue.component
(
    "utilities-overview", 
    {
        mixins: [utilities_mixin], 
        data() 
        {
            return {
                add_price_form: false, 
                current_price: undefined, 
                revenue_type_id: undefined, 
                temporary_table_data: undefined, 
                valid_price_date: undefined,
            }
        },
        computed: 
        {
            UtilityNameSearchById()
            {
                let utility_name_by_id = {}; 
                this.select_data.utilities.forEach
                (
                    element => 
                    {
                        utility_name_by_id[element.id] = element.name; 
                    }
                );
                return utility_name_by_id; 
            }
        },
        created() 
        {
            this.select_data.apartments = this.TableData("apartment");     
        },
        methods: 
        {
            AddPriceForm()
            {
                var add_price = this.AjaxRequest("server/utilities_controller/add_price.json"); 
                add_price.form[0][0]["select_data"] = this.select_data.utilities; 
                this.add_price_form = add_price; 
            }, 
            NewPrice(data)
            {
                console.log(data); 
            }, 
            Search(search_data, search_button=false)
            {
                if(search_button)
                {
                    this.table_data = JSON.parse(this.AjaxRequest(this.OverviewUrl, search_data,"post")); 
                    this.revenue_type_id = search_data.get("revenue_type_id"); 
                }
            }, 
            PriceInformation()
            {
                let price_information = this.AjaxRequest(`${this.main_url}CurrentPrice&revenue_type_id=${this.revenue_type_id}`); 
                try 
                {
                    price_information = JSON.parse(price_information)[0]; 
                    this.current_price = price_information.value; 
                    this.valid_price_date = price_information.date_valid; 
                }
                catch
                {
                    this.current_price = this.valid_price_date = undefined; 
                }
            }
        },
        watch: 
        {
            add_price_form: function(new_value, old_value)
            {
                if(new_value)
                {
                    this.temporary_table_data = this.table_data; 
                    this.table_data = []; 
                }
                else
                {
                    this.table_data = this.temporary_table_data; 
                }
            }, 
            revenue_type_id: function(new_value, old_value)
            {
                this.PriceInformation(); 
            }    
        },
        template: 
        `
            <general-utilities @search-data-changed="Search" :select_data="select_data" :table_data="table_data">
                <template #form_apartments_select>
                    <select-input :select_data="select_data.apartments" v-bind="select_data" name="apartment_id" :not_required="true">All Apartment</select-input>
                    <div class="col-2">
                        <button type="submit" class="btn btn-primary">Search</button>
                    </div>
                </template>

                <template #add_utilities>
                    <div class="col-2">
                        <button type="button" class="btn btn-primary">Add</button>
                    </div>
                </template>
                
                <template #utility_price>
                    <h4>{{UtilityNameSearchById[revenue_type_id]}} price</h4>
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col row">
                                <div class="col">
                                    <b>Current: </b>
                                    {{current_price}}
                                </div>
                                <div class="col">
                                    <b>Valid from: </b>
                                    {{valid_price_date}}
                                </div>
                            </div>
                            <div class="col-2">
                                <button class="btn" title="Add Current Price" @click="AddPriceForm"><i class="fas fa-plus-circle"></i></button>
                            </div>
                        </div>
                    </div>

                    <div v-if="add_price_form" class="popup-div">
                        <button class="btn btn-danger close-popup" @click="add_price_form=false"><i class="far fa-times-circle"></i></button>
                        <user-input class="inner-div" v-bind="add_price_form" @form-information-valid="NewPrice"></user-input>
                    </div>

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
        template: `<general-utilities @search-data-changed="Search" :select_data="select_data" :table_data="table_data"></general-utilities>`
    }
); 