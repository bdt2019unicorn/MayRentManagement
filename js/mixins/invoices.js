var invoices_mixin = 
{
    mixins: [support_mixin], 
    data() 
    {
        return {
            leaseagrm_select_data: [], 
            main_url: "server/invoice_controller/action.php?command=", 
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
        let config = this.AjaxRequest(`${this.main_url}InvoiceConfigs&building_id=${this.$route.params.building_id}`); 
        try 
        {
            config = JSON.parse(config); 
            Object.keys(config).forEach(key=>this[key]=config[key]); 
        }
        catch {}
    },
}; 

var rent_invoice_mixin = 
{
    mixins: [support_mixin], 
    methods: 
    {
        RentQuantityCalculation(start_period, end_period)
        {
            [start_period, end_period] = [start_period, end_period].map(period=>moment(period)); 
            let [str_start, str_end] = [start_period, end_period].map(moment_object=>this.DateReformatDatabase(moment_object)); 
            if(str_start==str_end)
            {
                return 0; 
            }
            start_period.subtract(1, "days"); 
            return end_period.diff(start_period, "months", true).toFixed(3); 
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
                        price: numeral(revenue_type.price).value()>0,
                        quantity: revenue_type.quantity>0, 
                        amount: numeral(revenue_type.amount).value()>0
                    }
                    return this.ValidObject(validation); 
                }
            ).map 
            (
                ({amount, display, valid, title, row, leaseagrm_id, ...rest})=>
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
            var valid_details = invoice_details.filter
            (
                ({amount, ...rest})=> numeral(amount).value()>0
            ); 
            return (valid_details.length<invoice_details.length)? false: 
            invoice_details.map 
            (
                ({revenue_type, date, previous_date, number, previous_number, id, unit_id, ...rest})=>
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