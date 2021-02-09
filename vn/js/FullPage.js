/*

class TestReduxStore extends React.Component
{
    render() 
    {
        var ChangeTestVar = ()=>
        {
            var value = encodeURIComponent(Math.random().toString()); 
            this.props.ChangeTestVar(value); 
        }; 
        return (
            <div>
                <h1>{this.props.test || "currently waiting for new value"}</h1>
                <button type="button" onClick={ChangeTestVar}>Change the value </button>
            </div>
        ); 
    }
}


const MapStateToProps = state => 
{
    console.log(state); 
    return {test: state.test}; 
}; 

const MapDispatchToProps = 
{
    ChangeTestVar: (value)=>
    (
        {
            type: "ChangeTestVar", 
            payload: value 
        }
    )
}; 

var TestReduxStoreConnect = ReactRedux.connect(MapStateToProps, MapDispatchToProps)(TestReduxStore); 

const innitial_state = {test: "I am the first test var", not_related: "totally not related"}; 

const reducer = (state = innitial_state, action)=>
{
    console.log("reducer"); 
    console.log(state, action); 
    switch (action.type) 
    {
        case "ChangeTestVar":
            return {...state, test: action.payload}
        default:
            return state; 
    }
}

const redux_store = Redux.createStore(reducer, innitial_state); 

ReactDOM.render
(
    <ReactRedux.Provider store={redux_store}>
        <TestReduxStoreConnect />
    </ReactRedux.Provider>,
    document.getElementById('test_div')
); 
*/



class FullPage extends BaseComponent 
{
    constructor(props)
    {
        super(props); 
        var url = "../server/overview_controller/overview_controller.php?overview_controller=buildings"; 
        let buildings = AjaxRequest(url); 
        this.state = 
        {
            // buildings: JSON.parse(buildings) 
        }; 
    }

    render()
    {
        // let buildings = this.state.buildings.map(building=><p key={building.id}>{JSON.stringify(building)}</p>); 
        let Switch = ReactRouterDOM.Switch; 
        let Route = ReactRouterDOM.Route; 
        return (
            <ReactRouterDOM.HashRouter>
                {/* <ImportExcel /> */}
                {/* {buildings} */}
                <Switch>
                    <Route component={PageAdministration} exact path="/page-administration/" />
                    <Route component={PageAdministration} path="/page-administration/:controller" />
                </Switch>
            </ReactRouterDOM.HashRouter>
        ); 
    }
}