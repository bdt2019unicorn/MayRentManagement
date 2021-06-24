class Document extends PageWrapperChildrenComponent
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            select_data_bind: ServerJson(this.ServerUrl({command: "SelectDataBind"})), 
            in_progress: false
        }; 
    }
    ServerUrl = (params, action="action") => `../server/controller/document/${action}.php?building_id=${this.BuildingId()}&${SearchQueryString(params)}`; 
    SubmitDocumentData = ({url, form_data, success_alert, reset_function}) =>
    {
        var file = form_data.get("file"); 
        const chunk_size = 2 * Math.pow(10, 6); 
        var part = 1; 
        new Promise
        (
            (resolve, reject)=>
            {
                this.setState({in_progress: 1}); 
                if(file.size>chunk_size)
                {
                    resolve(); 
                }
                reject(); 
            }
        )
        .then
        (
            ()=>
            {
                var folder = `${file.name}-${Math.ceil(Math.random().toFixed(4) * 10000)}`; 
                let upload_url = this.ServerUrl({command: "UploadFiles"}, "post"); 
                const percentage = 98.0; 
                var UploadFile =(start_slice)=> new Promise
                (
                    (resolve, reject)=>
                    {
                        var next_slice = start_slice + chunk_size + 1; 
                        let data = new FormData(); 
                        let end_of_file = false; 
                        if(next_slice>file.size)
                        {
                            next_slice = file.size; 
                            end_of_file = true; 
                        }
                        data.append("blob", file.slice(start_slice, next_slice)); 
                        data.append("folder", folder); 
                        data.append("part", part); 
                        part++; 

                        const request = new XMLHttpRequest(); 
                        request.open("POST", upload_url, false); 
                        // request.onloadstart = (event) => this.setState({in_progress: next_slice/file.size * percentage}); 
                        // request.onloadstart = (event) => console.log({in_progress: next_slice/file.size * percentage}); 
                        // var test = (event) => console.log({in_progress: next_slice/file.size * percentage}); 
                        // request.onprogress = (event) => console.log({in_progress: next_slice/file.size * percentage}); 
                        // request.addEventListener("progress", test); 
                        request.onload = (temp_folder) => 
                        {
                            this.setState({in_progress: next_slice/file.size * percentage}); 
                            if(end_of_file)
                            {
                                form_data.set("file", temp_folder); 
                                reject(); 
                            }
                            resolve(next_slice); 
                        }; 
                        request.send(data); 
                    }
                ).then(UploadFile); 
                return UploadFile(0); 
            }
        )
        .catch
        (
            (exception)=>
            {
                console.log(exception); return; 
                var result = AjaxRequest(url, form_data, "POST"); 
                if(Number(result))
                {
                    alert(success_alert); 
                    reset_function(); 
                }
                else
                {
                    alert("There seems to be a server error, please try again"); 
                }
                this.setState({in_progress: false}); 
            }
        ); 
    }
}