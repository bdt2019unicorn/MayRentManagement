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