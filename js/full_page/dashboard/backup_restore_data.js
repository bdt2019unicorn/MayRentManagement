Vue.component
(
    "backup-data", 
    {
        components: {...bootstrap}, 
        template: 
        `
            <b-button variant="link" href="server/dashboard_controller/backup.php">
                <b-icon-cloud-upload></b-icon-cloud-upload>Download back up file
            </b-button>
        `
    }
); 

Vue.component
(
    "restore-data", 
    {
        mixins: [support_mixin], 
        data() 
        {
            return {
                file: undefined         
            }
        },
        components: {...vueFragment}, 
        methods: 
        {
            Submit()
            {
                let form_data = new FormData(); 
                form_data.append("file", this.file); 
                let url = "server/dashboard_controller/restore.php"; 
                let result = this.AjaxRequest(url, form_data, "post"); 
                if(Number(result))
                {
                    alert("Restore Data success!"); 
                    this.BuildingsData(); 
                    this.$emit("restore-success"); 
                }
                else
                {
                    alert("Restore data fails! Please try again"); 
                }
            }    
        },
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
                <submit-button v-if="file" title="Backup data" @submit-button-clicked="Submit"></submit-button>
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
                    <restore-data v-on="$listeners"></restore-data>
                </b-tab>
            </b-tabs>
        `
    }
); 