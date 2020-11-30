Vue.component
(
    "utilities-row", 
    {
        props: ["amount", "date", "name", "number", "previous_date", "previous_number", "price", "quantity", "revenue_type"], 
        mixins: [support_mixin], 
        template: 
        `
            <div>
                <br>
                <h5 class="text-center">{{revenue_type}}</h5>
                <div class="row">
                    <div class="col-10"><h6>{{name}}</h6></div>
                    <div class="col text-right"><h6>{{amount}}</h6></div>
                </div>
                <div class="row">
                    <div class="col"><b>{{DateReformatDisplay(previous_date)}}</b></div>
                    <div class="col"><b>{{DateReformatDisplay(date)}}</b></div>
                    <div class="col"><b>Price</b></div>
                    <div class="col"><b>Quantity</b></div>
                </div>
                <div class="row">
                    <div class="col">{{previous_number}}</div>
                    <div class="col">{{number}}</div>
                    <div class="col">{{price}}</div>
                    <div class="col">{{quantity}}</div>
                </div>
                <hr>
            </div>
        `
    }
); 

Vue.component
(
    "invoice-utilities",
    {
        mixins: [user_input_invoice_component_mixin, valid_invoice_details_mixin], 
        computed: 
        {
            ValidInvoiceDetails()
            {
                return this.ValidInvoiceDetailsUtilities(this.invoice_details, this.list); 
            }    
        },
        methods: 
        {
            PopulateList(value)
            {
                let revenue_type_ids = value.map(revenue_type=>revenue_type.id); 
                InvoiceInformationDetails = ()=>
                {
                    return this.invoice_information.utilities.filter(details=>revenue_type_ids.includes(details.revenue_type_id)).map
                    (
                        (details)=>
                        {
                            let revenue_type = this.revenue_type.utilities.find(revenue_type=>revenue_type.id == details.revenue_type_id).name; 
                            let numbers = ["previous_number", "number", "price", "quantity", "amount"]; 
                            let number = {}; 
                            numbers.forEach(key=>number[key] = this.NumeralFormat(Number(details[key]))); 
                            return {
                                name: `${this.invoice_information.unit_name} - ${revenue_type} ${this.DateReformatDisplay(details.previous_date)} - ${this.DateReformatDisplay(details.date)}`, 
                                revenue_type: revenue_type, 
                                ...details, 
                                ...number
                            }
                        }
                    ); 
                }; 
                if(this.edit_data)
                {
                    let details_utilities = this.invoice_details.filter(details=>revenue_type_ids.includes(details.revenue_type_id)); 

                    let edit_ids = details_utilities.map(detail=>detail.edit_id); 
                    let edit_data_utilities = this.edit_data.details.utilities.filter(detail=>(!edit_ids.includes(detail.edit_id)) && (revenue_type_ids.includes(detail.revenue_type_id))); 

                    let invoice_information_details = InvoiceInformationDetails(); 

                    this.invoice_details = [...details_utilities, ...edit_data_utilities, ...invoice_information_details]; 

                }
                else 
                {
                    this.invoice_details = InvoiceInformationDetails(); 
                }
            }
        },
        template: 
        `
            <div class="row" v-if="invoice_details.length">
                <div class="col">
                    <h4>Utilities</h4>
                    <utilities-row v-for="revenue_type in invoice_details" v-bind="revenue_type"></utilities-row>
                </div>
            </div>
        `
    } 
); 