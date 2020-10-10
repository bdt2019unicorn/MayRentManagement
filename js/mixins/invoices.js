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