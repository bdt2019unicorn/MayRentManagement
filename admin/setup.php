<html>
    <?php include("layout/1.head.php"); ?>
    <?php  
        if($_SERVER["REQUEST_METHOD"]==="POST")
        {
            echo "<pre>"; print_r($_POST); echo "</pre>"; 
            return; 
        }

        require_once("../server/helper/current_environment.php"); 
        CurrentEnvironment::Setup(); 
        $current_environment = new CurrentEnvironment(); 
        $test_mode = $current_environment->TestMode(); 
    ?>

    <div class="container-fluid">
        <h3>Current Mode: </h3>
        <form class="row">
            <div class="col-10">
                <div class="form-check">
                    <input type="checkbox" class="form-check-input">
                    <label class="form-check-label">Test Mode</label>
                </div>
            </div>

            <div class="col-2">
                <button type="submit" class="btn btn-primary mb-2">Confirm identity</button>
            </div>
            
        </form>
    </div>

    <?php if(!$current_environment->TestMode()): ?>


    <?php endif; ?>


    <footer>
        <?php include("layout/3.footer.php"); ?>
    </footer>
</html>