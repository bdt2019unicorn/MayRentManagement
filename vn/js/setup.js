class Setup 
{
    constructor()
    {
        let buildings = AjaxRequest("../server/overview_controller/overview_controller.php?overview_controller=buildings"); 
        this.innitial_state = 
        {
            username: "", 
            user_id: 0, 
            buildings_data: JSON.parse(buildings), 
            building_user_input: BaseComponent.Methods.LoadForm("buildings")
        }; 
        this.reducer = (state = this.innitial_state, action)=>
        {
            try 
            {
                return this.Methods[action.type](state, action.payload); 
            }
            catch (error)
            {
                return state; 
            }
        }
    }
    Methods = 
    {
        ChangeState(state = this.innitial_state, {state_name, value})
        {
            return {...state, [state_name]: value}; 
        }, 
        Authorize(state = this.innitial_state, {username, user_id})
        {
            var payload = {username, user_id}; 
            Object.keys(payload).forEach(key=> sessionStorage.setItem(key, payload[key])); 
            return {...state, ...payload}; 
        }
    }
    ConnectPage()
    {
        const MapStateToProps = state => state; 
        const MapDispatchToProps = 
        {
            ChangeState: ({state_name, value})=>({type: "ChangeState", payload:{state_name, value}}), 
            Authorize: ({username, user_id})=>({type: "Authorize", payload: {username, user_id}})
        }; 
        return ReactRedux.connect(MapStateToProps, MapDispatchToProps)(FullPage); 
    }
    FullPage()
    {
        var Provider = ReactRedux.Provider; 
        var store = Redux.createStore(this.reducer, this.innitial_state); 
        var Page = this.ConnectPage(); 
        return <Provider store={store}><Page /></Provider>; 
    }
}

new Promise 
(
    (resolve, reject)=>
    {
        let result = AjaxRequest("../server/admin_database.php?command=CheckEnvironment"); 
        resolve(result); 
    }
).then 
(
    (result)=>
    {
        if(Number(result))
        {
            var setup = new Setup(); 
            ReactDOM.render(setup.FullPage(), document.getElementById("full_page"));
        }
        else 
        {
            window.location.href = "../admin/setup.php"; 
        }
    }
); 
