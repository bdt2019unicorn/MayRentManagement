var dashboard = Vue.component
(
    "dashboard", 
    {
        mixins: [support_mixin], 
        data()
        {
            return {
                leaseagrm: [], 
                revenue_expense: 
                {
                    revenue: [], 
                    expense: []
                }
            }
        }, 
        created() 
        {
            let data = this.AjaxRequest("server/dashboard_controller/dashboard.php"); 
            data = JSON.parse(data); 
            Object.keys(data).forEach(key=>this[key] = data[key]); 
        },

        template: 
        `
            <vs-row vs-justify="center">
                <vs-col vs-w="10">
                    <vs-tabs alignment="fixed">

                        <vs-tab label="Contract need attention">
                            <problem-leaseagrms :leaseagrm="leaseagrm"></problem-leaseagrms>
                        </vs-tab>
                        
                        <vs-tab label="Buildings">
                            <buildings></buildings>
                        </vs-tab>

                        <vs-tab label="Income/Expense Types">
                            <div>Need to have 2 tables showing the expense and income types, potentially do it like a to do list</div>
                        </vs-tab>

                        <vs-tab label="Backup/Restore Data">
                            <backup-restore-data></backup-restore-data>
                        </vs-tab>
                    </vs-tabs>
                </vs-col>
            </vs-row>
        `
    }
); 