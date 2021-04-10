var dashboard = Vue.component
(
    "dashboard", 
    {
        mixins: [support_mixin], 
        data: ()=>
        (
            {
                leaseagrm: [], 
                revenue_expense: 
                {
                    revenue: [], 
                    expense: []
                }
            }
        ), 
        created()
        {
            this.GenerateData(); 
        }, 

        methods: 
        {
            GenerateData()
            {
                let data = this.AjaxRequest("server/dashboard_controller/dashboard.php"); 
                data = JSON.parse(data); 
                Object.keys(data).forEach(key=>this[key] = data[key]); 
            }    
        },

        template: 
        `
            <vs-row vs-justify="center">
                <vs-col vs-w="10">
                    <vs-tabs alignment="fixed">

                        <vs-tab label="Contract need attention">
                            <problem-leaseagrms 
                                :leaseagrm="leaseagrm" 
                                @problem-leaseagrm-deleted="leaseagrm=arguments[0]" 
                                @delete-duplicate="GenerateData"
                            ></problem-leaseagrms>
                        </vs-tab>
                        
                        <vs-tab label="Buildings">
                            <buildings></buildings>
                        </vs-tab>

                        <vs-tab label="Basic Calculation Units">
                            <basic-calculations-units></basic-calculations-units>
                        </vs-tab>

                        <vs-tab label="Backup/Restore Data">
                            <backup-restore-data @restore-success="GenerateData"></backup-restore-data>
                        </vs-tab>
                    </vs-tabs>
                </vs-col>
            </vs-row>
        `
    }
); 