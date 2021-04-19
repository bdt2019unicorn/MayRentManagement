Vue.component 
(
    "import-export", 
    {
        data: ()=>({excel_data: []}), 
        mixins: [support_mixin], 
        components: { ...vueFragment, FileUpload: VueUploadComponent}, 
        methods: 
        {
            async ReadExcel(files)
            {
                if(files.length==0)
                {
                    return; 
                }
                let file = files[0].file; 
                var buffer = await file.arrayBuffer();
                var workbook = XLSX.read
                (
                    buffer,
                    {
                        type: "array"
                    }
                );
                var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                var json_data = XLSX.utils.sheet_to_json
                (
                    worksheet,
                    {
                        raw:false
                    }
                );
                this.excel_data = json_data.filter(row=>row["__EMPTY"]==undefined).map(row=>Object.keys(row).filter(key=>!key.includes("__EMPTY")).reduce((accumulator, current_value)=>({...accumulator, [current_value]:row[current_value]}), {})); 
            }, 

            SendData()
            {
                let result = this.SubmitData("excel", this.ImportUrl,this.excel_data); 
                if(result==true)
                {
                    alert("data imported"); 
                    this.excel_data = []; 
                } 
                else 
                {
                    console.log(result); 
                    alert("Data import error"); 
                }   
            }
        },
        watch: 
        {
            $route: function(to, from)
            {
                this.excel_data = []; 
            }
        },
        template: 
        `
            <fragment>
                <vs-row>
                    <vs-col vs-w="6" vs-align="center" vs-justify="center" vs-type="flex">
                        <vs-button color="primary" type="border" icon="table_view" :href="'server/controller/excel/create_file.php?building_id=' + $route.params.building_id + '&controller=' + $route.params.controller">Download Excel Template</vs-button>
                    </vs-col>
                    <vs-col vs-w="6" vs-align="flex-end" vs-justify="center" vs-type="flex">
                        <vs-button color="success" type="gradient" icon="cloud_download">
                            <file-upload
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                                @input="ReadExcel"
                            >Import Excel file</file-upload>
                        </vs-button>
                    </vs-col>
                </vs-row>
                <br>
                <template v-if="excel_data.length">
                    <vs-row vs-align="center" vs-justify="center" vs-type="flex">
                        <vs-col vs-w="11">
                            <display-table :data="excel_data"></display-table>
                        </vs-col>
                    </vs-row>
                    <br>
                    <vs-row vs-align="flex-end" vs-justify="flex-end" vs-type="flex">
                        <submit-button title="Import Data" @submit-button-clicked="SendData"></submit-button>
                    </vs-row>
                </template>

            </fragment>
        `
    }
); 