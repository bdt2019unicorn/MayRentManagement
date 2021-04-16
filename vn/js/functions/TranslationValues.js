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
        for (var word in this.General["datetime"]) 
        {
            if(text.includes(word))
            {
                var translate = this.General["datetime"][word]; 
                if(typeof(translate)=="object")
                {
                    translate = translate["translate"]; 
                    text = text.replaceAll(word, "").trim(); 
                    var datetime = moment(text); 
                    return `${translate} Ngày ${datetime.date()} Tháng ${datetime.month()} Năm ${datetime.year()}`; 
                } 
                else 
                {
                    return translate; 
                }
            }
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