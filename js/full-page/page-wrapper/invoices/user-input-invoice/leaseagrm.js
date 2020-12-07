Vue.component
(
    "leaseagrm-row", 
    {
        props: ["revenue_type", "user_input"], 
        template: 
        `
            <div>
                <br>
                <form v-if="revenue_type.display">
                    <div class="row">
                        <text-input :edit_data="revenue_type" name="name" v-on="$listeners"></text-input>
                        <div class="col text-center"><h5>{{revenue_type.title}}</h5></div>
                        <div class="col text-right"><b>{{revenue_type.amount}}</b></div>
                    </div>
                    <row-group 
                        :row="revenue_type.row" 
                        :edit_data="revenue_type" 
                        v-on="$listeners" 
                        :lock="Number(revenue_type.revenue_type_id)==user_input.rent_id?user_input.invoice_details.leaseagrm.rent_lock:undefined"
                    ></row-group>
                </form>
                <hr>
            </div>
        `
    }
); 

Vue.component
(
    "invoice-leaseagrm", 
    {
        props: ["user_input"], 
        mixins: [user_input_invoice_component_mixin, rent_invoice_mixin, valid_invoice_details_mixin], 
        computed: 
        {
            ValidInvoiceDetails()
            {
                return this.ValidInvoiceDetailsLeaseagrm(this.invoice_details); 
            }    
        },
        methods: 
        {
            NewValueChangeValid(edit_data, name, new_value, reactive=false)
            {
                new Promise
                (
                    (resolve, reject)=>
                    {
                        var change_index = undefined; 
                        for (let index = 0; index < this.invoice_details.length; index++) 
                        {
                            if(this.invoice_details[index].revenue_type_id==edit_data.revenue_type_id)
                            {
                                change_index = index; 
                                this.invoice_details[index].display = reactive; 
                                this.invoice_details[index][name] = new_value; 
                                if(this.invoice_details[index].revenue_type_id==this.user_input.rent_id)
                                {
                                    this.invoice_details[index].quantity = this.RentQuantityCalculation(this.invoice_details[index].start_date, this.invoice_details[index].end_date); 
                                }
                                this.invoice_details[index].amount = this.NumeralFormat(this.invoice_details[index].quantity * this.invoice_details[index].price); 
                                break; 
                            }
                        }
                        resolve(change_index); 
                    }
                ).then 
                (
                    change_index=>
                    {
                        this.invoice_details[change_index].display = true; 
                    }
                ); 
            }, 

            PopulateList(value)
            {
                new Promise
                (
                    (resolve, reject)=>
                    {
                        let revenue_type_ids = value.map(revenue_type=>revenue_type.id); 
                        let leaseagrm_details = this.invoice_details.filter(details=>(revenue_type_ids.includes(details.revenue_type_id))); 
                        this.invoice_details = []; 
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
                                        return R.clone(details); 
                                    }
                                }


                                return (revenue_type.id==this.user_input.rent_id) ? 
                                this.PopulateRentInformation
                                (
                                    {
                                        revenue_type: revenue_type, 
                                        price: this.invoice_information.leaseagrm["rent_amount"], 
                                        rent_information: this.invoice_information.leaseagrm.rent_information, 
                                        user_input: this.user_input
                                    }
                                ): 
                                [
                                    {
                                        display: true, 
                                        revenue_type_id: revenue_type.id, 
                                        title: revenue_type.name, 
                                        valid: true, 
                                        start_date: this.invoice_information.leaseagrm["start_date"], 
                                        end_date: this.invoice_information.leaseagrm["end_date"], 
                                        price: 0, 
                                        quantity: 1, 
                                        name: `${revenue_type.name} (${this.DateReformatDisplay(this.invoice_information.leaseagrm["start_date"])} - ${this.DateReformatDisplay(this.invoice_information.leaseagrm["end_date"])})`, 
                                        amount: 0, 
                                        row: this.user_input.invoice_details.leaseagrm.form
                                    }
                                ]; 
                            }
                        );                        
                        this.invoice_details = [...leaseagrm_details, ...additional_details].sort((a, b)=> ((a.revenue_type_id>b.revenue_type_id)?1: -1)); 
                    }
                ); 
            }
        },
        template: 
        `
            <div class="row">
                <div class="col">
                    <h4>Rent and other cost</h4>
                    <leaseagrm-row 
                        v-for="revenue_type in invoice_details"
                        :revenue_type="revenue_type"
                        :user_input="user_input"
                        @new-value-change-valid="NewValueChangeValid" 
                    ></leaseagrm-row>
                </div>
            </div>
        `
    }
); 