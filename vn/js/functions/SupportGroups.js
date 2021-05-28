class ConnectComponent
{
    static All = (component_class) => this.Router(this.Store(component_class))
    static Router = (component_class) => ReactRouterDOM.withRouter(component_class)
	static Store = (component_class) => ReactRedux.connect(PageSetup.MapStateToProps, PageSetup.MapDispatchToProps)(component_class)
}