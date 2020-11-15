Vue.component
(
    "resolve-old-lease", 
    {
        mixins: [support_mixin], 
        data() 
        {
            return {
                old_leases: []
            }
        },
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
                    this.old_leases = JSON.parse(data); 
                }
                catch
                {
                    this.old_leases = []; 
                }
            }
        },
        template: 
        `
            <div class="container-fluid">
                <h1>Old Contracts To Resolve Payment</h1>
                <template v-if="old_leases.length">
                    
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