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
        components: {vuejsDatepicker}, 
        created() 
        {
            this.LoadOldLeases(); 
        },
        methods: 
        {
            LoadOldLeases()
            {
                let url = `server/overview_controller/resolve_old_contract.php?command=LoadOldLeases&building_id=${this.$route.params.building_id}`; 
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
            ShowDetailsButtonBind(show_details)
            {
                return {
                    color: "success", 
                    type: "flat", 
                    icon: show_details?"remove": "add", 
                    title: (show_details?"Hide ": "Show ") + "Details"
                }
            }
        },
        template: 
        `
            <div class="container-fluid">
                <h1>Old Contracts To Resolve Payment</h1>
                <template v-if="old_leases.length">
                    <div class="container-fluid border border-info my-2" v-for="{id, name, Rent_amount, Start_date, Finish, date_charged_until, show_details, ...rest} in old_leases">
                        <div class="row">
                            <div class="col-3">
                                <h5 class="text-info">{{name}}</h5>
                            </div>
                            <div class="col">
                                <p><b>Paid Until: </b>                
                                <vuejs-datepicker 
                                    calendar-class="calendar-right-align" 
                                    input-class="form-control" 
                                    format="dd/MM/yyyy" 
                                    v-model="date_charged_until" 
                                ></vuejs-datepicker></p>
                            </div>
                            <div class="col-1">
                                <vs-button v-bind="ShowDetailsButtonBind(show_details)" @click="show_details=!show_details"></vs-button>
                            </div>
                        </div>
                        <template v-if="show_details">
                            <div class="row">
                                <div class="col">
                                    <b>Contract Start Date</b>
                                </div>
                                <div class="col">
                                    <b>Contract End Date</b>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <p>{{DateReformatDisplay(Start_date)}}</p>
                                </div>
                                <div class="col">
                                    <p>{{DateReformatDisplay(Finish)}}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <b>Rent Amount</b>
                                </div>
                                <div class="col">
                                    <b>Paid Until</b>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <p>{{Rent_amount}}</p>
                                </div>
                                <div class="col">
                                </div>
                            </div>
                        </template>
                    </div>
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