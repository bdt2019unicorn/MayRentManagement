Vue.component
(
    "add-monthly-invoices", 
    {
        mixins: [support_mixin, rent_invoice_mixin, valid_invoice_details_mixin], 
        data() 
        {
            return {
                monthly_invoices: {}
            }
        },
        computed: 
        {
            MonthlyInvoices()
            {
                try 
                {
                    let monthly_invoices = {}; 
                    Object.keys(this.monthly_invoices).forEach(leaseagrm_id=>monthly_invoices[leaseagrm_id] = {leaseagrm: [], utilities: []}); 
                    
                }   
                catch
                {
                    return {}; 
                } 
            }
        },
        created() 
        {
            var url = `server/invoice_controller/action.php?command=AddMonthlyInvoices&building_id=${this.$route.params.building_id}`; 
            let monthly_invoices = this.AjaxRequest(url); 
            this.monthly_invoices = JSON.parse(monthly_invoices); 
        },

        template: 
        `
            <div>
                <h1>Add monthly invoices </h1>
                <vs-collapse accordion>
                    <vs-collapse-item v-for="leaseagrm_id in Object.keys(monthly_invoices)">
                        <h5 slot="header" class="text-info">{{monthly_invoices[leaseagrm_id].name}}</h5>
                        <div v-if="monthly_invoices[leaseagrm_id].utilities.length>0" class="container-fluid">
                            <h6>Utilities</h6>
                            <utilities-row 
                                v-for="utility in monthly_invoices[leaseagrm_id].utilities" 
                                v-bind="utility"
                                :revenue_type="monthly_invoices[leaseagrm_id].revenue_types[utility.revenue_type_id]"
                                :name=
                                "
                                    monthly_invoices[leaseagrm_id].apartment_name + 
                                    ' - ' + 
                                    monthly_invoices[leaseagrm_id].revenue_types[utility.revenue_type_id] + 
                                    ' ' + 
                                    DateReformatDisplay(utility.previous_date)
                                "
                            ></utilities-row>

                        </div>
                    </vs-collapse-item>
                </vs-collapse>
            </div>
        `
    }
); 