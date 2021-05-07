Vue.component
(
    "add-monthly-invoices", 
    {
        mixins: [rent_invoice_mixin, valid_invoice_details_mixin], 
        data: () =>
        (
            {
                monthly_invoices: {}, 
                monthly_invoices_display: {}, 
                title: "Add Monthly Invoices", 
                user_input: {}
            }
        ),
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
                    ).map 
                    (
                        ({invoice, details})=>
                        (
                            {
                                invoice: invoice, 
                                details: details, 
                                total_details: Object.values(details).reduce((accumulator, current_value)=>(accumulator + current_value.length), 0)
                            }
                        )
                    ).filter(({total_details, ...rest})=>total_details); 
                    return monthly_invoices.length>0? monthly_invoices: false; 
                }   
                catch
                {
                    return false; 
                } 
            }
        },
        created() 
        {
            this.user_input = this.AjaxRequest("server/json/user_input/en/invoice.json"); 
            this.MonthlyInvoices(); 
        },
        methods: 
        {
            MonthlyInvoices()
            {
                var url = `${this.user_input.main_url}AddMonthlyInvoices&building_id=${this.$route.params.building_id}`; 
                let monthly_invoices = this.AjaxRequest(url); 
                this.monthly_invoices = JSON.parse(monthly_invoices); 
            }, 
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
            }, 
            Submit()
            {
                let url = "server/controller/invoice/post.php?command=AddMonthlyInvoices"; 
                let result = this.SubmitData("monthly_invoices", url, this.MonthlyInvoicesSubmit);
                if(Number(result))
                {
                    alert(`${this.title} Success!`); 
                    this.MonthlyInvoices(); 
                }
                else 
                {
                    alert(`${this.title} Fails! Please try again later.`); 
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
                                    leaseagrm_period: this.monthly_invoices[leaseagrm_id].leaseagrm_period, 
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
                                        name: `${this.monthly_invoices[leaseagrm_id].unit_name} - ${this.monthly_invoices[leaseagrm_id].revenue_types[utility.revenue_type_id]} ${this.DateReformatDisplay(utility.previous_date)}`, 
                                        revenue_type: this.monthly_invoices[leaseagrm_id].revenue_types[utility.revenue_type_id]
                                    }
                                )
                            )
                        }
                    ); 
                    Object.keys(monthly_invoices).forEach(leaseagrm_id=>monthly_invoices[leaseagrm_id].total = [...monthly_invoices[leaseagrm_id].leaseagrm, ...monthly_invoices[leaseagrm_id].utilities].reduce((accumulator, current_value)=>(accumulator + Number(current_value.amount.toString().replaceAll(",",""))), 0)); 
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
            <div class="container-fluid">
                <h1>{{title}}</h1>
                <template v-if="Object.keys(monthly_invoices_display).length">

                    <vs-collapse accordion>
                        <vs-collapse-item 
                            v-for="leaseagrm_id in Object.keys(monthly_invoices_display)"
                            v-if="monthly_invoices_display[leaseagrm_id].total"
                        >

                            <h5 slot="header" class="text-info">{{monthly_invoices[leaseagrm_id].name}}</h5>
                            <div class="row"><h6 class="col text-right">{{monthly_invoices[leaseagrm_id].leaseagrm_name}}</h6></div>
                            <div class="row"><text-input name="name" v-model="monthly_invoices[leaseagrm_id].name" title="Invoice Name"></text-input></div>

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
                    <section v-if="MonthlyInvoicesSubmit" class="row">
                        <div class="col text-right"><submit-button :title="title" @submit-button-clicked="Submit"></submit-button></div>
                    </section>
                </template>

                <div class="container-fluid" v-else>
                    <br>
                    <div class="row">
                        <div class="col"></div>
                        <div class="col-6 border border-info">
                            <h3 class="text-danger text-center">All monthly invoices for this month has been created</h3>
                        </div>
                        <div class="col"></div>
                    </div>
                </div>
                
            </div>
        `
    }
); 