class UtilitiesOverview extends BaseComponent
{
    // mixins: [permissions_mixin, utilities_mixin], 
    
    constructor(props)
    {
        super(props); 
        this.state = 
        {
            add_price_form: false, 
            add_price_form_temp: undefined, 
            current_price: undefined, 
            revenue_type_id: undefined,
            table_data_temp: [],  
            valid_price_date: undefined
        }; 
    }
    // mounted() 
    // {
    //     var add_price = this.AjaxRequest("server/controller/utilities/add_price.json"); 
    //     add_price.form[0][0]["select_data"] = this.select_data.utilities; 
    //     this.add_price_form_temp = add_price; 
    // },
    // watch: 
    // {
    //     add_price_form: function(new_value, old_value)
    //     {
    //         if(Boolean(new_value))
    //         {
    //             this.table_data_temp = R.clone(this.table_data); 
    //             this.table_data = []; 
    //         }
    //         else 
    //         {
    //             this.table_data = this.table_data_temp; 
    //         }
    //     }, 
    //     revenue_type_id: function(new_value, old_value)
    //     {
    //         this.PriceInformation(); 
    //     }    
    // },
    CurrentPriceInformation = (revenue_type_id) => 
    {
        let price_information = this.AjaxRequest(`${this.main_url}CurrentPrice&revenue_type_id=${revenue_type_id}`); 
        return JSON.parse(price_information)[0]; 
    } 
    DateFormat = (string) => 
    {
        return moment(string).format("DD/MM/YYYY"); 
    } 
    NewPrice = (data) => 
    {
        let current_price = this.CurrentPriceInformation(data.revenue_type_id); 
        let data_date_valid = moment(data.date_valid, "DD/MM/YYYY"); 
        var current_price_date_valid = data_date_valid; 
        try 
        {
            current_price_date_valid= moment(current_price.date_valid); 
        }
        catch{}
        
        data.value = data.value.replace(/,/g,''); 

        ModifyDateValid = (bad_message=undefined) =>
        {
            let date_valid = this.add_price_form.form[0].pop(); 
            date_valid["bad_message"] = bad_message; 
            date_valid["edit_data"] = {date_valid: this.DateReformatDatabase(data_date_valid)}; 
            this.add_price_form.form[0].push(date_valid); 
        }

        if(data_date_valid<current_price_date_valid)
        {
            ModifyDateValid(`Please enter a later date than the current date at ${this.DateFormat(current_price_date_valid)}`); 
        }
        else
        {
            ModifyDateValid(); 
            data.date_enter = this.DateReformatDatabase(); 
            data.date_valid = this.DateReformatDatabase(data_date_valid); 
            let url = `${this.main_url}NewPrice`; 
            let result = this.SubmitData("NewPrice", url, data); 
            if(Number(result))
            {
                alert("New Price is entered in the server"); 
                this.add_price_form = false; 
                this.PriceInformation(); 
            }
            else 
            {
                alert("There seems to be a problem with the server, please try again"); 
            }
        }
    }  
    PriceInformation = () => 
    {
        try 
        {
            let price_information = this.CurrentPriceInformation(this.revenue_type_id); 
            this.current_price = price_information.value; 
            this.valid_price_date = this.DateFormat(price_information.date_valid); 
        }
        catch
        {
            this.current_price = this.valid_price_date = undefined; 
        }
    }
    Search = (search_data, search_button=false) => 
    {
        if(search_button)
        {
            this.table_data = JSON.parse(this.AjaxRequest(this.OverviewUrl, search_data,"post")); 
            this.revenue_type_id = search_data.get("revenue_type_id"); 
        }
    }
    UtilityNameSearchById = () => 
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
    render()
    {
        return (
            <div>overview utilities</div>
        ); 
/*
        `
            <general-utilities @search-data-changed="Search" :select_data="select_data" :table_data="table_data">
                <template #form_units_select>
                    <select-input :select_data="select_data.units" v-bind="select_data" name="unit_id" :not_required="true">All Units</select-input>
                    <div class="col-2">
                        <button type="submit" class="btn btn-primary">Search</button>
                    </div>
                </template>

                <template #utility_overview>
                    <div class="col-2"></div>
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
                            <div v-if="AddEditPermission" class="col-2">
                                <button class="btn" title="Add Current Price" @click="add_price_form=add_price_form_temp"><i class="fas fa-plus-circle"></i></button>
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
*/
    }
}

class UnitUtilities extends BaseComponent 
{
    // mixins: [utilities_mixin], 
    Search(search_data)
    {
        try 
        {
            search_data.append("unit_id", this.$route.query.id); 
            let unit_utitlities_json = this.AjaxRequest(this.OverviewUrl, search_data,"post"); 
            let unit_utitlities = JSON.parse(unit_utitlities_json)[0]; 
            this.table_data = Object.values(unit_utitlities.unit_table).reverse(); 
        }
        catch {}
    }
    render()
    {
        return (
            <div>unit utilities </div>
        ); 
        // `<general-utilities @search-data-changed="Search" :select_data="select_data" :table_data="table_data"></general-utilities>`
    } 
}