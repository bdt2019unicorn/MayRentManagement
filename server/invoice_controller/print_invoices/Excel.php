<?php 
    namespace PrintInvoices; 
    require_once("./helper.php"); 
    class Excel 
    {
        public static function FooterArray($building_information)
        {
            $space = array_fill(0,6,""); 
            $AddressArray = function($address_string) use ($space)
            {
                $address = explode("\n", $address_string); 
                $array = []; 
                foreach ($address as $value) 
                {
                    $row = array_merge([""], $space, ["<i>{$value}</i>"]); 
                    array_push($array, $row); 
                }
                return $array; 
            }; 
            return array_merge
            (
                [
                    array_merge(["Please make transfer payment to"], $space, ["For and on behalf of"]), 
                    array_merge(["Account name: <b>{$building_information['account_name']}</b>"], $space, ["<b>{$building_information["company"]}</b>"]), 
                    array_merge(["Account number: <b>{$building_information['account_number']}</b>"], $space, [""]), 
                    array_merge(["Bank: <a href='{$building_information['bank_link']}'><b>{$building_information['bank']}</b></a></b>"], $space, [""]), 
                    array_merge(["Branch: <b>{$building_information['bank_branch']}</b>"], $space, [""]), 
                    array_merge([""], $space, ["Authorized Signature"]), 
                    array_merge([""], $space, ["<b>{$building_information['authorize_signature']}</b>"]), 
                    array_merge([""], $space, ["<b>{$building_information['authorize_title']}</b>"]), 
                    array_merge([""], $space, ["<a href='mailto: {$building_information["email"]}'>{$building_information["email"]}</a>"]), 
                    array_merge([""], $space, ["Phone No. {$building_information['phone']}"]), 
                ], 
                $AddressArray($building_information["address"])
            ); 
        }
    }
?>