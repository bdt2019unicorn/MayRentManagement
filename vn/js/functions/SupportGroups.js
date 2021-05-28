class ConnectComponent
{
    static All = (component_class) => this.Router(this.Store(component_class))
    static Router = (component_class) => ReactRouterDOM.withRouter(component_class)
	static Store = (component_class) => ReactRedux.connect(PageSetup.MapStateToProps, PageSetup.MapDispatchToProps)(component_class)
}

class DateReformat 
{
    static MomentDate = (string = undefined) => string ? moment(string) : moment()
    static Database = (string = undefined) => this.MomentDate(string).format("YYYY-MM-DD") 
    static Display = (string = undefined) => this.MomentDate(string).format("DD/MM/YYYY")
}