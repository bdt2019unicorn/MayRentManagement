var support_mixin = 
{
    computed: 
    {
        CurrentController()
        {
            return this.controller || this.$route.params.controller || "overview"; 
        }, 
        ImportUrl()
        {
            return `server/database_controller/import.php?import_controller=${this.CurrentController}&building_id=${this.$route.params.building_id}`; 
        }, 
        LockStyle()
        {
            return this.lock?{pointerEvents: 'none'}: undefined; 
        }, 
        ObjectId()
        {
            return this.object_id || this.$route.query.id; 
        }, 
        OverviewUrl()
        {
            return this.OverviewDataUrl(this.CurrentController, {id: this.ObjectId}); 
        }
    },
    methods: 
    {
        AjaxRequest(url, data=new FormData(), type="get") 
        {
            var result = null; 
            $.ajax
            (
                {
                    type: type, 
                    url: url, 
                    data: data, 
                    async: false, 
                    contentType: false,
                    processData: false,
                    enctype: 'multipart/form-data',
                    success: function(success)
                    {
                        result = success; 
                    }, 
                    error: function(error)
                    {
                        console.log(error.responseText); 
                        console.log(error); 
                    }
                }
            ); 
            return result; 
        }, 

        BlobRequest(url, data={})
        {
            var result = null; 
            $.ajax 
            (
                {
                    url: url, 
                    type: "POST", 
                    data: data,  
                    async: false, 
                    dataType: 'text',                              
                    mimeType: 'text/plain; charset=x-user-defined',
                    success: (data)=>
                    {
                        var bytes = new Uint8Array(data.length);
                        for (var i = 0; i < data.length; i++) 
                        {
                            bytes[i] = data.charCodeAt(i);
                        }
                        result = new Blob([bytes], {type: "application/octetstream"}); 
                    }, 
                    error: function(error)
                    {
                        alert("There is something wrong with the server! Please try again"); 
                        console.log(error); 
                    }
                }
            ); 
            return result; 
        }, 

        BuildingsData()
        {
            let buildings_data = this.TableData("buildings").map 
            (
                building=>
                (
                    {
                        ...building, 
                        params: 
                        {
                            building_id: building["id"]
                        }
                    }
                )
            ); 
            try 
            {
                window.store_track.commit("ChangeState", {name: "buildings_data", value: buildings_data}); 
                return undefined; 
            }
            catch
            {
                return buildings_data; 
            }
        }, 

        DateConvertFormatDisplayDatabase(string)
        {
            return moment(string, "DD MMM YYYY").format("YYYY-MM-DD"); 
        }, 

        DateReformat(string=undefined)
        {
            return string?moment(string):moment(); 
        }, 

        DateReformatDatabase(string=undefined)
        {
            return this.DateReformat(string).format("YYYY-MM-DD"); 
        }, 

        DateReformatDisplay(string=undefined)
        {
            return this.DateReformat(string).format("DD MMM YYYY"); 
        }, 

        ItemsClasses(item_value, compared_value, based_classes, good_class, bad_class=undefined)
        {
            based_classes.push((item_value==compared_value)?good_class: bad_class); 
            return based_classes; 
        }, 

        NumeralFormat(number)
        {
            return numeral(number).format("0,000"); 
        }, 
        
        OverviewDataUrl(overview_controller, params=undefined)
        {
            params = 
            {
                building_id: this.$route.params.building_id, 
                overview_controller: overview_controller, 
                ...params
            }

            let search = this.SearchQueryString(params); 
            return `server/overview_controller/overview_controller.php?${search}`; 
        }, 
        ResetValue({value_name, new_value, undefined_value=undefined, callback=undefined, callback_resolve=undefined})
        {
            new Promise 
            (
                (resolve, reject)=>
                {
                    this[value_name] = undefined_value; 
                    if(callback)
                    {
                        callback(); 
                    }
                    resolve(new_value); 
                }
            ).then
            (
                new_value=>
                {
                    this[value_name] = new_value; 
                    if(callback_resolve)
                    {
                        callback_resolve(); 
                    }
                }
            ); 
        }, 
        SearchQueryString(params)
        {
            return Object.keys(params).filter(key=>params[key]!=undefined).map(key=>`${key}=${params[key]}`).join("&"); 
        }, 
        StateObject(state_property)
        {
            return window.store_track.state[state_property]; 
        }, 
        SubmitData(key, url, data, stringify=true)
        {
            var form_data = new FormData(); 
            form_data.append(key, (stringify)?JSON.stringify(data): data); 
            this.SubmitUserInformation(form_data); 
            return this.AjaxRequest(url,form_data, "post");
        },
        SubmitUserInformation(form_data)
        {
            form_data.append("username", sessionStorage.getItem("username")); 
            form_data.append("modified_time", moment().format("YYYY-MM-DD HH:MM:ss")); 
        }, 
        TableActions(controller)
        {
            var table_actions = this.AjaxRequest(`server/overview_controller/table_actions/${controller}.json`);
            return table_actions || {}; 
        }, 
        TableData(overview_controller, params=undefined)
        {
            var data = this.AjaxRequest(this.OverviewDataUrl(overview_controller, params));
            try 
            {
               return JSON.parse(data); 
            }
            catch
            {
                return []; 
            }          
        }, 
        ToActions({controller=undefined, action, query=undefined})
        {
            return {
                name: "actions", 
                params: 
                {
                    building_id: this.$route.params.building_id||0, 
                    controller: controller || this.CurrentController, 
                    action: action
                }, 
                query: query
            }; 
        }, 
        ValidObject(object)
        {
            return !(Object.values(object).includes(false));
        }, 
        ValidPeriod(start_period, end_period, equal=false)
        {
            [start_period, end_period] = [start_period, end_period].map(period=>moment(period)); 

            let [str_start, str_end] = [start_period, end_period].map(moment_object=>this.DateReformatDatabase(moment_object)); 
            if((str_start==str_end) && equal)
            {
                return true; 
            }
            return moment(str_end)>moment(str_start); 
        }
    } 
}; 