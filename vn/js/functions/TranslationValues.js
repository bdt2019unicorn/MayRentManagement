class TranslationValues
{
    static General = 
    {
        "datetime": 
        {
            "month": 
            {
                "January": 1,
                "February": 2,
                "March": 3,
                "April": 4,
                "May": 5,
                "June": 6,
                "July": 7,
                "August": 8,
                "September": 9,
                "October": 10,
                "November": 11,
                "December": 12
            }, 
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
    static HyperlinkListCompile()
    {
        return "test"; 
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
}