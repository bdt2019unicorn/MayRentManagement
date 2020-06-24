function GetFormDataFields()
{
    var form_data = 
    {
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
                        title: "Date of Birth"
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
                        component: "date-input", 
                        name: "start_date", 
                        title: "Start Date"
                    }, 
                    {
                        component: "date-input", 
                        name: "finish", 
                        title: "End Date"
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
                        component: "date-input", 
                        name: "deposit_payment_date", 
                        title: "Deposit Payment Date"
                    }, 
                    {
                        component: "date-input", 
                        name: "deposit_payback_date", 
                        title: "Deposit Payback Date"
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
                        component: "date-input", 
                        name: "start_period", 
                        title: "Start Period"
                    }, 
                    {
                        component: "date-input", 
                        name: "end_period", 
                        title: "End Period"
                    }, 
                    {
                        component: "date-input", 
                        name: "payment_date", 
                        title: "Payment Date"
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
            // validate: 
            // {
            //     rules: 
            //     {
            //         name: "required", 
            //         tenant_id: "required", 
            //         apartment_id: "required", 
            //         rent_amount: 
            //         {
            //             required: true,
            //             number: true 
            //         }, 
            //         deposit_amount:
            //         {
            //             required: true,
            //             number: true 
            //         },  
            //         monthly_payment_date: 
            //         {
            //             required: true, 
            //             step: 1, 
            //             min: 1, 
            //             max: 28
            //         }
            //     }
            // }
        }, 
        expense: 
        {
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
                        component: "date-input", 
                        name: "start_period", 
                        title: "Start Period"
                    }, 
                    {
                        component: "date-input", 
                        name: "end_period", 
                        title: "End Period"
                    }, 
                    {
                        component: "date-input", 
                        name: "payment_date", 
                        title: "Payment Date"
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
            title: "Expense"
        }
    }

    return form_data[window.store_track.state.controller]; 
}

function ImportData(excel_data)
{
    var data = new FormData(); 
    data.append("excel",JSON.stringify(excel_data)); 
    var url = "server/import_controller/" + window.store_track.state.controller + ".php"; 
    return AjaxRequest(url, data, "post"); 
}