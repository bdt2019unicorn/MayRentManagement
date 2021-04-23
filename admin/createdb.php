<html>
    <?php 
        include("layout/1.head.php"); 
        $list = 
        [
            "SERVERNAME"=>"localhost", 
            "USERNAME"=>"root", 
            "PASSWORD"=>"", 
            "DBNAME"=>""
        ]; 
    ?>

    <body>
        <form class="container-fluid" method="POST" action="../server/controller/database/createdb.php">
            <h1 class="text-center">Create Production Database</h1>
            <?php foreach ($list as $name=>$default_value): ?>
                <div class="form-group">
                    <label><?php echo $name; ?></label>
                    <input type="text" class="form-control" <?php echo $name!="PASSWORD"? "required": ""; ?> name="<?php echo $name; ?>" value="<?php echo $default_value; ?>" />
                </div>
            <?php endforeach; ?>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </body>

    <footer>
        <?php include("layout/3.footer.php");?>
    </footer>
</html>
