class GeneralEdit extends BaseComponent 
{
    constructor(props)
    {
        super(props); 
        this.state = {edit: true}; 
    }
    EditDataBind = () =>
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
            user_input_json = (controller=="buildings")? this.props.building_user_input : ServerJson(`../server/controller/dashboard/general_edit.php?controller=${controller}&lang=vn`);
            object_id = this.ObjectId(); 
            title = _.get(user_input_json, "title"); 
        }
        return {
            controller, 
            form_title: surfix + title, 
            object_id, 
            user_input_json,
            container_width: "md", 
            ChangeState: this.props.ChangeState
        }; 
    }
    render()
    {
        return (
            <AuthorizedComponent>
                {this.state.edit?<Edit {...this.EditDataBind()} />: null}
            </AuthorizedComponent>
        ); 
    }
}
GeneralEdit = ConnectComponent.All(GeneralEdit); 