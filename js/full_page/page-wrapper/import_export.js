Vue.component 
(
    "import-export", 
    {
        data()
        {
            return {
                excel_data: [], 
                excel_input: true 
            }
        }, 
        mixins: [support_mixin], 
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
                this.excel_data = json_data.filter(row=>row["__EMPTY"]==undefined); 
                new Promise
                (
                    (resolve, reject)=>
                    {
                        this.excel_input = false; 
                        resolve(); 
                    }
                ).then 
                (
                    ()=>
                    {
                        this.excel_input = true; 
                    }
                ); 
            }, 

            SendData()
            {
                let result = this.SubmitData("excel", this.ImportUrl,this.excel_data); 
                if(result==true)
                {
                    alert("data imported"); 
                    this.excel_data = []; 
                    this.$refs['excel_input'].value=""; 
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
            <div class="import-export-layout container-fluid">

                <a class="btn" style="grid-area: template-btn;" :href='"excel_templates/" + $route.params.controller + "-template.xlsx"'>
                    <p>Download Excel Template</p>
                    <i style="font-size: xx-large;" class="fas fa-file-excel"></i>
                </a>

                <a class="btn" style="grid-area: import-btn;" href="javascript:void(0);" @click.prevent="$refs['excel_input'].click()">
                    <p>Import Excel File</p>
                    <i style="font-size: xx-large;" class="fas fa-file-import"></i>
                </a>
                <input 
                    v-if="excel_input"
                    type="file" 
                    hidden 
                    ref="excel_input" 
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                    @change="ReadExcel"
                >

                <scrolling-table tb_style="grid-area: scrolling-div;" v-if="this.excel_data.length>0" :table_data="excel_data"></scrolling-table>

                <submit-button title="Import Data" style="grid-area: next-btn;" v-show="this.excel_data.length>0" @submit-button-clicked="SendData"></submit-button>

            </div>

        `
    }
); 