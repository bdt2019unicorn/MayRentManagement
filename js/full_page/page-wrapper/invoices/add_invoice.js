Vue.component
(
    "add-invoice", 
    {
        mixins:[support_mixin], 
        data() 
        {
            return {
                date_picker_opened: false, 
                function_calendar_model: undefined, 
                invoice: 
                {
                    leaseagrm_id: undefined, 
                    name: ""
                }, 
                invoice_details: 
                {
                    rent_and_other_cost: [], 
                    utilities: []
                }, 
                invoice_information: 
                {
                    rent_and_other_cost: {}, 
                    utilities: {}
                }, 
                revenue_type: 
                {
                    rent_and_other_cost: [], 
                    utilities: []
                }, 
                user_input: {}

            }; 
        },
        components: {FunctionalCalendar}, 
        computed: 
        {
            // LabelDateRange()
            // {
            //     return this.invoice.start_date?`${moment(this.invoice.start_date).format('DD MMM YYYY')} - ${moment(this.invoice.end_date).format('DD MMM YYYY')}`: ""; 
            // }, 
            InvoiceDetails()
            {
                let invoice_complete = Object.values(this.invoice).map(value=>Boolean(value));
                return !invoice_complete.includes(false);  
            }
        }, 
        created() 
        {
            this.user_input = this.AjaxRequest("server/user_input_controller/invoice.json"); 
            let revenue_types = this.AjaxRequest(this.OverviewDataUrl("revenue_type")); 
            revenue_types = JSON.parse(revenue_types); 
            this.revenue_type.utilities = revenue_types.filter(revenue_type=>Number(revenue_type.is_utility)); 
            this.revenue_type.rent_and_other_cost = revenue_types.filter(revenue_type=>!this.revenue_type.utilities.includes(revenue_type)); 
        },
        methods: 
        {
            TestMethod(value, id)
            {
                console.log(value, id); 
            }, 
            // CalendarChooseDay()
            // {
            //     if(this.function_calendar_model.dateRange.end)
            //     {
            //         this.invoice.start_date = this.function_calendar_model.dateRange.start; 
            //         this.invoice.end_date = this.function_calendar_model.dateRange.end; 
            //         this.function_calendar_model = undefined; 
            //         this.date_picker_opened = false; 
            //     }
            // }, 

            InputRentAndOtherCost(value)
            {
                let rent_and_other_cost_details = value.map 
                (
                    revenue_type=>
                    {
                        let details = 
                        {
                            revenue_type_id: revenue_type.id, 
                            title: revenue_type.name, 
                            name: revenue_type.name, 
                            start_period: this.invoice_information.rent_and_other_cost["start_period"], 
                            end_period: this.invoice_information.rent_and_other_cost["end_period"], 
                            price: (revenue_type.id==this.user_input.rent_id)?Number(this.invoice_information.rent_and_other_cost["rent_amount"]): 0, 
                            quatity: (revenue_type.id==this.user_input.rent_id)?this.RentQuantityCalculation(this.invoice_information.rent_and_other_cost["start_period"], this.invoice_information.rent_and_other_cost["end_period"]):1
                        }; 

                        return {
                            ...details, 
                            amount: details.price * details.quatity
                        }; 
                    }
                ).sort((a, b)=> ((a.revenue_type_id>b.revenue_type_id)?1: -1)); 

                this.invoice_details.rent_and_other_cost = rent_and_other_cost_details; 
            }, 



            LeaseagrmIdSelectChanged()
            {
                this.invoice.leaseagrm_id = $(this.$refs["leaseagrm_id_select"]).find("[name='leaseagrm_id']").val(); 

                let invoice_information = this.AjaxRequest(`${this.user_input.main_url}InvoiceInformation&leaseagrm_id=${this.invoice.leaseagrm_id}`); 
                // invoice_information = JSON.parse(invoice_information); 
                // console.log(invoice_information); 

                this.invoice_information = JSON.parse(invoice_information); 


                // this.invoice_information.rent_and_other_cost = 

                // try
                // {
                //     let date_data = this.AjaxRequest(`${this.user_input.main_url}LastInvoiceDate&leaseagrm_id=${this.leaseagrm_id}`); 
                //     date_data = JSON.parse(date_data); 
                //     this.invoice.start_date = Object.values(date_data[0])[0]; 

                //     let start_date = new Date(this.invoice.start_date); 
                //     let now = new Date(); 
                //     let end_month_date = new Date(now.getFullYear(), now.getMonth(), 0); 

                //     this.invoice.end_date = (start_date>=now)? this.invoice.start_date: moment(end_month_date).format("YYYY-MM-DD"); 
                // }
                // catch {}


                if(!this.invoice.name.trim().length>0)
                {
                    // let options = $(this.$refs["leaseagrm_id_select"]).find("[name='leaseagrm_id']").children(); 
                    // this.invoice.name = `${Object.keys(options).filter(key=>options[key].value==this.leaseagrm_id).map(key=>options[key].innerText)[0]} ${this.LabelDateRange}`; 

                    this.invoice.name = `${this.invoice.leaseagrm_id}-${moment().format("DD MMM YYYY")}`; 
                }

            }, 

            RentQuantityCalculation(start_period, end_period)
            {
                function ValidateMoment(moment_start, moment_end)
                {   
                    let [str_start, str_end] = [moment_start, moment_end].map(moment_object=>moment_object.format("YYYY-MM-DD")); 
                    return moment(str_end)>moment(str_start); 
                }

                var quatity = 0; 
                start_period = moment(start_period); 
                end_period = moment(end_period); 

                while(ValidateMoment(start_period, end_period))
                {

                    let end_of_month = new Date(start_period.year(), start_period.month()+1, 0); 
                    end_of_month = moment(end_of_month); 

                    let date_compare = moment(Math.min(end_of_month, end_period)); 
                    let days_diff = date_compare.diff(start_period, "days") + 1; 

                    quatity+=(days_diff/end_of_month.date()); 

                    start_period = end_of_month.add(1, "days"); 
                }

                return quatity; 
            }
        },


        template: 
        `
            <div class="container-fluid">
                <h1>Add New Invoice</h1>
                <br>
                <div class="row" ref="leaseagrm_id_select">
                    <select-input v-bind="user_input.leaseagrm_id" @search-data-changed="LeaseagrmIdSelectChanged"></select-input>
                </div>
                <br>
                <div class="row">
                    <div class="col form-group">
                        <label for="name"><b>Invoice Name</b></label>
                        <input class="form-control" name="name" v-model="invoice.name">
                    </div>
                </div>
                <hr>
                <template v-if="InvoiceDetails">
                    <h3>Invoice Details</h3>
                    <br>
                    <div class="row">
                        <multi-select-input title="Rent and other cost" :select_atributes="user_input.select_atributes" :select_data="revenue_type.rent_and_other_cost" @input="InputRentAndOtherCost"></multi-select-input>
                        <multi-select-input title="Utilities" :select_atributes="user_input.select_atributes" :select_data="revenue_type.utilities" @input="TestMethod"></multi-select-input>
                    </div>

                    <br>
                    <div class="row" v-if="invoice_details.rent_and_other_cost.length>0">
                        <div class="col">
                            <h6>Rent and other cost</h6>
                            <template v-for="revenue_type in invoice_details.rent_and_other_cost">
                                <br>
                                <div>
                                    <div class="col">
                                        <p>
                                            {{revenue_type}}
                                        </p>
                                    </div>
                                </div>
                                <row-group
                                    :row="user_input.invoice_details.rent_and_other_cost.form"
                                ></row-group>
                            </template>
                        </div>
                    </div>
                    <br>
                    <div class="row" v-show="false">
                        <div class="col">
                            <h6>Utilities</h6>
                        </div>
                    </div>
                </template>
            </div>
        `
    }
); 


/*

<div class="row">
<div class="col">
    <label><b>Period</b></label>
    <input type="text" class="form-control" @click="date_picker_opened = !date_picker_opened" readonly style="text-align: center;":value="LabelDateRange">
    <FunctionalCalendar 
        ref="calendar" 
        v-if='date_picker_opened' 
        class="col"
        dateFormat="yyyy-mm-dd" 
        :is-date-range='true' 
        v-model="function_calendar_model" 
        @choseDay="CalendarChooseDay"
    ></FunctionalCalendar>
</div>
</div>

*/
