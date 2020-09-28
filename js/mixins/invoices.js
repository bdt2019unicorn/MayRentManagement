var invoices_mixin = 
{
    mixins: [support_mixin], 
    data() 
    {
        return {
            // invoice: 
            // {
            //     leaseagrm_id: undefined, 
            //     name: undefined
            // }, 
            // invoice_details: 
            // {
            //     leaseagrm: [], 
            //     utilities: []
            // }, 
            invoice_information: 
            {
                leaseagrm: {}, 
                utilities: {}
            }, 
            revenue_type: 
            {
                leaseagrm: [], 
                utilities: []
            }, 
            // select_leaseagrm: true, 
            user_input: {}
        }; 
    },
    computed: 
    {
        // InvoiceDetails()
        // {
        //     let invoice_complete = Object.values(this.invoice).map(value=>Boolean(value));
        //     return !invoice_complete.includes(false);  
        // }, 
        // ValidInvoiceDetails()
        // {
        //     let total_details = Object.values(this.invoice_details).reduce((accumulator, current_value)=>(accumulator+current_value.length), 0); 
        //     if(!total_details)
        //     {
        //         return false; 
        //     }
        //     let leaseagrm = this.invoice_details.leaseagrm.filter 
        //     (
        //         revenue_type=>
        //         {
        //             let validation = 
        //             {
        //                 valid: revenue_type.valid, 
        //                 period: this.ValidPeriod(revenue_type.start_date, revenue_type.end_date, true), 
        //                 price: revenue_type.price>=0,
        //                 quantity: revenue_type.quantity>=0, 
        //                 amount: numeral(revenue_type.amount).value()>0
        //             }
        //             return !Object.values(validation).includes(false); 
        //         }
        //     ).map 
        //     (
        //         ({amount, display, valid, title, row, ...rest})=>
        //         {
        //             return {
        //                 amount: amount.toString().replaceAll(",",""), 
        //                 ...rest
        //             }; 
        //         }
        //     ); 

        //     let utilities = this.invoice_details.utilities.map 
        //     (
        //         ({revenue_type, date, previous_date, number, previous_number, id, apartment_id, ...rest})=>
        //         (
        //             {
        //                 utility_reading_id: id, 
        //                 ...rest
        //             }
        //         )
        //     ); 

        //     var valid = 
        //     {
        //         invoice_leaseagrm: leaseagrm, 
        //         invoice_utilities: utilities
        //     }; 

        //     let valid_details = Object.values(valid).reduce((accumulator, current_value)=>(accumulator+ current_value.length),0); 
        //     return (valid_details==total_details)?valid: false; 
        // }
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