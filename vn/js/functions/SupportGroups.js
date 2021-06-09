class ConnectComponent
{
    static All = (component_class) => this.Router(this.Store(component_class))
    static Router = (component_class) => ReactRouterDOM.withRouter(component_class)
	static Store = (component_class) => ReactRedux.connect(PageSetup.MapStateToProps, PageSetup.MapDispatchToProps)(component_class)
}

class DateReformat 
{
    static ConvertFormatDisplay = (string) => this.Database(moment(string, "DD MMM YYYY"))
    static ConvertTimeDisplay = (string) => moment(string, "HH:mm").format("HH:mm:ss")
    static Database = (string = undefined) => this.MomentDate(string).format("YYYY-MM-DD") 
    static Display = (string = undefined) => this.MomentDate(string).format("DD/MM/YYYY")
    static MomentDate = (string = undefined) => string ? moment(string) : moment()
    static TimeDisplay = (string = undefined) => this.MomentDate(string).format("HH:mm")
}