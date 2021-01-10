<html>
    <?php include("layout/1.head.php"); ?>
    <?php  
        require_once("../server/helper/current_environment.php"); 
        if($_SERVER["REQUEST_METHOD"]==="POST")
        {
            $value = isset($_POST["test_mode"]); 
            $current_environment = new CurrentEnvironment(); 
            $current_environment->SettingEnvironment($value); 
            header('Location: '.$_SERVER['REQUEST_URI']);
        }
        
        CurrentEnvironment::Setup(); 
        $current_environment = new CurrentEnvironment(); 
        $test_mode = $current_environment->TestMode(); 
    ?>

    <div class="container-fluid">
        <form class="row m-3 border border-secondary" method="POST" action="./setup.php">
            <h3 class="text-danger text-center w-100"><?php echo $test_mode?"Testing": "Production" ?> Environment</h3>
            <div class="col-10">
                <div class="form-check">
                    <input type="checkbox" name="test_mode" class="form-check-input" <?php echo $test_mode?"checked": "" ?>>
                    <label class="form-check-label">Test Mode</label>
                </div>
            </div>

            <div class="col-2 text-right">
                <button type="submit" class="btn btn-primary mb-2">Save</button>
            </div>
            
        </form>
    </div>

    <?php if(!$test_mode): ?>
        <h1 class="text-center">Production Environment Set Up</h1>
        <form class="container" method="POST" action="../server/admin_database.php?command=ProductionEnvironmentSetUp">
            <?php foreach($_ENV as $key=>$value): ?>
                <div class="form-group <?php echo $key=='TESTMODE'?'d-none':''; ?>">
                    <label><?php echo $key;?></label>
                    <input name="<?php echo $key;?>" type="text" class="form-control" value="<?php echo $value; ?>">
                </div>
            <?php endforeach; ?>
            <button type="submit" class="btn btn-primary">Save</button>
        </form>
    <?php endif; ?>


    <footer>
        <?php 
            include("layout/3.footer.php");
            require_once("../server/helper/database.php"); 
            $sql = "SELECT * FROM `user` WHERE approved = '1';"; 
            $result = $test_mode?ConnectSqlite::Query($sql): Connect::GetData($sql); 
        ?>

        <?php if(!count($result)): ?>
            <h1 class="text-center">Admin Set Up</h1>
            <form class="container-fluid" method="POST" action="../server/admin_database.php?command=CreateAdmin">
                <div class="form-group">
                    <label>Username</label>
                    <input name="username" type="text" class="form-control">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input name="password" type="password" class="form-control">
                </div>
                <div class="form-group">
                    <label>Phone number</label>
                    <input name="phone_number" type="text" class="form-control">
                </div>
                <div class="form-group">
                    <label>Email address</label>
                    <input name="email" type="email" class="form-control">
                </div>
                <div class="form-group">
                    <label>Viber Number</label>
                    <input name="viber_number" type="text" class="form-control">
                </div>
                <input name="approved" type="hidden" value="1">
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        <?php else: ?>
            <?php require_once("layout/4.admin.php"); ?>
        <?php endif; ?>
    </footer>
</html>