class Dashboard extends AuthorizedComponent 
{
    render()
    {
        let redirect_component = this.CheckLogin();
        if(redirect_component)
        {
            return redirect_component; 
        }
        return (
            <div>
                dashboard
            </div>
        ); 
    }
}

Dashboard = ConnectComponentToStore(Dashboard); 