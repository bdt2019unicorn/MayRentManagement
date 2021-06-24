class ConnectComponent
{
    static All = (component_class) => this.Router(this.Store(component_class))
    static Router = (component_class) => ReactRouterDOM.withRouter(component_class)
	static Store = (component_class) => ReactRedux.connect(PageSetup.MapStateToProps, PageSetup.MapDispatchToProps)(component_class)
}

class DateReformat 
{
    static Formats = 
    {
        DateDatabase: "YYYY-MM-DD", 
        DateDisplay: "DD/MM/YYYY", 
        DateTimeDatabase: "YYYY-MM-DD HH:MM:ss", 
        MonthDisplay: "MMM YYYY", 
        TimeDatabase: "HH:mm:ss", 
        TimeDateDisplay: "hh:mmA, Do MMM YYYY", 
        TimeDisplay: "HH:mm"
    }; 
    static ConvertFormatDisplay = (string) => this.Database(moment(string, this.Formats.DateDisplay))
    static ConvertTimeDisplay = (string) => moment(string, this.Formats.TimeDisplay).format(this.Formats.TimeDatabase)
    static Database = (string = undefined) => this.MomentDate(string).format(this.Formats.DateDatabase) 
    static DateTimeDatabase = (string = undefined) => this.MomentDate(string).format(this.Formats.DateTimeDatabase)    
    static Display = (string = undefined) => this.MomentDate(string).format(this.Formats.DateDisplay)
    static MomentDate = (string = undefined) => string ? moment(string) : moment()
    static TimeDateDisplay = (string = undefined) => this.MomentDate(string).format(this.Formats.TimeDateDisplay) 
    static TimeDisplay = (string = undefined) => this.MomentDate(string).format(this.Formats.TimeDisplay)
}

class Permissions 
{
    AddEdit = undefined; 
    Admin = undefined; 
    constructor({add_edit, import_excel})
    {
        this.AddEdit = Boolean(Number(add_edit)); 
        this.Admin = Boolean(Number(add_edit) && Number(import_excel)); 
    }
}

class UserInformation 
{
    static ExecFunctionUserInformation(func)
    {
        try 
        {
            func("username", sessionStorage.getItem("username")); 
            func("modified_time", DateReformat.DateTimeDatabase()); 
        }
        catch {}
    }
    static Header = (request) => this.ExecFunctionUserInformation(request.setRequestHeader.bind(request))
    static Submit = (form_data) => this.ExecFunctionUserInformation(form_data.append.bind(form_data))
}