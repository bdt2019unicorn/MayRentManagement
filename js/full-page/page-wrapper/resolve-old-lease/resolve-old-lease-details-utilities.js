Vue.component
(
    "resolve-old-lease-details-utilities", 
    {
        props: ["leaseagrm"], 
        mixins: [support_mixin], 
        components: {...bootstrap}, 
        computed: 
        {
            TableUtilitiesAmount()
            {
                return Object.values(this.Utilities).flatMap(utility_reading=>Object.values(utility_reading)).reduce((accumulator, {amount})=> accumulator+Number(amount), 0); 
            }, 
            Utilities()
            {
                return this.leaseagrm.utilities; 
            }
        },
        template: 
        `
            <b-table-simple hover caption-top>
                <caption><h4 class="text-center">Utilities</h4></caption>
                <b-thead head-variant="dark">
                    <b-tr>
                        <b-th>Utility Name</b-th>
                        <b-th>Start Date</b-th>
                        <b-th>End Date</b-th>
                        <b-th>Price</b-th>
                        <b-th>Quantity</b-th>
                        <b-th class="text-right">Amount</b-th>
                    </b-tr>
                </b-thead>
                <b-tbody>
                    <template v-for="utility in Object.keys(Utilities)">
                        <b-tr v-for="(utility_reading, index) in Object.values(Utilities[utility])">
                            <b-th v-if="index==0" :rowspan="Object.keys(Utilities[utility]).length">{{utility}}</b-th>
                            <b-td>{{DateReformatDisplay(utility_reading.previous_date)}}</b-td>
                            <b-td>{{DateReformatDisplay(utility_reading.date)}}</b-td>
                            <b-td>{{utility_reading.price}}</b-td>
                            <b-td>{{utility_reading.quantity}}</b-td>
                            <b-td class="text-right">{{utility_reading.amount}}</b-td>
                        </b-tr>
                    </template>
                </b-tbody>
                <b-tfoot>
                    <b-tr>
                        <b-td colspan="6" variant="secondary" class="text-right">
                            <b>{{TableUtilitiesAmount}}</b>
                        </b-td>
                    </b-tr>
                </b-tfoot>
            </b-table-simple>
        `
    }
); 