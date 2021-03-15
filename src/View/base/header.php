<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>PIE's blog</title>
    <link href="https://fonts.googleapis.com/css?family=Cambay&display=swap" rel="stylesheet">
    <script src="https://kit.fontawesome.com/804f9c1a56.js" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.4.1.js"></script>
    <script src="/js/join.js"></script>
    <script src="/js/login.js"></script>
    <script src="/js/base.js"></script>
    <link rel="stylesheet" href="/css/login.css">
    <link rel="stylesheet" href="/css/base.css">
</head>
<body>
    <div id="wrap">
        <header>
            <a href="/"><img src="/image/logo.png" alt="logo" id="logo"></a>
            <a href="#" id="write_go">글쓰기</a>
            <a href="/board" id="board_go">게시판</a>
            <div class="bar"></div>
            <nav>
                <ul>
                    <?php if(!isset($_SESSION['user'])) :?>
                    <li><a href="#" id="join_go">join</a></li>
                    <li><a href="#" id="login_go">login</a></li>
                    <?php else :?>
                    <li id="nav_username"><a href="/user/myPage"><?= $_SESSION['user']->username?> </a>님</li>
                    <li><a href="#" id="logout_go">logout</a></li>
                    <?php endif;?>
                </ul>
            </nav>
        </header>
        <div id="visual">
            <h2>Welcome to PIE blog!</h2>
            <div id="half-c">
                <i class="fas fa-chevron-down" id="click-down"></i>
            </div>
        </div>
        
