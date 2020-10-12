var invoices_mixin = 
{
    mixins: [support_mixin], 
    data() 
    {
        return {
            revenue_type: 
            {
                leaseagrm: [], 
                utilities: []
            }, 
            user_input: {}
        }; 
    },
    created() 
    {
        this.user_input = this.AjaxRequest("server/user_input_controller/invoice.json"); 
        let revenue_types = this.AjaxRequest(this.OverviewDataUrl("revenue_type")); 
        revenue_types = JSON.parse(revenue_types); 
        this.revenue_type.utilities = revenue_types.filter(revenue_type=>Number(revenue_type.is_utility)); 
        this.revenue_type.leaseagrm = revenue_types.filter(revenue_type=>!this.revenue_type.utilities.includes(revenue_type)); 
    },
}; 

var rent_invoice_mixin = 
{
    mixins: [support_mixin], 
    methods: 
    {
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
        
        PopulateRentInformation({revenue_type, price, rent_information, user_input, leaseagrm_id=undefined})
        {
            let details = 
            {
                display: true, 
                revenue_type_id: revenue_type.id, 
                title: revenue_type.name, 
                valid: true, 
                price: Number(price)
            }; 

            if(leaseagrm_id)
            {
                details.leaseagrm_id = leaseagrm_id; 
            }

            let populate_rent_information = rent_information.map
            (
                ({start_date, end_date})=>
                {
                    let row = R.clone(user_input.invoice_details.leaseagrm.form); 
                    row[0].date_data.big_date.lock = Boolean(end_date); 
                    let rent_end_date = end_date||this.invoice_information.leaseagrm["end_date"]; 
                    return {
                        ...details, 
                        start_date: start_date, 
                        end_date: rent_end_date, 
                        quantity: this.RentQuantityCalculation(start_date, rent_end_date), 
                        row: row 
                    }
                }
            ); 

            return populate_rent_information.map
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
    },
}

var user_input_invoice_component_mixin = 
{
    props: ["edit_data", "invoice_information", "list", "revenue_type"], 
    mixins: [support_mixin], 
    data() 
    {
        return {
            invoice_details: []
        }; 
    },
    created() 
    {
        this.PopulateList(this.list);     
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
    }
}

var valid_invoice_details_mixin = 
{
    methods: 
    {
        ValidInvoiceDetailsLeaseagrm(invoice_details)
        {
            if(!invoice_details.length)
            {
                return false; 
            }

            let leaseagrm = invoice_details.filter 
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

            return (leaseagrm.length<invoice_details.length)?false: leaseagrm; 
        }, 
        ValidInvoiceDetailsUtilities(invoice_details)
        {
            return invoice_details.map 
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
}