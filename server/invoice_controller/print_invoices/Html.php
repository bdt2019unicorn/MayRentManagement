<?php 
    namespace PrintInvoices; 
    require_once("./helper.php"); 
    trait Html 
    {   
        private function Html()
        {
            $html_footer = 
            "
                <table style='width: 100%;'>
                    <tr>
                        <td>Please make transfer payment to</td>
                        <td>For and on behalf of</td>
                    </tr>
                    <tr>
                        <td>Account name: <b>{$this->building_information['account_name']}</b></td>
                        <td><b>{$this->building_information["company"]}</b></td>
                    </tr>
                    <tr><td>Account number: <b>{$this->building_information['account_number']}</b><td></tr>
                    <tr><td>Bank: <a href='{$this->building_information['bank_link']}'><b>{$this->building_information['bank']}</b></a></b><td></tr>
                    <tr><td>Branch: <b>{$this->building_information['bank_branch']}</b><td></tr>

                    <tr><td></td><td>Authorized Signature</td><tr>
                    <tr><td></td><td><b>{$this->building_information['authorize_signature']}</b></td><tr>
                    <tr><td></td><td><b>{$this->building_information['authorize_title']}</b></td><tr>
                    <tr><td></td><td><a href='mailto: {$this->building_information["email"]}'>{$this->building_information["email"]}</a></td><tr>
                    <tr><td></td><td>Phone No. {$this->building_information['phone']}</td><tr>
                    <tr><td></td><td><pre style='font-style: italics;'>{$this->building_information["address"]}</pre></td></tr>
                </table>
            "; 
            return 
            [
                "image" => $this->logo_image, 
                "footer" => $html_footer 
            ]; 
        }
    }
?>