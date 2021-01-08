var document_mixin = 
{
    data: ()=> ({select_data_bind: undefined, in_progress: false}),
    mixins: [support_mixin],  
    created() 
    {
        let select_data_bind = this.AjaxRequest(this.ServerUrl({command: "SelectDataBind"})); 
        this.select_data_bind = JSON.parse(select_data_bind); 
    },
    methods: 
    {
        ServerUrl(params)
        {
            return `server/document_controller/action.php?building_id=${this.$route.params.building_id}&${this.SearchQueryString(params)}`; 
        }, 
        async SubmitDocumentData({url, form_data, success_alert, reset_function})
        {
            var file = form_data.get("file"); 
            var chunk_size = 2048; 
            this.in_progress = 1; 
            if(file.size>chunk_size)
            {
                var folder = `${file.name}-${Math.random().toFixed(4) * 1000}`; 
                console.log(folder); 
                UploadFile = (part, start_slice)=>
                {
                    const percentage = 98.0; 
                    let url = "server/document_controller/upload"; 
                    var next_slice = start_slice + chunk_size + 1; 
                    var blob = file.slice(start_slice, next_slice); 
                    let data = new FormData(); 
                    data.append("blob", blob); 
                    data.append("folder", folder); 
                    data.append("part", part); 

                    this.AjaxRequest
                    (
                        url, 
                        data, 
                        "POST", 
                        ()=> this.in_progress = next_slice/file.size * percentage
                    ); 
                    if(next_slice<file.size)
                    {
                        UploadFile(part+1, next_slice); 
                    }
                    else 
                    {
                        this.AjaxRequest(url, new FormData(), "POST"); 
                    }
                }; 
                // ToBase64 = (file)=> new Promise 
                // (
                //     (resolve, reject)=>
                //     {
                //         const reader = new FileReader();
                //         reader.readAsDataURL(file);
                //         reader.onload = () => resolve(reader.result);
                //         reader.onerror = error => reject(error);
                //     }
                // ); 

                // var base64 = await ToBase64(file); 
                // form_data.set("file", base64); 
            }

            // var test = form_data.getAll("file"); 
            // console.log(test); 

            // if(Number(result))
            // {
            //     alert(success_alert); 
            //     reset_function(); 
            // }
            // else
            // {
            //     alert("There seems to be a server error, please try again"); 
            // }
        }
    } 
}