var document_mixin = 
{
    data: ()=> ({select_data_bind: undefined, in_process: false}),
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
            $.ajax 
            (
                {
                    url: url, 
                    type: "POST", 
                    data: form_data, 
                    contentType: false,
                    processData: false,
                    enctype: 'multipart/form-data',
                    beforeSend: ()=> this.in_process = true, 
                    success: (result)=>
                    {
                        console.log(result); 
                        return; 
                        if(Number(result))
                        {
                            alert(success_alert); 
                            reset_function(); 
                        }
                        else
                        {
                            alert("There seems to be a server error, please try again"); 
                        }
                    }, 
                    complete: ()=>this.in_process = false 
                }
            );
        }
    } 
}