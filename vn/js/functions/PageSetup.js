class PageSetup 
{
    constructor()
    {
        this.innitial_state = 
        {
            username: "", 
            user_id: 0, 
            current_controller: undefined, 
            current_building: undefined, 
            buildings_data: [], 
            building_user_input: UserInputForm("buildings") 
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
    static MapStateToProps = state => state; 
    static MapDispatchToProps = 
    {
        ChangeState: ({state_name, value})=>({type: "ChangeState", payload:{state_name, value}}), 
        Authorize: ({username, user_id})=>({type: "Authorize", payload: {username, user_id}})
    } 
    FullPage()
    {
        var Provider = ReactRedux.Provider; 
        var store = Redux.createStore(this.reducer, this.innitial_state); 
        var Page = ConnectComponentToStore(FullPage); 
        return <Provider store={store}><Page /></Provider>; 
    }
}