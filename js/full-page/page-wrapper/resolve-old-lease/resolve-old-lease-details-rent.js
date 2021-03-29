Vue.component
(
    "resolve-old-lease-details-rent", 
    {
        props: ["date_invalid", "leaseagrm"], 
        mixins: [support_mixin, rent_invoice_mixin], 
        components: {...bootstrap}, 
        computed: 
        {
            TableLeaseagrmBind()
            {
                var quantity = this.RentQuantityCalculation(this.leaseagrm.Start_date, this.leaseagrm.date_charged_until, this.leaseagrm.leaseagrm_period); 
                return {
                    captionTop: true, 
                    headVariant: "dark", 
                    tableVariant: "primary", 
                    fields: 
                    [
                        {
                            key: "start_date",
                            label: 'Contract Start Date' 
                        }, 
                        {
                            key: "date_charged_until",
                            label: 'Paid Until', 
                            variant: this.date_invalid? "danger": undefined
                        },
                        {
                            key: "leaseagrm_period", 
                            label: "Lease Agreement Period"
                        },  
                        {
                            key: "Rent_amount",
                            label: 'Rent Amount' 
                        }, 
                        {
                            key: "quantity", 
                            label: "Quantity"
                        }, 
                        {
                            key: "total_amount",
                            label: 'Total Amount Paid', 
                            class: "text-right font-weight-bold"
                        }, 
                    ], 
                    items: 
                    [
                        {
                            ...this.leaseagrm, 
                            start_date: this.DateReformatDisplay(this.leaseagrm.Start_date), 
                            date_charged_until: this.DateReformatDisplay(this.leaseagrm.date_charged_until), 
                            quantity, 
                            total_amount: this.leaseagrm.Rent_amount * quantity
                        }
                    ]
                }
            }
        },
        template: 
        `
            <b-table v-bind="TableLeaseagrmBind">
                <template #table-caption>
                    <h4 class="text-center">Rent</h4>
                </template>
            </b-table>

        `
    }
); 