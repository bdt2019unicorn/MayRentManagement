Vue.component
(
    "invoice-utilities",
    {
        props: ["edit_data", "invoice_information", "list", "revenue_type"], 
        mixins: [support_mixin], 
        data() 
        {
            return {
                invoice_details: []
            }; 
        },
        computed: 
        {
            ValidInvoiceDetails()
            {
                return this.invoice_details.map 
                (
                    ({revenue_type, date, previous_date, number, previous_number, id, apartment_id, ...rest})=>
                    (
                        {
                            utility_reading_id: id, 
                            ...rest
                        }
                    )
                ); 
            }    
        },
        created() 
        {
            this.PopulateList(this.list);     
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
        watch: 
        {
            list: function(new_value, old_value)
            {
                this.PopulateList(new_value); 
            }, 
            ValidInvoiceDetails: function(new_value, old_value)
            {
                this.$emit("input", new_value); 
            }  
        },
        template: 
        `
            <div class="row" v-if="invoice_details.length>0">
                <div class="col">
                    <h4>Utilities</h4>
                    <template v-for="revenue_type in invoice_details">
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
        `
    } 
); 