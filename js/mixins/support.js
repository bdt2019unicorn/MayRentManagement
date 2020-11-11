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
            return numeral(number).format("0,0[.]000"); 
        }, 
        
        OverviewDataUrl(overview_controller, params=undefined)
        {
            params = 
            {
                building_id: this.$route.params.building_id, 
                overview_controller: overview_controller, 
                ...params
            }

            let search = Object.keys(params).filter(key=>params[key]!=undefined).map(key=>`${key}=${params[key]}`).join("&"); 
            return `server/overview_controller/overview_controller.php?${search}`; 
        }, 
        StateObject(state_property)
        {
            return window.store_track.state[state_property]; 
        }, 
        SubmitData(key, url, data, stringify=true)
        {
            var form_data = new FormData(); 
            form_data.append(key, (stringify)?JSON.stringify(data): data); 
            return this.AjaxRequest(url,form_data, "post");
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