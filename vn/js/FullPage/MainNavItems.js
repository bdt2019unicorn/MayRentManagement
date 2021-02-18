class DropdownMenu extends BaseComponent
{
    constructor(props)
    {
        super(props); 
        this.Methods = {...this.Methods, ...BaseComponent.Methods}; 
        BindFunctions(this); 
        this.state = {element: null}; 
    }
    Methods = 
    {
        DropDownMenuStyles()
        {
            return {
                width: this.state.element.offsetWidth, 
                position: "absolute", 
                display: "block"
            }; 
        }
    }
    render()
    {
        var ClickAwayListener = MaterialUI.ClickAwayListener; 
        var MenuList = MaterialUI.MenuList; 
        var MenuItem = MaterialUI.MenuItem; 
        var Link = ReactRouterDOM.Link; 
        return (
            <React.Fragment>
                <button type="button" className="btn btn-outline width-full" onClick={()=>this.setState({element: this.props.reference.current})}>{this.props.text}</button>
                {
                    this.state.element &&
                    (
                        <MaterialUI.Paper style={this.DropDownMenuStyles()}>
                            <ClickAwayListener onClickAway={()=>this.setState({element: null})}>
                                <MenuList>
                                    {
                                        this.props.menu_list.map
                                        (
                                            ({to, text, callback})=> 
                                            {
                                                let key = Math.random() + encodeURIComponent(text); 
                                                return callback? <MenuItem key={key}><button className="btn width-full" onClick={callback}>{text}</button></MenuItem> : <MenuItem key={key}><a href={to}>{text}</a></MenuItem>; 
                                            }
                                        )
                                    }
                                </MenuList>
                            </ClickAwayListener>
                        </MaterialUI.Paper>
                    )
                }
            </React.Fragment>
        ); 
    }
}

class MainNavItems extends BaseComponent 
{
    constructor(props)
    {
        super(props); 
        this.Methods = {...this.Methods, ...BaseComponent.Methods}; 
        BindFunctions(this); 
        this.state = 
        {
            building_menu: null 
        }; 
        this.building_menu_ref = React.createRef(); 
        this.user_information_ref = React.createRef(); 
    }
    render()
    {
        var Grid = MaterialUI.Grid; 
        var Link = ReactRouterDOM.Link; 
        var test_building = 
        [
            {to: "#", text: "Buidling Test"}, 
            {to: "#", text: "Buidling Test"}, 
            {to: "#", text: "Buidling Test"}, 
            {to: "#", text: "Buidling Test"}, 
            {to: "#", text: "Buidling Test"}, 
            {to: "#", text: "Buidling Test"}
        ]; 

        var user_information = 
        [
            {to: "#", text: "Manage Information"}, 
            {to: "#", text: "Đăng xuất", callback: ()=>console.log("test")}
        ]; 
        return (
            <Grid container>
                <Grid className="p-3" item xs={3}>
                    {/* <Link to="/dashboard"> */}
                        <img src="../img/logo.png" alt="logo" />
                    {/* </Link> */}
                </Grid>
                <Grid className="p-1" item container xs={6} justify="center">
                    <Grid item xs={8} ref={this.building_menu_ref}>
                        <DropdownMenu text="Buildings" reference={this.building_menu_ref} menu_list={test_building} />
                    </Grid>
                </Grid>
                <Grid className="pt-1 pr-3" item container xs={3} justify="flex-end">
                    <Grid item xs={8} ref={this.user_information_ref}>
                        <DropdownMenu text="test" reference={this.user_information_ref} menu_list={user_information} />
                    </Grid>
                </Grid>
            </Grid>
        ); 
    }
}


MainNavItems = ConnectComponentToStore(MainNavItems); 