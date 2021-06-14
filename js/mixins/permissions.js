var permissions_mixin = 
{
    mixins: [support_mixin], 
    computed: 
    {
        AddEditPermission()
        {
            let {add_edit} = this.PermissonObject; 
            return add_edit; 
        }, 
        AdminPermission()
        {
            let {add_edit, import_excel} = this.PermissonObject; 
            return add_edit && import_excel; 
        }, 
        PermissonObject()
        {
            try 
            {
                let {add_edit, import_excel} = this.StateObject("user_permissions"); 
                return {add_edit, import_excel}; 
            }
            catch 
            {
                return {}; 
            }
        }
    }
}