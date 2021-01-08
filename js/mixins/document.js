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
        SubmitDocumentData({url, form_data, success_alert, reset_function})
        {
            var file = form_data.get("file"); 
            const chunk_size = 2 * Math.pow(10, 6); 
            new Promise
            (
                (resolve, reject)=>
                {
                    this.in_progress = 1; 
                    if(file.size>chunk_size)
                    {
                        resolve(); 
                    }
                    reject("file size is not big enough for this"); 
                }
            )
            .then
            (
                ()=>
                {
                    return new Promise
                    (
                        (resolve, reject)=>
                        {
                            var folder = `${file.name}-${Math.random().toFixed(4) * 10000}`; 
                            reject(folder); 
                        }
                    ); 
                }
            )
            .catch
            (
                (result)=>
                {
                    console.log(result); 
                }
            ); 

        /*
            
            if(file.size>chunk_size)
            {
                var folder = `${file.name}-${Math.random().toFixed(4) * 10000}`; 
                UploadFile = (part, start_slice)=>
                {
                    const percentage = 98.0; 
                    let url = "server/document_controller/upload.php"; 
                    var next_slice = start_slice + chunk_size + 1; 
                    let data = new FormData(); 
                    let end_of_file = false; 
                    if(next_slice>file.size)
                    {
                        next_slice = file.size; 
                        end_of_file = true; 
                        data.append("end_of_file", end_of_file); 
                    }
                    data.append("blob", file.slice(start_slice, next_slice)); 
                    data.append("folder", folder); 
                    data.append("part", part); 

                    var file_path = this.AjaxRequest
                    (
                        url, 
                        data, 
                        "POST", 
                        ()=> this.in_progress = next_slice/file.size * percentage
                    ); 
                    return end_of_file? file_path: UploadFile(part+1, next_slice); 
                }; 
                // var file_path = UploadFile(1, 0); 
                // console.log(file_path); 
                // form_data.set("file", file_path); 
            }

        */

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