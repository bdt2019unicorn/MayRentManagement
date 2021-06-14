<html>
    <?php include("layout/1.head.php"); ?>
    <?php  
        require_once("../server/helper/current_environment.php"); 
        CurrentEnvironment::Setup(); 
        $current_environment = new CurrentEnvironment(); 
        $test_mode = $current_environment->TestMode(); 
    ?>

    <div class="container p-3">
        <form class="row justify-content-center" method="POST" action="../server/controller/admin_database.php?command=CurrentEnvironmentSetUp" onsubmit="FormSubmit(this, event)">
            <div class="col-8 row border border-secondary p-3 m-3">
                <h3 class="text-danger text-center col-12"><?php echo $test_mode?"Testing": "Production" ?> Environment</h3>
                <div class="col-10">
                    <div class="form-check">
                        <input type="checkbox" name="test_mode" class="form-check-input" <?php echo $test_mode?"checked": "" ?>>
                        <label class="form-check-label">Test Mode</label>
                    </div>
                </div>

                <div class="col-2 text-right">
                    <button type="submit" class="btn btn-primary mb-2">Save</button>
                </div>
            </div>
        </form>
        <br>
    </div>

    <?php if(!$test_mode): ?>
        <form class="container border border-primary p-3" data-whitespace="no-writespace" method="POST" action="../server/controller/admin_database.php?command=EnvironmentVariableSetUp" onsubmit="FormSubmit(this, event)">
            <h1 class="text-center">Production Environment Set Up</h1>
            <p class="text-center"><a href="createdb.php">Create Database</a></p>
            <?php $key_list = ["SERVERNAME", "USERNAME", "PASSWORD", "DBNAME"]; ?>
            <?php foreach($key_list as $key): ?>
                <div class="form-group">
                    <label><?php echo $key;?></label>
                    <input name="<?php echo $key;?>" type="text" class="form-control" value="<?php echo $_ENV[$key]; ?>">
                </div>
            <?php endforeach; ?>
            <button type="submit" class="btn btn-primary">Save</button>
        </form>
        <br>
    <?php endif; ?>
    
    <form class="container border border-warning p-3" data-whitespace="no-writespace" method="POST" action="../server/controller/admin_database.php?command=EnvironmentVariableSetUp" onsubmit="FormSubmit(this, event, false)">
        <?php $key_list = ["USER", "REPO", "TOKEN", "EMAIL_API", "NOTIFICATION_EMAIL"]; ?>
        <h1 class="text-center">Repository Information Set Up</h1>
        <?php foreach($key_list as $key): ?>
            <div class="form-group">
                <label><?php echo $key;?></label>
                <input name="<?php echo $key;?>" type="text" class="form-control" value="<?php echo $_ENV[$key]; ?>">
            </div>
        <?php endforeach; ?>
        <button type="submit" class="btn btn-primary">Save</button>
    </form>       

    <footer>
        <?php 
            include("layout/3.footer.php");
            require_once("../server/helper/database.php"); 
            $error = false; 
            set_error_handler
            (
                function($errorno, $errstr) use (&$error)
                {
                    if (str_contains($errstr, "mysqli::__construct(): (HY000/1049): Unknown database")) 
                    {
                        echo "<h1 class='text-center text-danger'>Database is not existed, for quick access, please switch to test mode</h1>"; 
                        $error = true; 
                    }
                    return null;
                }
            ); 
            try 
            {
                $result = Database::GetData("SELECT * FROM `user` WHERE approved = '1' LIMIT 1;");  
            }
            catch(Exception $exception)
            {
                $result = []; 
            }
        ?>
        <script src="js/setup.js"></script>
        <?php if(!$error): ?>

            <?php if(!count($result)): ?>
                <form class="container border border-info p-3" method="POST" action="../server/controller/database/import.php?import_controller=user" onsubmit="FormSubmit(this, event)">
                    <h1 class="text-center">Admin Set Up</h1>
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
                    <input name="import" type="hidden" value="1">
                    <input name="import_excel" type="hidden" value="1">
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            <?php else: ?>
                <?php require_once("layout/4.admin.php"); ?>
            <?php endif; ?>
        <?php endif; ?>
    </footer>
</html>