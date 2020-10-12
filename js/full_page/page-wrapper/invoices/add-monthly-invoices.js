Vue.component
(
    "add-monthly-invoices", 
    {
        mixins: [support_mixin, rent_invoice_mixin, valid_invoice_details_mixin], 
        data() 
        {
            return {
                monthly_invoices: {}, 
                monthly_invoices_display: {}, 
                user_input: {}
            }
        },
        computed: 
        {
            MonthlyInvoicesSubmit()
            {
                try 
                {
                    let monthly_invoices = Object.keys(this.monthly_invoices).filter(leaseagrm_id=>this.monthly_invoices_display[leaseagrm_id].total).map
                    (
                        leaseagrm_id=>
                        (
                            {
                                invoice: 
                                {
                                    name: this.monthly_invoices[leaseagrm_id].name, 
                                    leaseagrm_id: leaseagrm_id
                                }, 
                                details: 
                                {
                                    leaseagrm: this.ValidInvoiceDetailsLeaseagrm(this.monthly_invoices_display[leaseagrm_id].leaseagrm), 
                                    utilities: this.ValidInvoiceDetailsUtilities(this.monthly_invoices_display[leaseagrm_id].utilities)
                                }
                            }
                        ) 
                    ); 
                    return monthly_invoices; 
                }   
                catch
                {
                    return false; 
                } 
            }
        },
        created() 
        {
            this.user_input = this.AjaxRequest("server/user_input_controller/invoice.json"); 
            var url = `${this.user_input.main_url}AddMonthlyInvoices&building_id=${this.$route.params.building_id}`; 
            let monthly_invoices = this.AjaxRequest(url); 
            this.monthly_invoices = JSON.parse(monthly_invoices); 
        },
        methods: 
        {
            NewValueChangeValid(edit_data, name, new_value)
            {
                for (let index = 0; index < this.monthly_invoices_display[edit_data.leaseagrm_id].leaseagrm.length; index++) 
                {
                    if(R.equals(this.monthly_invoices_display[edit_data.leaseagrm_id].leaseagrm[index], edit_data))
                    {
                        this.monthly_invoices_display[edit_data.leaseagrm_id].leaseagrm[index][name] = new_value; 
                        break; 
                    }
                }
            }    
        },
        watch: 
        {
            monthly_invoices: function(new_value, old_value)
            {
                try 
                {
                    let monthly_invoices = {}; 
                    Object.keys(this.monthly_invoices).forEach
                    (
                        leaseagrm_id=>monthly_invoices[leaseagrm_id] = 
                        {
                            leaseagrm: this.PopulateRentInformation
                            (
                                {
                                    revenue_type: 
                                    {
                                        id: this.user_input.rent_id, 
                                        name: this.monthly_invoices[leaseagrm_id].revenue_types[this.user_input.rent_id]
                                    }, 
                                    price: this.monthly_invoices[leaseagrm_id].rent_amount, 
                                    rent_information: this.monthly_invoices[leaseagrm_id].leaseagrm, 
                                    user_input: this.user_input, 
                                    leaseagrm_id: leaseagrm_id
                                }
                            ), 
                            utilities: this.monthly_invoices[leaseagrm_id].utilities.map
                            (
                                utility=>
                                (
                                    {
                                        ...utility, 
                                        name: `${this.monthly_invoices[leaseagrm_id].apartment_name} - ${this.monthly_invoices[leaseagrm_id].revenue_types[utility.revenue_type_id]} ${this.DateReformatDisplay(utility.previous_date)}`, 
                                        revenue_type: this.monthly_invoices[leaseagrm_id].revenue_types[utility.revenue_type_id]
                                    }
                                )

                            )
                        }
                    ); 
                    Object.keys(monthly_invoices).forEach(leaseagrm_id=>monthly_invoices[leaseagrm_id].total = [...monthly_invoices[leaseagrm_id].leaseagrm, ...monthly_invoices[leaseagrm_id].utilities].reduce((accumulator, current_value)=>(accumulator + Number(current_value.amount.replaceAll(",",""))), 0)); 
                    this.monthly_invoices_display = monthly_invoices; 
                }   
                catch
                {
                    this.monthly_invoices_display = {}; 
                } 
            }  
        },
        template: 
        `
            <div>
                <h1>Add monthly invoices</h1>
                <vs-collapse accordion>
                    <vs-collapse-item 
                        v-for="leaseagrm_id in Object.keys(monthly_invoices_display)"
                        v-if="monthly_invoices_display[leaseagrm_id].total"
                    >
                        <h5 slot="header" class="text-info">{{monthly_invoices[leaseagrm_id].name}}</h5>

                        <div class="row">
                            <h6 class="col text-right">{{monthly_invoices[leaseagrm_id].leaseagrm_name}}</h6>
                        </div>

                        <div class="row">
                            <text-input name="name" v-model="monthly_invoices[leaseagrm_id].name" title="Invoice Name"></text-input>
                        </div>
                        <hr>
                        <div v-if="monthly_invoices_display[leaseagrm_id].leaseagrm.length>0" class="container-fluid">
                            <h6>Rent</h6>
                            <leaseagrm-row 
                                v-for="rent in monthly_invoices_display[leaseagrm_id].leaseagrm" 
                                :revenue_type="rent"
                                :user_input="user_input"
                                @new-value-change-valid="NewValueChangeValid" 
                            ></leaseagrm-row>
                        </div>

                        <div v-if="monthly_invoices_display[leaseagrm_id].utilities.length>0" class="container-fluid">
                            <h6>Utilities</h6>
                            <utilities-row v-for="utility in monthly_invoices_display[leaseagrm_id].utilities" v-bind="utility"></utilities-row>
                        </div>
                    </vs-collapse-item>
                </vs-collapse>
            </div>
        `
    }
); 