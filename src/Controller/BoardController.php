<?php

namespace Base\Controller;

use Base\App\{DB,Lib};

class BoardController{
    public function boardpage(){
        Lib::view("board");
    }

    public function boardNum(){
        header("Content-Type","application/json");
        extract($_GET);
        $sql = "SELECT COUNT(*) AS `page` FROM posts $Limit";
        $result = DB::fetch($sql);
        echo json_encode($result);
    }

    public function boardNomal(){
        header("Content-Type","application/json");
        extract($_GET);
        $pageNum = $BoardIndex * 5;
        $sql = "SELECT U.username, P.* FROM users AS U, posts AS P WHERE P.writer_id = U.id ORDER BY `id` DESC LIMIT $pageNum, 5";
        $result = DB::fetchAll($sql);
        echo json_encode($result);
    }

    public function boardNotice(){
        header("Content-Type","application/json");
        extract($_GET);
        $pageNum = $BoardIndex * 5;
        $sql = "SELECT U.username, P.* FROM users AS U, posts AS P WHERE P.category = 'notice' AND P.writer_id = U.id ORDER BY `id` DESC LIMIT $pageNum, 5";
        $result = DB::fetchAll($sql);
        echo json_encode($result);
    }

    public function boardToday(){
        header("Content-Type","application/json");
        extract($_GET);
        $pageNum = $BoardIndex * 5;
        $sql = "SELECT U.username, P.* FROM users AS U, posts AS P WHERE P.writer_id = U.id AND (CONVERT(P.date,date)) = (SELECT CONVERT(now(),date)) ORDER BY `date` DESC LIMIT $pageNum, 5";
        $result = DB::fetchAll($sql);
        echo json_encode($result);
    }

    public function boardFavorite(){
        header("Content-Type","application/json");
        extract($_GET);
        $pageNum = $BoardIndex * 5;
        $sql = "SELECT U.username, P.* FROM users AS U, posts AS P WHERE p.writer_id = U.id ORDER BY `good` DESC LIMIT $pageNum, 5";
        $result = DB::fetchAll($sql);
        echo json_encode($result);
    }

    public function boardQuestion(){
        header("Content-Type","application/json");
        extract($_GET);
        $pageNum = $BoardIndex * 5;
        $sql = "SELECT U.username, P.* FROM users AS U, posts AS P WHERE P.category = 'question' AND P.writer_id = U.id ORDER BY `id` DESC LIMIT $pageNum, 5";
        $result = DB::fetchAll($sql);
        echo json_encode($result);
    }
}