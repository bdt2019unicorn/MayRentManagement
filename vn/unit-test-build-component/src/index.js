import NumberInput from "react-number-input"; 

class Test extends React.Component
{
    render()
    {
        return (
            <NumberInput
            />
        ); 
    }
}

ReactDOM.render(<Test />, document.getElementById("full_page")); 