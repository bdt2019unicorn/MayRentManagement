Vue.component
(
    "resolve-old-lease", 
    {
        mixins: [support_mixin, rent_invoice_mixin], 
        data() 
        {
            return {
                old_leases: []
            }
        },
        components: {vuejsDatepicker, ...bootstrap}, 
        computed: 
        {
            OldLeasesValid()
            {
                let old_leases_submit = this.old_leases.filter(leaseagrm=>!this.DateChargedUntilInvalid(leaseagrm)); 
                return (old_leases_submit.length==this.old_leases.length)?old_leases_submit.map
                (
                    ({Start_date, date_charged_until, Rent_amount, ...rest})=>
                    {
                        let quantity = this.RentQuantityCalculation(Start_date, date_charged_until)
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
                    this.old_leases = JSON.parse(data).map(leaseagrm=>({...leaseagrm, show_details: false})); 
                }
                catch
                {
                    this.old_leases = []; 
                }
            }, 
            ServerUrl(command)
            {
                return `server/overview_controller/resolve_old_contract.php?command=${command}&building_id=${this.$route.params.building_id}`; 
            }, 
            ShowDetailsButtonBind(show_details)
            {
                return {
                    class: "float-right", 
                    color: "success", 
                    type: "flat", 
                    icon: show_details?"remove": "add", 
                    title: (show_details?"Hide ": "Show ") + "Details"
                }
            }, 
            SubmitOldLeases()
            {
                let url = this.ServerUrl("ResolveOldLeases"); 
                var result = this.SubmitData("old_leases", url, this.OldLeasesValid); 
                if(Number(result))
                {
                    
                }
            }, 
            TableDetailsBind(index)
            {
                var leaseagrm = this.old_leases[index]; 
                return {
                    headVariant: "dark", 
                    tableVariant: "primary", 
                    fields: 
                    [
                        {
                            key: "Start_date",
                            label: 'Contract Start Date' 
                        }, 
                        {
                            key: "date_charged_until",
                            label: 'Paid Until', 
                            variant: this.DateChargedUntilInvalid(leaseagrm)? "danger": undefined
                        }, 
                        {
                            key: "Finish",
                            label: 'Contract End Date' 
                        }, 
                        {
                            key: "Rent_amount",
                            label: 'Rent Amount' 
                        }, 
                        {
                            key: "total_amount",
                            label: 'Total Amount Paid' 
                        }, 
                    ], 
                    items: [leaseagrm].map 
                    (
                        ({id, name, Rent_amount, Start_date, Finish, date_charged_until, show_details, ...rest})=>
                        (
                            {
                                Start_date: this.DateReformatDisplay(Start_date), 
                                date_charged_until: this.DateReformatDisplay(date_charged_until), 
                                Finish: this.DateReformatDisplay(Finish), 
                                Rent_amount: Rent_amount, 
                                total_amount: Rent_amount * this.RentQuantityCalculation(Start_date, date_charged_until)
                            }
                        )
                    )
                }
            }
        },
        template: 
        `
            <div class="container-fluid">
                <h1>Old Contracts To Resolve Payment</h1>
                <template v-if="old_leases.length">
                    <div class="container-fluid border border-info my-2" v-for="({id, name, show_details, ...rest}, index) in old_leases">
                        <div class="row">
                            <div class="col-3">
                                <h5 class="text-info">  
                                    <b-button title="Delete" class="mx-1" variant="danger" @click="old_leases.splice(index,1)"><b-icon icon="trash"></b-icon></b-button>
                                    {{name}}
                                </h5>

                            </div>
                            <div class="col">
                                <vuejs-datepicker 
                                    calendar-class="calendar-right-align" 
                                    input-class="form-control" 
                                    format="dd/MM/yyyy" 
                                    v-model="old_leases[index].date_charged_until" 
                                ></vuejs-datepicker>
                            </div>
                            <div class="col-1">
                                <vs-button v-bind="ShowDetailsButtonBind(show_details)" @click="old_leases[index].show_details=!old_leases[index].show_details"></vs-button>
                            </div>
                        </div>
                        <b-container fluid v-if="show_details">
                            <br>
                            <b-row align-h="center">
                                <b-col cols="11">
                                    <b-table v-bind="TableDetailsBind(index)"></b-table>
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