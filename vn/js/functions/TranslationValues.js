class TranslationValues
{
    static General = 
    {
        "datetime": 
        {
            "Deposit paid": "Đã trả tiền cọc", 
            "Until": 
            {
                "translate": "Đến"
            }, 
            "Vacant": "Còn trống"
        }
    }; 
    static Hyperlink(html)
    {
        return this.Translate(html); 
    }
    static Translate(text)
    {
        if(!text)
        {
            return null; 
        }
        var DateTranslate = (text)=>
        {
            if(Number(text))
            {
                return undefined; 
            }
            var datetime = moment(text); 
            return datetime.isValid()? `Ngày ${datetime.date()} Tháng ${datetime.month() + 1} Năm ${datetime.year()}`: undefined;           
        }
        var date = DateTranslate(text); 
        for (var word in this.General["datetime"]) 
        {
            if(text.includes(word))
            {
                var translate = this.General["datetime"][word]; 
                if(typeof(translate)=="object")
                {
                    translate = translate["translate"]; 
                    text = text.replaceAll(word, "").trim(); 
                    return `${translate} ${date}`; 
                } 
                else 
                {
                    return translate; 
                }
            }
        }
        if(date)
        {
            return date; 
        }
        return text; 
    }
    static TranslateTable(table, translate_url) 
    {
        var translate = ServerJson(translate_url); 
        return translate ? table.map
        (
            row=>Object.keys(row).reduce
            (
                (accumulator, current_value)=>
                (
                    {
                        ...accumulator, 
                        [translate[current_value] || current_value]: row[current_value]
                    }
                ), {}
            ) 
        ) : table; 
    }
}