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