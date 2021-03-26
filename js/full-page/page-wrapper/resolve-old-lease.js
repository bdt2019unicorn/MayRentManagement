Vue.component
(
    "resolve-old-lease", 
    {
        mixins: [support_mixin, rent_invoice_mixin], 
        data: () => ({old_leases: []}), 
        components: {vuejsDatepicker, ...bootstrap}, 
        computed: 
        {
            OldLeasesValid()
            {
                let old_leases_submit = this.old_leases.filter(leaseagrm=>!this.DateChargedUntilInvalid(leaseagrm)); 
                return (old_leases_submit.length==this.old_leases.length)?old_leases_submit.map
                (
                    ({Start_date, date_charged_until, leaseagrm_period, Rent_amount, ...rest})=>
                    {
                        let quantity = this.RentQuantityCalculation(Start_date, date_charged_until, leaseagrm_period); 
                        return {
                            ...rest, 
                            start_date: Start_date, 
                            date_charged_until: this.DateReformatDatabase(date_charged_until), 
                            price: Rent_amount, 
                            quantity: quantity, 
                            amount: (Rent_amount * quantity).toFixed(3)
                        }
                    }
                ): undefined; 
            }    
        },
        created() 
        {
            this.LoadOldLeases(); 
        },
        methods: 
        {
            DateChargedUntilInvalid(leaseagrm)
            {
                return (!this.ValidPeriod(leaseagrm.Start_date, leaseagrm.date_charged_until) || !this.ValidPeriod(leaseagrm.date_charged_until, leaseagrm.Finish)); 
            }, 
            LoadOldLeases()
            {
                let url = this.ServerUrl("LoadOldLeases"); 
                let data = this.AjaxRequest(url); 
                try 
                {
                    this.OldLeasesJson(data); 
                }
                catch
                {
                    this.old_leases = []; 
                }
            }, 
            OldLeasesJson(data)
            {
                this.old_leases = JSON.parse(data).map(leaseagrm=>({...leaseagrm, show_details: false})); 
            }, 
            ServerUrl(command)
            {
                return `server/overview_controller/resolve_old_contract.php?command=${command}&building_id=${this.$route.params.building_id}`; 
            }, 
            SubmitOldLeases()
            {
                let url = this.ServerUrl("ResolveOldLeases"); 
                var result = this.SubmitData("old_leases", url, this.OldLeasesValid); 
                try 
                {
                    this.OldLeasesJson(result); 
                    alert("Operation success! All old contracts are up to date"); 
                }
                catch 
                {
                    alert("Resolve all contracts fails. There seems like an issue with the server."); 
                }
            }, 
            TableLeaseagrmBind(leaseagrm)
            {
                var quantity = this.RentQuantityCalculation(leaseagrm.Start_date, leaseagrm.date_charged_until, leaseagrm.leaseagrm_period); 
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
                            variant: this.DateChargedUntilInvalid(leaseagrm)? "danger": undefined
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
                            ...leaseagrm, 
                            start_date: this.DateReformatDisplay(leaseagrm.Start_date), 
                            date_charged_until: this.DateReformatDisplay(leaseagrm.date_charged_until), 
                            quantity, 
                            total_amount: leaseagrm.Rent_amount * quantity
                        }
                    ]
                }
            }, 
            TableUtilitiesAmount(leaseagrm)
            {
                var utilities = leaseagrm.utilities; 
                var date_charged_until = moment(leaseagrm.date_charged_until); 
                return Object.values(utilities).map
                (
                    utility_reading=> Object.values(utility_reading).reduce
                    (
                        (accumulator, {amount, date})=> accumulator+(moment(date)<=date_charged_until? Number(amount): 0), 0
                    )
                ).reduce((accumulator, current_value)=>accumulator+current_value, 0); 
            }, 
            TableUtilitiesList(date_charged_until, utilities)
            {
                return Object.values(utilities).filter(({date})=>moment(date)<=moment(date_charged_until)); 
            }
        },
        template: 
        `
            <div class="container-fluid">
                <h1>Old Contracts To Resolve Payment</h1>
                <template v-if="old_leases.length">
                    <div :class="'container-fluid my-2 border ' + (DateChargedUntilInvalid(leaseagrm)?'border-danger': 'border-info')" v-for="(leaseagrm, index) in old_leases">
                        <div class="row">
                            <div class="col-3">
                                <h5 class="text-info">  
                                    <b-button title="Delete" class="mx-1" variant="danger" @click="old_leases.splice(index,1)"><b-icon icon="trash"></b-icon></b-button>
                                    {{leaseagrm.name}}
                                </h5>

                            </div>
                            <div class="col">
                                <vuejs-datepicker 
                                    calendar-class="calendar-right-align" 
                                    input-class="form-control" 
                                    format="dd/MM/yyyy" 
                                    v-model="leaseagrm.date_charged_until" 
                                ></vuejs-datepicker>
                            </div>
                            <div class="col-1">
                                <details-button :show_details="leaseagrm.show_details" @click="old_leases[index].show_details=!old_leases[index].show_details"></details-button>
                            </div>
                        </div>
                        <b-container fluid v-if="leaseagrm.show_details">
                            <b-row align-h="center">
                                <b-col cols="12" class="m-3">
                                    <b>Contract Start Date: </b>{{DateReformatDisplay(leaseagrm.Start_date)}}<br>
                                    <b>Contract End Date: </b>{{DateReformatDisplay(leaseagrm.Finish)}}<br>
                                    <span :class='DateChargedUntilInvalid(leaseagrm)? "danger": undefined'><b>Paid Until: </b>{{DateReformatDisplay(leaseagrm.date_charged_until)}}</span>
                                </b-col>
                                <b-col cols="11">
                                    <b-table v-bind="TableLeaseagrmBind(leaseagrm)">
                                        <template #table-caption>
                                            <h4 class="text-center">Rent</h4>
                                        </template>
                                    </b-table>
                                    
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
                                            <template v-for="utility in Object.keys(leaseagrm.utilities)">
                                                <b-tr v-for="(utility_reading, index) in TableUtilitiesList(leaseagrm.date_charged_until, leaseagrm.utilities[utility])">
                                                    <b-th v-if="index==0" :rowspan="Object.keys(leaseagrm.utilities[utility]).length">{{utility}}</b-th>
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
                                                    <b>{{TableUtilitiesAmount(leaseagrm)}}</b>
                                                </b-td>
                                            </b-tr>
                                        </b-tfoot>
                                    </b-table-simple>
                                </b-col>
                            </b-row>
                        </b-container>
                    </div>
                    <submit-button class="float-right" title="Resolve Old Contracts" v-if="OldLeasesValid" @submit-button-clicked="SubmitOldLeases"></submit-button>
                </template>
                <template v-else>
                    <br>
                    <vs-row vs-align="center" vs-justify="center" vs-type="flex">
                        <vs-col vs-w="6">
                            <div class="border border-warning">
                                <h3 class="text-danger text-center">There are currently no unresolved contract at this building</h3>
                            </div>
                        </vs-col>
                    </vs-row>
                </template>
            </div>
        `
    }
); 