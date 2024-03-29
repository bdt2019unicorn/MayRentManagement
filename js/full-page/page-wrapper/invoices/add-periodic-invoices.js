Vue.component
(
    "add-periodic-invoices", 
    {
        mixins: [rent_invoice_mixin, valid_invoice_details_mixin], 
        data: () =>
        (
            {
                periodic_invoices: {}, 
                periodic_invoices_display: {}, 
                title: "Add Periodic Invoices", 
                user_input: {}
            }
        ),
        computed: 
        {
            PeriodicInvoicesSubmit()
            {
                try 
                {
                    let periodic_invoices = []; 
                    for (const leaseagrm_id in this.periodic_invoices_display) 
                    {
                        let leaseagrm = this.ValidInvoiceDetailsLeaseagrm(this.periodic_invoices_display[leaseagrm_id].leaseagrm); 
                        let utilities = this.ValidInvoiceDetailsUtilities(this.periodic_invoices_display[leaseagrm_id].utilities); 
                        if(!R.isEmpty(leaseagrm) || !R.isEmpty(utilities))
                        {
                            periodic_invoices.push
                            (
                                {
                                    invoice: 
                                    {
                                        name: this.periodic_invoices[leaseagrm_id].name, 
                                        leaseagrm_id: leaseagrm_id
                                    }, 
                                    details: {leaseagrm, utilities}
                                }
                            ); 
                        }
                    }
                    return R.isEmpty(periodic_invoices) ? false: periodic_invoices;
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
            this.PeriodicInvoices(); 
        },
        methods: 
        {
            PeriodicInvoices()
            {
                let periodic_invoices = this.ServerJson(`${this.user_input.main_url}AddPeriodicInvoices&building_id=${this.$route.params.building_id}`) || {}; 
                let end_of_month = moment().endOf("month"); 
                for (const leaseagrm_id in periodic_invoices) 
                {
                    let { lease_end, leaseagrm, leaseagrm_period, utilities } = periodic_invoices[leaseagrm_id]; 
                    lease_end = moment(lease_end); 

                    leaseagrm = leaseagrm.map 
                    (
                        ({start_date, end_date}) => 
                        {
                            if(!end_date)
                            {
                                let new_end_date = R.clone(moment.min(lease_end, end_of_month)); 
                                let quantity = this.RentQuantityCalculation(start_date, new_end_date, leaseagrm_period); 
                                if(quantity>1)
                                {
                                    end_date = this.DateReformatDatabase(new_end_date); 
                                }
                            }
                            return { start_date, end_date }; 
                        }
                    ).filter(({end_date})=>end_date); 

                    if(R.isEmpty([...leaseagrm, ...utilities]))
                    {
                        delete periodic_invoices[leaseagrm_id]; 
                    }
                    else 
                    {
                        periodic_invoices[leaseagrm_id].leaseagrm = leaseagrm; 
                    }
                }

                this.periodic_invoices = periodic_invoices; 
            }, 
            NewValueChangeValid(edit_data, name, new_value)
            {
                for (let index = 0; index < this.periodic_invoices_display[edit_data.leaseagrm_id].leaseagrm.length; index++) 
                {
                    if(R.equals(this.periodic_invoices_display[edit_data.leaseagrm_id].leaseagrm[index], edit_data))
                    {
                        this.periodic_invoices_display[edit_data.leaseagrm_id].leaseagrm[index][name] = new_value; 
                        break; 
                    }
                }
            }, 
            Submit()
            {
                let url = "server/controller/invoice/post.php?command=AddPeriodicInvoices"; 
                let result = this.SubmitData("periodic_invoices", url, this.PeriodicInvoicesSubmit);
                if(Number(result))
                {
                    alert(`${this.title} Success!`); 
                    this.PeriodicInvoices(); 
                }
                else 
                {
                    alert(`${this.title} Fails! Please try again later.`); 
                }
            }   
        },
        watch: 
        {
            periodic_invoices: function(new_value, old_value)
            {
                try 
                {
                    let periodic_invoices = {}; 
                    for (const leaseagrm_id in this.periodic_invoices) 
                    {
                        let leaseagrm = this.PopulateRentInformation
                        (
                            {
                                revenue_type: 
                                {
                                    id: this.user_input.rent_id, 
                                    name: this.periodic_invoices[leaseagrm_id].revenue_types[this.user_input.rent_id]
                                }, 
                                price: this.periodic_invoices[leaseagrm_id].rent_amount, 
                                rent_information: this.periodic_invoices[leaseagrm_id].leaseagrm, 
                                leaseagrm_period: this.periodic_invoices[leaseagrm_id].leaseagrm_period, 
                                user_input: this.user_input, 
                                leaseagrm_id: leaseagrm_id
                            }
                        ); 
                        let utilities = this.periodic_invoices[leaseagrm_id].utilities.map 
                        (
                            utility=>
                            (
                                {
                                    ...utility, 
                                    name: `${this.periodic_invoices[leaseagrm_id].unit_name} - ${this.periodic_invoices[leaseagrm_id].revenue_types[utility.revenue_type_id]} ${this.DateReformatDisplay(utility.previous_date)}`, 
                                    revenue_type: this.periodic_invoices[leaseagrm_id].revenue_types[utility.revenue_type_id]
                                }
                            )
                        ); 
                        let total = [...leaseagrm, ...utilities].reduce((accumulator, current_value)=>(accumulator + Number(current_value.amount.toString().replaceAll(",",""))), 0); 
                        if(total)
                        {
                            periodic_invoices[leaseagrm_id] = 
                            {
                                leaseagrm, 
                                utilities, 
                                total, 
                                leaseagrm_period: this.periodic_invoices[leaseagrm_id].leaseagrm_period
                            }; 
                        }
                    }
                    this.periodic_invoices_display = periodic_invoices; 
                }   
                catch
                {
                    this.periodic_invoices_display = undefined; 
                } 
            }  
        },
        template: 
        `
            <div class="container-fluid">
                <h1>{{title}}</h1>
                <template v-if="periodic_invoices_display">

                    <vs-collapse accordion>
                        <vs-collapse-item 
                            v-for="leaseagrm_id in Object.keys(periodic_invoices_display)"
                            v-if="periodic_invoices_display[leaseagrm_id].total"
                        >

                            <h5 slot="header" class="text-info">{{periodic_invoices[leaseagrm_id].name}}</h5>
                            <div class="row"><h6 class="col text-right">{{periodic_invoices[leaseagrm_id].leaseagrm_name}}</h6></div>
                            <div class="row"><text-input name="name" v-model="periodic_invoices[leaseagrm_id].name" title="Invoice Name"></text-input></div>

                            <hr>
                            <div v-if="periodic_invoices_display[leaseagrm_id].leaseagrm.length" class="container-fluid">
                                <h6>Rent - Period: {{periodic_invoices_display[leaseagrm_id].leaseagrm_period}}</h6>
                                <leaseagrm-row 
                                    v-for="rent in periodic_invoices_display[leaseagrm_id].leaseagrm" 
                                    :revenue_type="rent"
                                    :user_input="user_input"
                                    @new-value-change-valid="NewValueChangeValid" 
                                ></leaseagrm-row>
                            </div>

                            <div v-if="periodic_invoices_display[leaseagrm_id].utilities.length" class="container-fluid">
                                <h6>Utilities</h6>
                                <utilities-row v-for="utility in periodic_invoices_display[leaseagrm_id].utilities" v-bind="utility"></utilities-row>
                            </div>
                        </vs-collapse-item>
                    </vs-collapse>
                    <section v-if="PeriodicInvoicesSubmit" class="row">
                        <div class="col text-right"><submit-button :title="title" @submit-button-clicked="Submit"></submit-button></div>
                    </section>
                </template>

                <div class="container-fluid" v-else>
                    <br>
                    <div class="row">
                        <div class="col"></div>
                        <div class="col-6 border border-info">
                            <h3 class="text-danger text-center">All invoices for this month has been created</h3>
                        </div>
                        <div class="col"></div>
                    </div>
                </div>
                
            </div>
        `
    }
); 