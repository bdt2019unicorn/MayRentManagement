class PageSetup 
{
    constructor()
    {
        this.innitial_state = 
        {
            username: "", 
            user_id: 0, 
            user_permissions: undefined, 
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
        Authorize(state = this.innitial_state, payload)
        {
            var new_state = 
            { 
                user_permissions: new Permissions(payload)
            }; 
            var KeyAssign = (key, reference=undefined) => 
            {
                let value = _.get(payload, reference || key) || ""; 
                new_state[key] = value; 
                sessionStorage.setItem(key, value); 
            }; 
            KeyAssign("user_id", "id"); 
            KeyAssign("username"); 
            return {...state, ...new_state}; 
        }
    }
    static MapStateToProps = state => state; 
    static MapDispatchToProps = 
    {
        ChangeState: ({state_name, value})=>({type: "ChangeState", payload:{state_name, value}}), 
        Authorize: (payload)=>({type: "Authorize", payload: payload})
    } 
    FullPage()
    {
        var Provider = ReactRedux.Provider; 
        var store = Redux.createStore(this.reducer, this.innitial_state); 
        var Page = ConnectComponent.Store(FullPage); 
        return <Provider store={store}><Page /></Provider>; 
    }
}