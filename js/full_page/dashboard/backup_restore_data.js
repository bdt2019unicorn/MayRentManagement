Vue.component
(
    "backup-data", 
    {
        components: {...bootstrap}, 
        template: 
        `
            <b-button variant="link" href="server/dashboard_controller/backup.php">
                <b-icon-cloud-upload></b-icon-cloud-upload>
                Download back up file
            </b-button>
        `
    }
); 

Vue.component
(
    "restore-data", 
    {
        data() 
        {
            return {
                file: undefined         
            }
        },
        components: {...vueFragment}, 
        template: 
        `
            <fragment> 
                <vs-upload 
                    limit="1" 
                    :show-upload-button="false" 
                    text="Upload the restore File" 
                    @change="file = arguments[1][arguments[1].length-1]" 
                    @on-delete="file=undefined" 
                />
                <br>
                <submit-button v-if="file" title="Backup data"></submit-button>
            </fragment>
        `
    }
); 

Vue.component
(
    "backup-restore-data", 
    {
        components: {...bootstrap}, 
        template: 
        `
            <b-tabs content-class="mt-3" justified vertical pills lazy nav-wrapper-class="col-4" nav-class="text-center">
                <b-tab title="Backup">
                    <backup-data></backup-data>
                </b-tab>
                <b-tab title="Restore">
                    <restore-data></restore-data>
                </b-tab>
            </b-tabs>
        `
    }
); 