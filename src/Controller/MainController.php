<?php

namespace Base\Controller;

use Base\App\DB;
use Base\App\Lib;

class MainController{
    function indexPage(){
        Lib::view("index");
    }

    function mainPost(){
        extract($_POST);
        //"new","many like","today","many view"
        if($status == "new"){
            header("Content-Type","application/json");
            $sql = "SELECT U.username, P.* FROM users AS U, posts AS P WHERE P.writer_id = U.id ORDER BY `date` DESC LIMIT 3";
            $result = DB::fetchAll($sql);
            echo json_encode($result);
        }

        if($status == "many view"){
            header("Content-Type","application/json");
            $sql = "SELECT U.username, P.* FROM users AS U, posts AS P WHERE P.writer_id = U.id ORDER BY `view` DESC LIMIT 3";
            $result = DB::fetchAll($sql);
            echo json_encode($result);
        }

        if($status == "today"){
            header("Content-Type","application/json");
            $sql = "SELECT U.username, P.* FROM users AS U, posts AS P WHERE P.writer_id = U.id AND (CONVERT(P.date,date)) = (SELECT CONVERT(now(),date)) ORDER BY `date` ASC LIMIT 3";
            $result = DB::fetchAll($sql);
            echo json_encode($result);
        }

        if($status == "many like"){
            header("Content-Type","appliction/json");
            $sql = "SELECT U.username, P.* FROM users AS U, posts AS P WHERE p.writer_id = U.id ORDER BY `good` DESC LIMIT 3";
            $result = DB::fetchAll($sql);
            echo json_encode($result);
        }
    }
}