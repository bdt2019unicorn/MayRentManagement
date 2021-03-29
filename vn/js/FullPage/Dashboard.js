class Dashboard extends BaseComponent 
{
    render()
    {
        return (
            <AuthorizedComponent>
                <div>
                    Dashboard 
                    <pre>
                        {JSON.stringify(this.props, null, 2)}
                    </pre>
                </div>
            </AuthorizedComponent>
        ); 
    }
}