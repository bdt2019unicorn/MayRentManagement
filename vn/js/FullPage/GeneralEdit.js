class GeneralEdit extends BaseComponent 
{
    constructor(props)
    {
        super(props); 
        BindFunctions(this); 
        this.state = {edit: true}; 
    }
    Methods = 
    {
        EditDataBind()
        {
            if(!this.state.edit)
            {
                return undefined; 
            }
            let controller = this.CurrentController(); 
            if(!controller)
            {
                return undefined; 
            }
            let surfix = "Thay đổi "; 
            let title = "Thông tin người dùng"; 
            let object_id = this.props.user_id; 
            let user_input_json = undefined; 
            if(controller!="user")
            {
                // let data = (controller=="buildings")? this.StateObject("building_user_input") : AjaxRequest(`../server/controller/dashboard/general_edit.php?controller=${controller}`); 
                // console.log(data); 
            }
            return {
                controller, 
                form_title: surfix + title, 
                object_id, 
                user_input_json,
                container_width: "md"
            }; 
        }
    }
    render()
    {
        return (
            <AuthorizedComponent>'
                {this.state.edit?<Edit {...this.EditDataBind()} />: null}
            </AuthorizedComponent>
        ); 
    }
}
GeneralEdit = ConnectComponent.All(GeneralEdit); 