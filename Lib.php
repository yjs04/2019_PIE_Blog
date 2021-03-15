<?php

namespace Base\App;

class Lib{
    function view($view_path,$data=[]){
        extract($data);//배열의 키값으로 변수를 선언
        $view_path = SRC."View/$view_path.php";
        include SRC."View/base/header.php";
        include $view_path;
        include SRC."View/base/footer.php";
    }
    
    function randstring($strlen){
        $str = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
        $result = "";
        for($i = 0; $i<$strlen;$i++) $result.=$str[rand(0,strlen($str)-1)];
        return $result;
    }
}