<!DOCTYPE html>
<html>
    <head>
        <title>Admin Database Login</title>
        <?php include("layout/1.head.php") ?>
        <link rel="stylesheet" type="text/css" href="../css/admin-login.css">
    </head>
    <body>
        <div class="container">
            <div class="d-flex justify-content-center h-100">
                <div class="card">
                    <div class="card-header">
                        <h3>Sign In</h3>
                    </div>
                    <div class="card-body">
                        <form method="POST" action="../server/controller/admin_database.php?command=Login" onsubmit="Login(event)">
                            <div class="input-group form-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fas fa-user"></i></span>
                                </div>
                                <input type="text" class="form-control" placeholder="username" name="username">
                                
                            </div>
                            <div class="input-group form-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fas fa-key"></i></span>
                                </div>
                                <input type="password" class="form-control" placeholder="password" name="password">
                            </div>
                            <div class="form-group">
                                <input type="text" value="1" name="approved" hidden>
                                <input type="submit" value="Login" class="btn float-right login_btn">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <footer>
            <?php include("layout/3.footer.php") ?>
            <script src="js/login.js"></script>
        </footer>
    </body>
</html>
