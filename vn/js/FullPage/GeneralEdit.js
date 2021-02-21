class GeneralEdit extends AuthorizedComponent 
{
    constructor(props)
    {
        super(props); 
        ExtendFromBaseComponent(this); 
        this.state = {edit: true}; 
        let super_methods = super.props; 
        console.log(super_methods); 

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
        let redirect_component = this.CheckLogin();
        if(redirect_component)
        {
            return redirect_component; 
        }
        return (this.state.edit?<Edit {...this.EditDataBind()} />: null); 
    }
}
GeneralEdit = ConnectComponentToAll(GeneralEdit); 