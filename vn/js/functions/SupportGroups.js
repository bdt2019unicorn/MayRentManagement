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
        TimeDatabase: "HH:mm:ss", 
        TimeDisplay: "HH:mm"
    }; 
    static ConvertFormatDisplay = (string) => this.Database(moment(string, this.Formats.DateDisplay))
    static ConvertTimeDisplay = (string) => moment(string, this.Formats.TimeDisplay).format(this.Formats.TimeDatabase)
    static Database = (string = undefined) => this.MomentDate(string).format(this.Formats.DateDatabase) 
    static Display = (string = undefined) => this.MomentDate(string).format(this.Formats.DateDisplay)
    static MomentDate = (string = undefined) => string ? moment(string) : moment()
    static TimeDisplay = (string = undefined) => this.MomentDate(string).format(this.Formats.TimeDisplay)
    static Database = (string = undefined) => this.MomentDate(string).format("YYYY-MM-DD") 
    static Display = (string = undefined) => this.MomentDate(string).format("DD/MM/YYYY")
}

class UserInformation 
{
    static ExecFunctionUserInformation(func)
    {
        try 
        {
            func("username", sessionStorage.getItem("username")); 
            func("modified_time", moment().format("YYYY-MM-DD HH:MM:ss")); 
        }
        catch {}
    }
    static Header = (request) => this.ExecFunctionUserInformation(request.setRequestHeader.bind(request))
    static Submit = (form_data) => this.ExecFunctionUserInformation(form_data.append.bind(form_data))
}