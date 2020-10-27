Vue.component 
(
    "import-export", 
    {
        mixins: [support_mixin], 
        data()
        {
            return {
                excel_data: []
            }
        }, 
        components: {...vueGoodTable, ...vueFragment, FileUpload: VueUploadComponent}, 
        computed: 
        {
            DisplayTable()    
            {
                return (this.excel_data.length==0)? undefined: 
                {
                    rows: this.excel_data, 
                    columns: Object.keys(this.excel_data[0]).map 
                    (
                        column=>
                        (
                            {
                                field: column, 
                                label: column, 
                                sortable: true, 
                                thClass: 'text-center' 
                            }
                        )
                    ), 
                    paginationOptions: 
                    {
                        enabled: true, 
                        perPage: 10, 
                        perPageDropdown: [10], 
                        dropdownAllowAll: false 
                    }, 
                    styleClass: "vgt-table condensed bordered", 
                    theme: "nocturnal" 
                }
            }
        },
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
                this.excel_data = json_data.filter(row=>row["__EMPTY"]==undefined); 
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
                        <vs-button color="primary" type="border" icon="table_view" :href='"excel_templates/" + $route.params.controller + "-template.xlsx"'>Download Excel Template</vs-button>
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
                <template v-if="DisplayTable">
                    <vs-row vs-align="center" vs-justify="center" vs-type="flex">
                        <vs-col vs-w="11">
                            <vue-good-table v-bind="DisplayTable"></vue-good-table>
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