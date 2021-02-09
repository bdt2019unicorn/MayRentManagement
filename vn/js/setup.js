class Setup 
{
    constructor()
    {
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
    innitial_state = 
    {
        username: "", 
        user_id: 0, 
        buildings_data: [], 
        building_user_input: {}
    }; 
    Methods = 
    {
        ChangeState(state, {state_name, value})
        {
            return {...state, [state_name]: value}; 
        }
    }
    FullPage()
    {
        var Provider = ReactRedux.Provider; 
        var store = Redux.createStore(this.reducer, this.innitial_state); 
        var Page = ReactRedux.connect()(FullPage); 
        return <Provider store={store}><Page /></Provider>; 
    }
}

var setup = new Setup(); 
ReactDOM.render(setup.FullPage(), document.getElementById("full_page"));