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
                    ({id, name, Start_date, date_charged_until, leaseagrm_period, Rent_amount, utilities})=>
                    {
                        let quantity = this.RentQuantityCalculation(Start_date, date_charged_until, leaseagrm_period); 
                        let amount = Rent_amount * quantity; 
                        let date_charged_until_moment = moment(date_charged_until); 
                        let utilities_details = Object.values(utilities).flatMap(object=>Object.values(object)).filter(({date})=>moment(date)<=date_charged_until_moment).map 
                        (
                            ({utility_reading_id, revenue_type_id, price, quantity, amount, revenue_type, date, previous_date})=>
                            (
                                {
                                    name: `${name} - Resolve ${revenue_type} Period ${this.DateReformatDisplay(previous_date)} - ${this.DateReformatDisplay(date)}`, 
                                    utility_reading_id, revenue_type_id, price, quantity, amount
                                }
                            )
                        ); 
                        let utilities_total = utilities_details.reduce((accumulator, {amount})=> accumulator + Number(amount), 0); 
                        return {
                            id, 
                            name, 
                            start_date: Start_date, 
                            date_charged_until: this.DateReformatDatabase(date_charged_until), 
                            price: Rent_amount, 
                            quantity,  
                            amount: amount.toFixed(3), 
                            utilities: utilities_details, 
                            total: utilities_total + amount
                        }; 
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
                let old_leases = JSON.parse(data).map(leaseagrm=>({...leaseagrm, show_details: false})); 
                for (let index = 0; index < old_leases.length; index++) 
                {
                    console.groupCollapsed(index); 
                    console.log(old_leases[index]); 
                    let { Start_date, date_charged_until, leaseagrm_period} = old_leases[index]; 
                    let quantity = this.RentQuantityCalculation(Start_date, date_charged_until, leaseagrm_period); 
                    console.log(quantity, typeof(quantity)); 
                    let diff = Math.floor(quantity); 
                    console.log(diff); 
                    if(diff<quantity)
                    {
                        let end_date = this.RentRevertCalculation(Start_date, diff, leaseagrm_period); 
                        old_leases[index].date_charged_until = end_date; 
                    }
                }
                this.old_leases = old_leases; 
            }, 
            ServerUrl(command)
            {
                return `server/controller/overview/resolve_old_contract.php?command=${command}&building_id=${this.$route.params.building_id}`; 
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
                                    <span :class='DateChargedUntilInvalid(leaseagrm)? "text-danger": undefined'><b>Paid Until: </b>{{DateReformatDisplay(leaseagrm.date_charged_until)}}</span>
                                </b-col>
                                <b-col cols="11">
                                    <resolve-old-lease-details-rent
                                        :date_invalid="DateChargedUntilInvalid(leaseagrm)"
                                        :leaseagrm="leaseagrm"
                                        :leaseagrm_periods="leaseagrm_periods"
                                    ></resolve-old-lease-details-rent>

                                    <resolve-old-lease-details-utilities :leaseagrm="leaseagrm"></resolve-old-lease-details-utilities>

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