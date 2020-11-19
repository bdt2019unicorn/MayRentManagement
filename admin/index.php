
<html>
    <head>
        <?php include("layout/head.php") ?>
    </head>
    <body>
        <?php 
            require_once("../server/helper/database.php"); 
            $tables = Connect::GetData("SHOW TABLES"); 
            echo '<pre>'; 
            print_r($tables); 
            echo '</pre>'; 
        ?>

        <nav class="navbar navbar-expand-lg navbar-dark bg-dark justify-content-between">
            <a class="navbar-brand" href=".">Admin</a>
            <ul class="navbar-nav">
                <li class="nav-item"><a class="nav-link" href="javascript:Logout();">Log out</a></li>
            </ul>
        </nav>

        <div class="container-fluid">
        <table class="table table-striped table-bordered w-100">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                </tr>
                <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                </tr>
                <tr>
                <th scope="row">3</th>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
                </tr>
            </tbody>
        </table>


        </div>


        <footer>
            <?php include("layout/footer.php") ?>
            <script src="js/index.js"></script>
        </footer>
    </body>
    





</html>