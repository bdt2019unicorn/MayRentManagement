function GetFormDataFields(controller=undefined)
{
    var form_data = 
    {
        login: 
        {
            title: "Login", 
            form:  
            [
                [
                    {
                        component: "text-input", 
                        name: "username", 
                        title: "Username"
                    }
                ], 
                [
                    {
                        component: "text-input", 
                        name: "password", 
                        title: "Password", 
                        type: "password"
                    }
                ]
            ], 
            validate: 
            {
                rules: 
                {
                    username: "required", 
                    password: "required", 
                }
            }
            
        }, 

        register: 
        {
            title: "Register", 
            form:  
            [
                [
                    {
                        component: "text-input", 
                        name: "username", 
                        title: "Username"
                    }
                ], 
                [
                    {
                        component: "text-input", 
                        name: "password", 
                        title: "Password", 
                        type: "password"
                    }
                ], 
                [
                    {
                        component: "text-input", 
                        name: "phone_number", 
                        title: "Phone number"
                    }, 
                    {
                        component: "text-input", 
                        name: "viber_number", 
                        title: "Viber Number"
                    }
                ], 
                [
                    {
                        component: "text-group-confirmation", 
                        name: "email", 
                        title: "Email Address", 
                        id: "email", 
                        confirm_name: "email_confirm", 
                        confirm_title: "Confirm Email Address"
                    }
                ]
            ], 
            validate: 
            {
                rules: 
                {
                    username: "required", 
                    password: "required", 
                    phone_number: "required", 
                    email:
                    {
                        required: true, 
                        email: true
                    }, 
                    email_confirm: 
                    {
                        equalTo: "#email"
                    }
                }
            }
        }, 

        buildings: 
        {
            form:  
            [
                [
                    {
                        component: "text-input", 
                        name: "name", 
                        title: "Name"
                    }
                ]
            ], 
            title: "Building"
        }, 
        tenant: 
        {
            title: "Tenant", 
            form:  
            [
                [
                    {
                        component: "text-input", 
                        name: "first_name", 
                        title: "First Name"
                    }, 
                    {
                        component: "text-input", 
                        name: "middle_name", 
                        title: "Middle Name"
                    }, 
                    {
                        component: "text-input", 
                        name: "last_name", 
                        title: "Last Name"
                    }, 
                    {
                        component: "date-input", 
                        name: "date_of_birth", 
                        title: "Date of Birth", 
                        required: true
                    }
                ], 
                [
                    {
                        component: "text-input", 
                        name: "passport_id_number", 
                        title: "Passport/ID Number"
                    }, 
                    {
                        component: "text-input", 
                        name: "Nationality", 
                        title: "Nationality"
                    }
                ], 
                [
                    {
                        component: "text-input", 
                        name: "mobile_phone", 
                        title: "Mobile Phone"
                    }, 
                    {
                        component: "text-input", 
                        name: "work_phone", 
                        title: "Work Phone"
                    }
                ], 
                [
                    {
                        component: "text-input", 
                        name: "personal_email", 
                        title: "Personal Email"
                    }, 
                    {
                        component: "text-input", 
                        name: "work_email", 
                        title: "Work Email"
                    }
                ], 
                [
                    {
                        component: "text-input", 
                        name: "company_name", 
                        title: "Company Name"
                    }, 
                    {
                        component: "text-input", 
                        name: "company_address", 
                        title: "Company Address"
                    }
                ]
            ], 
            validate: 
            {
                rules: 
                {
                    first_name: "required", 
                    last_name: "required", 
                    passport_id_number: "required", 
                    mobile_phone: "required", 
                    personal_email: "email", 
                    work_email: "email"
                }
            }
            
        }, 
        leaseagrm: 
        {
            title: "Contract", 
            form:  
            [
                [
                    {
                        component: "text-input", 
                        name: "name", 
                        title: "Contract Name"
                    }, 
                    {
                        component: "select-input", 
                        name: "tenant_id", 
                        title: "Tenant", 
                        overview_controller: "tenant", 
                        value: "id", 
                        text: "full_name"
                    }, 
                    {
                        component: "select-input", 
                        name: "apartment_id", 
                        title: "Apartment", 
                        overview_controller: "apartment", 
                        value: "id", 
                        text: "name"
                    }
                ], 
                [
                    {
                        component: "date-group", 
                        date_data: 
                        {
                            small_date: 
                            {
                                name: "start_date", 
                                title: "Start Date", 
                                required: true, 
                                message: "The start date should be before the end date"
                            }, 
                            big_date: 
                            {
                                name: "finish", 
                                title: "End Date", 
                                required: true, 
                                message: "The end date should be after the start date"
                            }
                        }, 
                    }
                ], 
                [
                    {
                        component: "number-input", 
                        name: "rent_amount", 
                        title: "Rent Amount"
                    }, 
                    {
                        component: "number-input", 
                        name: "deposit_amount", 
                        title: "Deposit Amount"
                    }
                ], 
                [
                    {
                        component: "date-group", 
                        date_data: 
                        {
                            small_date: 
                            {
                                name: "deposit_payment_date", 
                                title: "Deposit Payment Date", 
                                required: true, 
                                message: "The deposite payment date should be before the deposite payback date"
                            }, 
                            big_date: 
                            {
                                name: "deposit_payback_date", 
                                title: "Deposit Payback Date", 
                                required: true, 
                                message: "The deposite payback date should be after the deposite payment date"
                            }
                        }, 
                    }
                ], 
                [
                    {
                        component: "number-input", 
                        name: "monthly_payment_date", 
                        title: "Monthly Payment Date", 
                        maximum_value: 28,
                        decimal_places: 0 
                    }, 
                    {
                        component: "text-input", 
                        name: "deposit_currency", 
                        title: "Deposit Currency"
                    }, 
                    {
                        component: "number-input", 
                        name: "deposit_exchange_rate", 
                        title: "Deposit Exchange Rate", 
                        decimal_places: 6
                    }
                ]
            ], 
            validate: 
            {
                rules: 
                {
                    name: "required", 
                    tenant_id: "required", 
                    apartment_id: "required", 
                    rent_amount: 
                    {
                        required: true,
                        number: true 
                    }, 
                    deposit_amount:
                    {
                        required: true,
                        number: true 
                    },  
                    monthly_payment_date: 
                    {
                        required: true, 
                        step: 1, 
                        min: 1, 
                        max: 28
                    }
                }
            }
        }, 
        revenue: 
        {
            title: "Revenue", 
            form:  
            [
                [
                    {
                        component: "text-input", 
                        name: "name", 
                        title: "Name"
                    }, 
                    {
                        component: "select-input", 
                        name: "revenue_type_id", 
                        title: "Type",
                        overview_controller: "revenue_type", 
                        value: "id", 
                        text: "name"
                    }
                ], 
                [
                    {
                        component: "date-group", 
                        date_data: 
                        {
                            small_date: 
                            {
                                name: "start_period", 
                                title: "Start Period", 
                                required: true, 
                                message: "The start period should be before the end period"
                            }, 
                            big_date: 
                            {
                                name: "end_period", 
                                title: "End Period", 
                                required: true, 
                                message: "The end period should be after the start period"
                            }
                        }, 
                    }, 
                    {
                        component: "date-input", 
                        name: "payment_date", 
                        title: "Payment Date", 
                        required: true
                    }

                ], 
                [
                    {
                        component: "select-input", 
                        name: "apartment_id", 
                        title: "Apartment",
                        overview_controller: "apartment", 
                        value: "id", 
                        text: "name"
                    }, 
                    {
                        component: "number-input", 
                        name: "Amount", 
                        title: "Amount"
                    }
                ],
                [
                    {
                        component: "textarea-input", 
                        name: "note", 
                        title: "Note"
                    }
                ]
            ], 
            validate: 
            {
                rules: 
                {
                    name: "required", 
                    revenue_type_id: "required", 
                    apartment_id: "required", 
                    Amount: 
                    {
                        required: true,
                        number: true 
                    }
                }
            }
        }, 
        expense: 
        {
            title: "Expense", 
            form:  
            [
                [
                    {
                        component: "text-input", 
                        name: "name", 
                        title: "Name"
                    }, 
                    {
                        component: "select-input", 
                        name: "expense_type_id", 
                        title: "Type",
                        overview_controller: "expense_type", 
                        value: "id", 
                        text: "name"
                    }
                ], 
                [
                    {
                        component: "date-group", 
                        date_data: 
                        {
                            small_date: 
                            {
                                name: "start_period", 
                                title: "Start Period", 
                                required: true, 
                                message: "The start period should be before the end period"
                            }, 
                            big_date: 
                            {
                                name: "end_period", 
                                title: "End Period", 
                                required: true, 
                                message: "The end period should be after the start period"
                            }
                        }, 
                    }, 
                    {
                        component: "date-input", 
                        name: "payment_date", 
                        title: "Payment Date", 
                        required: true
                    }

                ], 
                [
                    {
                        component: "select-input", 
                        name: "apartment_id", 
                        title: "Apartment",
                        overview_controller: "apartment", 
                        value: "id", 
                        text: "name"
                    }, 
                    {
                        component: "number-input", 
                        name: "Amount", 
                        title: "Amount"
                    }
                ],
                [
                    {
                        component: "textarea-input", 
                        name: "note", 
                        title: "Note"
                    }
                ]
            ], 
            validate: 
            {
                rules: 
                {
                    name: "required", 
                    expense_type_id: "required", 
                    apartment_id: "required", 
                    Amount: 
                    {
                        required: true,
                        number: true 
                    }
                }
            }
        }
    }

    controller = (controller==undefined)? window.store_track.state.controller: controller; 

    return form_data[controller]; 
}

function ImportData(excel_data, controller=undefined)
{
    var data = new FormData(); 
    data.append("excel",JSON.stringify(excel_data)); 
    controller = (controller==undefined)? window.store_track.state.controller: controller; 
    var url = "server/import_controller/" + controller + ".php"; 
    return AjaxRequest(url, data, "post"); 
}