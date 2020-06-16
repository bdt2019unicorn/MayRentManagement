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
            title: "Tenant"
        }, 
        leaseagrm: 
        {
            form:  
            [
                [
                    {
                        component: "text-input", 
                        name: "name", 
                        title: "Contract Name"
                    }, 
                    {
                        component: "text-input", 
                        name: "tenant_id", 
                        title: "Tenant"
                    }, 
                    {
                        component: "text-input", 
                        name: "apartment_id", 
                        title: "Apartment"
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
                        component: "text-input", 
                        name: "rent_amount", 
                        title: "Rent Amount"
                    }, 
                    {
                        component: "text-input", 
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
                        component: "text-input", 
                        name: "monthly_payment_date", 
                        title: "Monthly Payment Date"
                    }, 
                    {
                        component: "text-input", 
                        name: "deposit_currency", 
                        title: "Deposit Currency"
                    }, 
                    {
                        component: "text-input", 
                        name: "deposit_exchange_rate", 
                        title: "Deposit Exchange Rate"
                    }
                ]
            ], 
            title: "Contract"
        }, 
        revenue: 
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
                        component: "text-input", 
                        name: "revenue_type_id", 
                        title: "Type"
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
                        component: "text-input", 
                        name: "apartment_id", 
                        title: "Apartment"
                    }, 
                    {
                        component: "text-input", 
                        name: "amount", 
                        title: "Amount"
                    }
                ],
                [
                    {
                        component: "text-input", 
                        name: "note", 
                        title: "Note"
                    }
                ]
            ], 
            title: "Revenue"
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
                        component: "text-input", 
                        name: "expense_type_id", 
                        title: "Type"
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
                        component: "text-input", 
                        name: "apartment_id", 
                        title: "Apartment"
                    }, 
                    {
                        component: "text-input", 
                        name: "amount", 
                        title: "Amount"
                    }
                ],
                [
                    {
                        component: "text-input", 
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