Vue.component
(
    "add-invoice", 
    {
        mixins:[support_mixin], 
        data() 
        {
            return {
                invoice: 
                {
                    leaseagrm_id: undefined, 
                    name: ""
                }, 
                invoice_details: 
                {
                    leaseagrm: [], 
                    utilities: []
                }, 
                invoice_information: 
                {
                    leaseagrm: {}, 
                    utilities: {}
                }, 
                revenue_type: 
                {
                    leaseagrm: [], 
                    utilities: []
                }, 
                user_input: {}

            }; 
        },
        computed: 
        {
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
            this.revenue_type.leaseagrm = revenue_types.filter(revenue_type=>!this.revenue_type.utilities.includes(revenue_type)); 
        },
        methods: 
        {
            TestMethod(value, id)
            {
                console.log(value, id); 
            }, 


            InputRentAndOtherCost(value)
            {
                let leaseagrm_details = value.map 
                (
                    revenue_type=>
                    {
                        let details = 
                        {
                            display: true, 
                            revenue_type_id: revenue_type.id, 
                            title: revenue_type.name, 
                            start_period: this.invoice_information.leaseagrm["start_period"], 
                            end_period: this.invoice_information.leaseagrm["end_period"], 
                            price: (revenue_type.id==this.user_input.rent_id)?Number(this.invoice_information.leaseagrm["rent_amount"]): 0, 
                            quantity: (revenue_type.id==this.user_input.rent_id)?this.RentQuantityCalculation(this.invoice_information.leaseagrm["start_period"], this.invoice_information.leaseagrm["end_period"]):1
                        }; 

                        let amount = details.price * details.quantity; 

                        return {
                            ...details, 
                            name: `${revenue_type.name} (${moment(details.start_period).format("DD MMM YYYY")} - ${moment(details.end_period).format("DD MMM YYYY")})`, 
                            amount: amount.toFixed(3), 
                            amount_format: numeral(amount).format("0,0[.]000")
                        }; 
                    }
                ).sort((a, b)=> ((a.revenue_type_id>b.revenue_type_id)?1: -1)); 

                this.invoice_details.leaseagrm = leaseagrm_details; 
            }, 

            LeaseagrmIdSelectChanged()
            {
                this.invoice.leaseagrm_id = $(this.$refs["leaseagrm_id_select"]).find("[name='leaseagrm_id']").val(); 

                let invoice_information = this.AjaxRequest(`${this.user_input.main_url}InvoiceInformation&leaseagrm_id=${this.invoice.leaseagrm_id}`); 
                this.invoice_information = JSON.parse(invoice_information); 
                if(!this.invoice.name.trim().length>0)
                {
                    this.invoice.name = `${this.invoice.leaseagrm_id}-${moment().format("DD MMM YYYY")}`; 
                }

            }, 

            NewValueChangeValid(edit_data, name, new_value, reactive=false)
            {
                new Promise
                (
                    (resolve, reject)=>
                    {
                        var change_index = undefined; 
                        for (let index = 0; index < this.invoice_details.leaseagrm.length; index++) 
                        {
                            if(this.invoice_details.leaseagrm[index].revenue_type_id==edit_data.revenue_type_id)
                            {
                                change_index = index; 
                                this.invoice_details.leaseagrm[index].display = reactive; 
                                this.invoice_details.leaseagrm[index][name] = new_value; 
                                if(this.invoice_details.leaseagrm[index].revenue_type_id==this.user_input.rent_id)
                                {
                                    this.invoice_details.leaseagrm[index].quantity = this.RentQuantityCalculation(this.invoice_details.leaseagrm[index].start_period, this.invoice_details.leaseagrm[index].end_period); 
                                }
                                let amount = this.invoice_details.leaseagrm[index].quantity * this.invoice_details.leaseagrm[index].price; 
                                this.invoice_details.leaseagrm[index].amount = amount.toFixed(3); 
                                this.invoice_details.leaseagrm[index].amount_format = numeral(amount).format("0,0[.]000"); 
                                break; 
                            }
                        }
                        resolve(change_index); 
                    }
                ).then 
                (
                    change_index=>
                    {
                        this.invoice_details.leaseagrm[change_index].display = true; 
                    }
                ); 
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

                return quatity.toFixed(3); 
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
                    <h2>Invoice Details</h2>
                    <br>
                    <div class="row">
                        <multi-select-input title="Rent and other cost" :select_atributes="user_input.select_atributes" :select_data="revenue_type.leaseagrm" @input="InputRentAndOtherCost"></multi-select-input>
                        <multi-select-input title="Utilities" :select_atributes="user_input.select_atributes" :select_data="revenue_type.utilities" @input="TestMethod"></multi-select-input>
                    </div>

                    <br>
                    <div class="row" v-if="invoice_details.leaseagrm.length>0" ref="invoice_leaseagrm">
                        <div class="col">
                            <h4>Rent and other cost</h4>
                            <template v-for="revenue_type in invoice_details.leaseagrm">
                                <br>
                                <form v-if="revenue_type.display">
                                    <div class="row">
                                        <text-input :edit_data="revenue_type" name="name"></text-input>
                                        <div class="col text-center">
                                            <h5>{{revenue_type.title}}</h5>
                                            <input type="number" name="revenue_type_id" hidden v-model="revenue_type.revenue_type_id">
                                        </div>
                                        <div class="col text-right">
                                            <b>{{revenue_type.amount_format}}</b>
                                            <input type="text" name="amount" hidden v-model="revenue_type.amount">
                                        </div>
                                    </div>
                                    <row-group
                                        :row="user_input.invoice_details.leaseagrm.form"
                                        :edit_data="revenue_type"
                                        :lock="Number(revenue_type.revenue_type_id)==user_input.rent_id?user_input.invoice_details.leaseagrm.rent_lock:undefined"
                                        @new-value-change-valid="NewValueChangeValid"
                                    ></row-group>
                                </form>
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