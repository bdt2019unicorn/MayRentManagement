Vue.component
(
    "invoice-leaseagrm", 
    {
        props: ["user_input"], 
        mixins: [user_input_invoice_component_mixin], 
        computed: 
        {
            ValidInvoiceDetails()
            {
                if(!this.invoice_details.length)
                {
                    return false; 
                }

                let leaseagrm = this.invoice_details.filter 
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
                        return this.ValidObject(validation); 
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

                return (leaseagrm.length<this.invoice_details.length)?false: leaseagrm; 
            }    
        },
        created() 
        {
            this.$emit("input", this.ValidInvoiceDetails); 
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
                        this.invoice_details = [...leaseagrm_details, ...additional_details].sort((a, b)=> ((a.revenue_type_id>b.revenue_type_id)?1: -1)); 
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
            }
        },
        template: 
        `
            <div class="row">
                <div class="col">
                    <h4>Rent and other cost</h4>
                    <template v-for="revenue_type in invoice_details">
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
        `
    }
); 