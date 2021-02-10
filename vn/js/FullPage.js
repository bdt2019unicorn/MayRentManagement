
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
        // var test = ReactRedux.useSelector
        // (
        //     (state)=>
        //     {
        //         console.log(state); 
        //         // return state.test; 
        //         return undefined; 
        //     }
        // ); 
        // console.log(test); 
        var test = ReactRedux.useStore(); 
        console.log(test); 
        return (
            <div>
                <h1>{this.props.test || "currently waiting for new value"}</h1>
                <button type="button" onClick={ChangeTestVar}>Change the value </button>
            </div>
        ); 
    }
}



function TestReduxStore(props)
{
    var ChangeTestVar = ()=>
    {
        var value = encodeURIComponent(Math.random().toString()); 
        props.ChangeTestVar(value); 
    }; 
    // var test = ReactRedux.useStore(); 
    // console.log(test); 
    var test = ReactRedux.useSelector
    (
        (state)=>
        {
            return state.test; 
        }
    ); 
    console.log(test); 
    return (
        <div>
            <h1>{test || "currently waiting for new value"}</h1>
            <button type="button" onClick={ChangeTestVar}>Change the value </button>
        </div>
    ); 
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

// var TestReduxStoreConnect = ReactRedux.connect(MapStateToProps, MapDispatchToProps)(TestReduxStore); 
var TestReduxStoreConnect = ReactRedux.connect(undefined, MapDispatchToProps)(TestReduxStore); 

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

/*
class Home extends React.Component 
{
    render()
    {
        return (
            <div>
                <h1 className="text-purple">I am the home thing</h1>
                <ReactRouterDOM.Link to="/about">About</ReactRouterDOM.Link>
            </div>
        ); 
    }
}

class About extends React.Component 
{
    render()
    {
        let random = Math.random() * 100; 
        console.log(random); 
        if(random<50)
        {
            return <ReactRouterDOM.Redirect to="/home" />; 
        }
        return (
            <div>
                <h1 className="text-red">I am the about thing</h1>
                <ReactRouterDOM.Link to="/home">Home</ReactRouterDOM.Link>
                <h2>Redirect to home down here</h2>
                <button onClick={()=>this.props.history.push("/home")}>Redirect to home</button>
            </div>
        ); 
    }
}

*/


class FullPage extends BaseComponent 
{
    constructor(props)
    {
        super(props); 
        this.props.Authorize
        (
            {
                username: sessionStorage.getItem("username") ||"", 
                user_id: sessionStorage.getItem("user_id") ||""
            }
        ); 
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