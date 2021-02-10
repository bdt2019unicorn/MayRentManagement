class PageWrapper extends BaseComponent
{
    render()
    {
        if(!(this.props.username && this.props.user_id))
        {
            return <ReactRouterDOM.Redirect to="/page-administration/login" />; 
        }
        return (
            <div>page wrapper</div>
        ); 
    }
}

PageWrapper = ConnectComponentToStore(PageWrapper); 