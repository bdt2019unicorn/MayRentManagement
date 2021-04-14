class Translate extends React.Component 
{
    constructor(props)
    {
        super(props); 
        let url = `../server/translation/general.json`; 
        this.state = {translate: props.translate || ServerJson(url)}; 
    }
    render() 
    {
        var text = this.props.text; 
        for (var word in this.state.translate["datetime"]) 
        {
            if(text.includes(word))
            {
                var translate = this.state.translate["datetime"][word]; 
                if(typeof(translate)=="object")
                {
                    translate = translate["translate"]; 
                    text = text.replaceAll(word, "").trim(); 
                    var datetime = moment(text); 
                    text = `${translate} Ngày ${datetime.date()} Tháng ${datetime.month()} Năm ${datetime.year()}`; 
                } 
                else 
                {
                    text = translate; 
                }
                break; 
            }
        }
        return text; 
    }
}