class HyperlinkListCompile extends React.Component 
{
    render() 
    {
        var HtmlMatch = (regular_expression, append="")=>
        {
            let result = this.props.html.match(regular_expression); 
            console.log(result); 
            return result.length? `${append}${result[1]}`: undefined; 
        }; 
        if(!this.props.html)
        {
            return null; 
        }

        var to = HtmlMatch('to="(.+)"', `/${(this.props.append || "")}/`); 
        if(!to)
        {
            return null; 
        }
        var text = HtmlMatch('>(.+)<'); 
        if(!text)
        {
            return null; 
        }
        var Link = ReactRouterDOM.Link; 

        return (
            <Link to={to}>
                <Translate text={text} />
            </Link> 
        ); 
    }
}


class Hyperlink extends React.Component 
{
    render() 
    {
        var Link = ReactRouterDOM.Link; 
        return this.props.text; 
    }
}