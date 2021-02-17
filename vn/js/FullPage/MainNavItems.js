class MainNavItems extends BaseComponent 
{
    render()
    {
        var Grid = MaterialUI.Grid; 
        var Link = ReactRouterDOM.Link; 

        return (
            <Grid container>
                <Grid className="p-1" item xs={3}>
                    <MaterialUI.Grid className="p-3" container>
                        {/* <Link to="/dashboard"> */}
                            <img src="../img/logo.png" alt="logo" />
                        {/* </Link> */}
                    </MaterialUI.Grid>
                </Grid>
                <Grid className="p-1" item container xs={6} justify="center">
                    <Grid item xs={8}>
                        <button type="button" className="btn btn-outline width-full">Buildings</button>
                    </Grid>
                </Grid>
                <Grid className="p-1" item xs={3}>
                    use information dropdown
                </Grid>
            </Grid>
        ); 
    }
}