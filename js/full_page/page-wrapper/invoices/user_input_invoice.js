Vue.component
(
    "user-input-invoice", 
    {
        props: ["edit_data", "revenue_type", "user_input"], 
        mixins:[support_mixin], 
        data() 
        {
            return {
                invoice: 
                {
                    leaseagrm_id: undefined, 
                    name: undefined
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
                } 
            }; 
        },
        computed: 
        {
            InvoiceDetails()
            {
                let invoice_complete = Object.values(this.invoice).map(value=>Boolean(value));
                return !invoice_complete.includes(false);  
            }, 
            ValidInvoiceDetails()
            {
                let total_details = Object.values(this.invoice_details).reduce((accumulator, current_value)=>(accumulator+current_value.length), 0); 
                if(!total_details)
                {
                    return false; 
                }
                let leaseagrm = this.invoice_details.leaseagrm.filter 
                (
                    revenue_type=>
                    {
                        let validation = 
                        {
                            valid: revenue_type.valid, 
                            period: this.ValidPeriod(revenue_type.start_date, revenue_type.end_date, true), 
                            price: revenue_type.price>=0,
                            quantity: revenue_type.quantity>=0, 
                            amount: numeral(revenue_type.amount).value()>0
                        }
                        return !Object.values(validation).includes(false); 
                    }
                ).map 
                (
                    ({amount, display, valid, title, row, ...rest})=>
                    {
                        return {
                            amount: amount.toString().replaceAll(",",""), 
                            ...rest
                        }; 
                    }
                ); 

                let utilities = this.invoice_details.utilities.map 
                (
                    ({revenue_type, date, previous_date, number, previous_number, id, apartment_id, ...rest})=>
                    (
                        {
                            utility_reading_id: id, 
                            ...rest
                        }
                    )
                ); 

                var valid = 
                {
                    leaseagrm: leaseagrm, 
                    utilities: utilities
                }; 

                let valid_details = Object.values(valid).reduce((accumulator, current_value)=>(accumulator+ current_value.length),0); 
                return (valid_details==total_details)?valid: false; 
            }
        }, 
        mounted() 
        {
            if(this.edit_data)
            {
                this.invoice = R.clone(this.edit_data.invoice);  
                this.invoice_details = R.clone(this.edit_data.details); 
                this.InvoiceInformation(this.edit_data.invoice.leaseagrm_id); 
                $(this.$refs["leaseagrm_id_select"]).find("[name='leaseagrm_id']").val(this.edit_data.invoice.leaseagrm_id); 
            }
        },
        methods: 
        {
            InputRentAndOtherCost(value)
            {
                new Promise
                (
                    (resolve, reject)=>
                    {
                        let revenue_type_ids = value.map(revenue_type=>revenue_type.id); 
                        let leaseagrm_details = this.invoice_details.leaseagrm.filter(details=>(revenue_type_ids.includes(details.revenue_type_id))); 
                        this.invoice_details.leaseagrm = []; 
                        resolve(leaseagrm_details); 
                    }
                ).then 
                (
                    leaseagrm_details=>
                    {
                        let revenue_type_ids = leaseagrm_details.map(details=>details.revenue_type_id); 
                        let additional_details = value.filter(revenue_type=>!revenue_type_ids.includes(revenue_type.id)).flatMap
                        (
                            revenue_type=>
                            {
                                if(this.edit_data)
                                {
                                    let details = this.edit_data.details.leaseagrm.filter(detail=>detail.revenue_type_id==revenue_type.id); 
                                    if(details.length>0)
                                    {
                                        return details; 
                                    }
                                }
                                let details = 
                                {
                                    display: true, 
                                    revenue_type_id: revenue_type.id, 
                                    title: revenue_type.name, 
                                    valid: true 
                                }
                                if(revenue_type.id==this.user_input.rent_id)
                                {
                                    let final_details = 
                                    {
                                        ...details, 
                                        price: Number(this.invoice_information.leaseagrm["rent_amount"]) 
                                    }; 

                                    let rent_information = this.invoice_information.leaseagrm.rent_information.map
                                    (
                                        ({start_date, end_date})=>
                                        {
                                            let row = R.clone(this.user_input.invoice_details.leaseagrm.form); 
                                            row[0].date_data.big_date.lock = Boolean(end_date); 
                                            let rent_end_date = end_date||this.invoice_information.leaseagrm["end_date"]; 
                                            let rent = 
                                            {
                                                ...final_details, 
                                                start_date: start_date, 
                                                end_date: rent_end_date, 
                                                quantity: this.RentQuantityCalculation(start_date, rent_end_date), 
                                                row: row 
                                            }
                                            return rent; 
                                        }
                                    ); 

                                    return rent_information.map
                                    (
                                        rent=>
                                        (
                                            {
                                                ...rent, 
                                                name: `${revenue_type.name} (${this.DateReformatDisplay(rent.start_date)} - ${this.DateReformatDisplay(rent.end_date)})`,
                                                amount: this.NumeralFormat(rent.price * rent.quantity)
                                            }
                                        )
                                    ); 
                                }
                                else 
                                {
                                    let final_details = 
                                    {
                                        ...details, 
                                        start_date: this.invoice_information.leaseagrm["start_date"], 
                                        end_date: this.invoice_information.leaseagrm["end_date"], 
                                        price: 0, 
                                        quantity: 1 
                                    }; 
            
                                    return [
                                        {
                                            ...final_details, 
                                            name: `${revenue_type.name} (${this.DateReformatDisplay(details.start_date)} - ${this.DateReformatDisplay(details.end_date)})`, 
                                            amount: this.NumeralFormat(details.price * details.quantity), 
                                            row: this.user_input.invoice_details.leaseagrm.form
                                        }
                                    ]; 
                                }

                            }
                        );                        
                        this.invoice_details.leaseagrm = [...leaseagrm_details, ...additional_details].sort((a, b)=> ((a.revenue_type_id>b.revenue_type_id)?1: -1)); 
                    }
                ); 
            }, 

            InputUtilities(value)
            {
                let revenue_type_ids = value.map(revenue_type=>revenue_type.id); 
                InvoiceInformationDetails = ()=>
                {
                    return this.invoice_information.utilities.filter(details=>revenue_type_ids.includes(details.revenue_type_id)).map
                    (
                        (details)=>
                        {
                            let revenue_type = this.revenue_type.utilities.filter(revenue_type=>revenue_type.id == details.revenue_type_id)[0].name; 
                            let numbers = ["previous_number", "number", "price", "quantity", "amount"]; 
                            let number = {}; 
                            numbers.forEach(key=>number[key] = this.NumeralFormat(Number(details[key]))); 
                            return {
                                name: `${this.invoice_information.apartment_name} - ${revenue_type} ${this.DateReformatDisplay(details.previous_date)} - ${this.DateReformatDisplay(details.date)}`, 
                                revenue_type: revenue_type, 
                                ...details, 
                                ...number
                            }
                        }
                    ); 
                }; 
                if(this.edit_data)
                {
                    let details_utilities = this.invoice_details.utilities.filter(details=>revenue_type_ids.includes(details.revenue_type_id)); 

                    let edit_ids = details_utilities.map(detail=>detail.edit_id); 
                    let edit_data_utilities = this.edit_data.details.utilities.filter(detail=>(!edit_ids.includes(detail.edit_id)) && (revenue_type_ids.includes(detail.revenue_type_id))); 

                    let invoice_information_details = InvoiceInformationDetails(); 

                    this.invoice_details.utilities = [...details_utilities, ...edit_data_utilities, ...invoice_information_details]; 

                }
                else 
                {
                    this.invoice_details.utilities = InvoiceInformationDetails(); 
                }
            }, 

            InvoiceInformation(leaseagrm_id)
            {
                let invoice_information = this.AjaxRequest(`${this.user_input.main_url}InvoiceInformation&leaseagrm_id=${leaseagrm_id}`); 
                this.invoice_information = JSON.parse(invoice_information); 
            }, 

            LeaseagrmIdSelectChanged()
            {
                new Promise 
                (
                    (resolve, reject)=>
                    {
                        let leaseagrm_id = this.invoice.leaseagrm_id; 
                        this.invoice.leaseagrm_id = undefined; 
                        this.InvoiceInformation(leaseagrm_id); 
                        Object.keys(this.invoice_details).forEach(key=>this.invoice_details[key]=[]);
                        resolve(leaseagrm_id);  
                    }
                ).then 
                (
                    leaseagrm_id=>
                    {
                        this.invoice.leaseagrm_id = leaseagrm_id; 
                        this.invoice.name = `${this.invoice.leaseagrm_id}-${this.DateReformatDisplay()}`; 
                    }
                ); 
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
                                    this.invoice_details.leaseagrm[index].quantity = this.RentQuantityCalculation(this.invoice_details.leaseagrm[index].start_date, this.invoice_details.leaseagrm[index].end_date); 
                                }
                                this.invoice_details.leaseagrm[index].amount = this.NumeralFormat(this.invoice_details.leaseagrm[index].quantity * this.invoice_details.leaseagrm[index].price); 
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
                var quatity = 0; 
                [start_period, end_period] = [start_period, end_period].map(period=>moment(period)); 
                start_period = start_period.add(1, "days"); 
                while(this.ValidPeriod(start_period, end_period))
                {
                    let end_of_month = new Date(start_period.year(), start_period.month()+1, 0); 
                    end_of_month = moment(end_of_month); 

                    let date_compare = moment(Math.min(end_of_month, end_period)); 
                    let days_diff = date_compare.diff(start_period, "days") + 1; 

                    quatity+=(days_diff/end_of_month.date()); 

                    start_period = end_of_month.add(1, "days"); 
                }

                return quatity.toFixed(3); 
            }, 

            Submit()
            {
                let invoices = 
                {
                    invoice: this.invoice, 
                    details: this.ValidInvoiceDetails
                }
                this.$emit("invoice-submit", invoices); 
            }
        },

        template: 
        `
            <div class="container-fluid">
                <h1><slot name="title">Add New Invoice</slot></h1>
                <br>
                <div class="row" ref="leaseagrm_id_select">
                    <select-input v-bind="user_input.leaseagrm_id" @search-data-changed="LeaseagrmIdSelectChanged" :lock="edit_data" v-model="invoice.leaseagrm_id"></select-input>
                </div>
                <br>
                <div class="row">
                    <text-input name="name" v-model="invoice.name" title="Invoice Name"></text-input>
                </div>

                <slot name="invoice_information" :invoice="invoice" :invoice_information="invoice_information"></slot>
                <hr>
                <template v-if="edit_data||InvoiceDetails">
                    <h2>Invoice Details</h2>
                    <br>
                    <div class="row">
                        <multi-select-input 
                            name="leaseagrm_multi_select" 
                            title="Rent and other cost" 
                            :select_atributes="user_input.select_atributes" 
                            :select_data="revenue_type.leaseagrm" 
                            :edit_data="edit_data?edit_data.multi_select:undefined"
                            @input="InputRentAndOtherCost"
                        ></multi-select-input>
                        <multi-select-input 
                            name="utilities_multi_select" 
                            title="Utilities" 
                            :select_atributes="user_input.select_atributes" 
                            :select_data="revenue_type.utilities" 
                            :edit_data="edit_data?edit_data.multi_select:undefined"
                            @input="InputUtilities"
                        ></multi-select-input>
                    </div>

                    <br>
                    <div class="row" v-if="invoice_details.leaseagrm.length>0">
                        <div class="col">
                            <h4>Rent and other cost</h4>
                            <template v-for="revenue_type in invoice_details.leaseagrm">
                                <br>
                                <form v-if="revenue_type.display">
                                    <div class="row">
                                        <text-input :edit_data="revenue_type" name="name" @new-value-change-valid="NewValueChangeValid"></text-input>
                                        <div class="col text-center">
                                            <h5>{{revenue_type.title}}</h5>
                                        </div>
                                        <div class="col text-right">
                                            <b>{{revenue_type.amount}}</b>
                                        </div>
                                    </div>
                                    <row-group 
                                        :row="revenue_type.row" 
                                        :edit_data="revenue_type" 
                                        @new-value-change-valid="NewValueChangeValid" 
                                        :lock="Number(revenue_type.revenue_type_id)==user_input.rent_id?user_input.invoice_details.leaseagrm.rent_lock:undefined"
                                    ></row-group>
                                </form>
                                <hr>
                            </template>
                        </div>
                    </div>
                    <br>
                    <div class="row" v-if="invoice_details.utilities.length>0">
                        <div class="col">
                            <h4>Utilities</h4>
                            <template v-for="revenue_type in invoice_details.utilities">
                                <br>
                                <div class="row">
                                    <div class="col"><h5>{{revenue_type.name}}</h5></div>
                                    <div class="col"><h5>{{revenue_type.revenue_type}}</h5></div>
                                    <div><h5>{{revenue_type.amount}}</h5></div>
                                </div>
                                <div class="row">
                                    <div class="col"><b>{{DateReformatDisplay(revenue_type.previous_date)}}</b></div>
                                    <div class="col"><b>{{DateReformatDisplay(revenue_type.date)}}</b></div>
                                    <div class="col"><b>Price</b></div>
                                    <div class="col"><b>Quantity</b></div>
                                </div>
                                <div class="row">
                                    <div class="col">{{revenue_type.previous_number}}</div>
                                    <div class="col">{{revenue_type.number}}</div>
                                    <div class="col">{{revenue_type.price}}</div>
                                    <div class="col">{{revenue_type.quantity}}</div>
                                </div>
                                <hr>
                            </template>
                        </div>
                    </div>
                </template>

                <div class="row text-right" v-if="ValidInvoiceDetails && InvoiceDetails">
                    <div class="col">
                        <button class="btn" :title="edit_data?'Edit Invoice': 'Add New Invoice'" @click="Submit"><i style="font-size: xx-large;" class="fas fa-arrow-alt-circle-right"></i></button>
                    </div>
                </div>
            </div>
        `
    }
); 