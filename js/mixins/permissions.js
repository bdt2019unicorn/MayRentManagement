var permissions_mixin = 
{
    mixins: [support_mixin], 
    computed: 
    {
        DataEntryPermission()
        {
            let {add_edit, import_excel, import_excel_utilities, admin_page} = this.PermissonObject; 
            return add_edit && import_excel_utilities; 
        }, 
        ReviewerPermission()
        {
            let {add_edit, import_excel, import_excel_utilities, admin_page} = this.PermissonObject; 
            return add_edit && import_excel && import_excel_utilities && !admin_page;  
        }, 
        SystemAdminPermission()
        {
            let {add_edit, import_excel, import_excel_utilities, admin_page} = this.PermissonObject; 
            return add_edit && import_excel && import_excel_utilities && admin_page; 
        }, 
        PermissonObject()
        {
            BooleanOjbect = (object) => Object.keys(object).reduce 
            (
                (accumulator, current_value) => 
                (
                    {
                        ...accumulator, 
                        [current_value]: Boolean(Number(object[current_value]))
                    }
                ), {}
            ); 
            try 
            {
                let {add_edit, import_excel, import_excel_utilities, admin_page} = this.StateObject("user_permissions"); 
                return BooleanOjbect({add_edit, import_excel, import_excel_utilities, admin_page}); 
            }
            catch 
            {
                return {}; 
            }
        }
    }
}