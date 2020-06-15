var import_export = Vue.component 
(
    "import-export", 
    {
        data()
        {
            return {
                excel_data: null
            }
        }, 
        computed: 
        {
            DownloadHref()
            {
                return "excel_templates/" + window.store_track.state.controller + "-template.xls"; 
            }    
        },
        methods: 
        {
            async ReadExcel()
            {
                var file = this.$refs['excel_input'].files[0]; 
                if(!file)
                {
                    return; 
                }
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
                this.excel_data = json_data; 
            }, 

            SendData()
            {
                var data = new FormData(); 
                data.append("excel",JSON.stringify(this.excel_data)); 
                var url = "server/import_controller/" + window.store_track.state.controller + ".php"; 
                var result = AjaxRequest(url, data, "post"); 
                if(result==true)
                {
                    alert("data imported"); 
                    this.excel_data = null; 
                    this.$refs['excel_input'].value=""; 
                } 
                else 
                {
                    console.log(result); 
                    alert("Data import error"); 
                }   
            },

            ImportExcel()
            {
                this.$refs['excel_input'].click(); 
            }
        },
        template: 
        `
            <div class="import-export-layout container-fluid">

                <a 
                    class="btn" 
                    style="grid-area: template-btn;"
                    :href="DownloadHref"
                >
                    <p>Download Excel Template</p>
                    <i style="font-size: xx-large;" class="fas fa-file-excel"></i>
                </a>

                <a 
                    class="btn" 
                    style="grid-area: import-btn;"
                    href="javascript:void(0);" 
                    @click.prevent="ImportExcel"
                >
                    <p>Import Excel File</p>
                    <i style="font-size: xx-large;" class="fas fa-file-import"></i>
                </a>
                <input 
                    type="file" 
                    hidden 
                    ref="excel_input" 
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    @change="ReadExcel"
                >

                <scrolling-table
                    tb_style="grid-area: scrolling-div;"
                    v-show="this.excel_data!=null"
                    :excel_data="this.excel_data"
                >
                </scrolling-table>

                <button 
                    class="btn" 
                    type="button" 
                    style="grid-area: next-btn;" 
                    title="Import Data"
                    v-show="this.excel_data!=null"
                    @click="SendData"
                >
                    <i style="font-size: xx-large;" class="fas fa-arrow-alt-circle-right"></i>
                </button>

            </div>

        `
    }
); 


