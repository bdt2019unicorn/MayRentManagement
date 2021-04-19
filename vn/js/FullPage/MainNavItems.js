class DropdownMenu extends BaseComponent
{
    constructor(props)
    {
        super(props); 
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
                display: "block", 
                zIndex: 1000
            }; 
        }
    }
    componentDidUpdate(previous_props, previous_state)
    {
        if
        ( 
            (!this.state.element) || 
            (
                (this.state.element != previous_state.element) && 
                (previous_props.location.pathname == this.props.location.pathname)
            ) 
        )
        {
            return; 
        }
        this.setState({element: null}); 
    }
    render()
    {
        var ClickAwayListener = MaterialUI.ClickAwayListener; 
        var MenuList = MaterialUI.MenuList; 
        var MenuItem = MaterialUI.MenuItem; 
        var Link = ReactRouterDOM.Link; 
        return (
            <React.Fragment>
                <button type="button" className="btn btn-outline width-full" onClick={()=>this.setState({element: this.props.reference.current})}>{this.props.children}</button>
                {
                    this.state.element &&
                    (
                        <MaterialUI.Paper style={this.DropDownMenuStyles()}>
                            <ClickAwayListener onClickAway={()=>this.setState({element: null})}>
                                <MenuList className="dropdown-ul">
                                    {
                                        this.props.menu_list.map
                                        (
                                            ({to, text, callback, special_class})=> 
                                            {
                                                let key = Math.random() + encodeURIComponent(text); 
                                                return callback? 
                                                (
                                                    <MenuItem key={key} className="width-full">
                                                        <button className="btn width-full" onClick={callback}>{text}</button>
                                                    </MenuItem>
                                                ) : 
                                                (
                                                    <MenuItem key={key} className={`${special_class} width-full`}>
                                                        <Link className="width-full text-center" to={to}>{text}</Link>
                                                    </MenuItem>
                                                ); 
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
DropdownMenu = ConnectComponentToRouter(DropdownMenu); 

class MainNavItems extends BaseComponent 
{
    constructor(props)
    {
        super(props); 
        this.state = 
        {
            building_menu: this.props.buildings_data.map
            (
                ({id, name})=> 
                (
                    {
                        id, 
                        to: `/${id}/`, 
                        text: name 
                    }
                )
            ), 
            user_information: 
            [
                {to: "/general-edit/user", text: "Thông tin tài khoản"}, 
                {text: "Đăng xuất", callback: ()=>this.props.Authorize({username: "", user_id: ""})}
            ], 
            logo_src: `../${AjaxRequest("../server/controller/admin_database.php?command=LogoImg")}?q=${Date.now()}`
        }; 
        this.building_menu_ref = React.createRef(); 
        this.user_information_ref = React.createRef(); 
    }
    render()
    {
        var Grid = MaterialUI.Grid; 
        var Link = ReactRouterDOM.Link; 
        return (
            <Grid container>
                <Grid className="p-3" item xs={3}>
                    <Link to="/dashboard">
                        <img src={this.state.logo_src} alt="logo" style={{height: "10vmin"}} />
                    </Link>
                </Grid>
                <Grid className="p-1" item container xs={6} justify="center">
                    <Grid item xs={8} ref={this.building_menu_ref}>
                        <DropdownMenu 
                            reference={this.building_menu_ref} 
                            menu_list=
                            {
                                this.state.building_menu.map
                                (
                                    ({id, ...rest})=> 
                                    (
                                        {
                                            ...rest, 
                                            special_class: (id==this.props.building_id)? "bg-yellow": undefined
                                        }
                                    )
                                )
                            } 
                        >
                            {
                                _.get
                                ( 
                                    this.state.building_menu.find(({id})=>id==this.props.building_id), 
                                    "text"
                                ) || "Danh sách tòa nhà"
                            } 
                        </DropdownMenu>
                    </Grid>
                </Grid>
                <Grid className="pt-1 pr-3" item container xs={3} justify="flex-end">
                    <Grid item xs={8} ref={this.user_information_ref}>
                        <DropdownMenu reference={this.user_information_ref} menu_list={this.state.user_information}>
                            <img src={this.state.logo_src} alt="logo" style={{width: "10vw"}} />
                        </DropdownMenu>
                    </Grid>
                </Grid>
            </Grid>
        ); 
    }
}
MainNavItems = ConnectComponentToAll(MainNavItems); 