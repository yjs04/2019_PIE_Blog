<?php

namespace Base\Controller;

use Base\App\{DB,Lib};

class ViewController{
    
    public function viewPage($id){
        $sql = "SELECT U.username, P.* FROM users AS U, posts AS P WHERE P.writer_id = U.id AND P.id = ?";
        $result = DB::fetch($sql,[$id]);
        Lib::view("views",["view"=>$result]);
    }

    public function viewAdd($id){
        $sql = "SELECT posts.view FROM posts WHERE posts.id = ?";
        $view_num = DB::fetch($sql,[$id]);
        $sql = "UPDATE posts SET `view` = ? WHERE posts.id = ?";
        DB::query($sql,[((int)$view_num->view + 1),$id]);
    }

    public function viewLike(){
        header("Content-Type","application/json");
        extract($_GET);
        $result = "NOTFOUND";
        if(isset($_SESSION['user'])){
            $u_id = $_SESSION['user'];
            $sql = "SELECT COUNT(*) FROM goodlist WHERE p_id = ? AND u_id = ?";
            $result = DB::fetch($sql,[$p_id,$u_id->id]);
        }
        echo json_encode($result);
    }

    public function viewLikeAdd(){
        header("Content-Type","application/json");
        extract($_GET);
        if($mode == 1){
            $u_id = $_SESSION['user'];
            $sql = "DELETE FROM goodlist WHERE p_id = ? AND u_id = ?";
            $result = DB::query($sql,[$p_id,$u_id->id]);
        }else{
            $u_id = $_SESSION['user'];
            $sql = "INSERT INTO goodlist(`u_id`,`p_id`) VALUES(?,?)";
            $result = DB::query($sql,[$u_id->id,$p_id]);
        }

        $sql = "SELECT COUNT(*) as good FROM goodlist WHERE p_id = ?";
        $goodNum = DB::fetch($sql,[$p_id]);

        $sql = "UPDATE posts SET `good` = ? WHERE posts.id = ?";
        $result = DB::query($sql,[(int)$goodNum->good,$p_id]);
        echo json_encode((int)$goodNum->good);
    }

    public function viewComment(){
        header("Content-Type","application/json");
        extract($_GET);
        $sql = "SELECT U.username , C.* FROM users AS U , comments AS C WHERE U.id = C.cwriter_id AND C.cpost_id = ?";
        $result = DB::fetchAll($sql,[$cpost_id]);
        echo json_encode($result);
    }

    public function viewCommentAdd(){
        header("Content-Type","application/json");
        extract($_POST);
        $result = "NOTFOUND";
        if(isset($_SESSION['user'])){
            $sql = "INSERT INTO comments(`cwriter_id`,`cpost_id`,`comment`,`cdate`) VALUES(?,?,?,?)";
            $result = DB::query($sql,[$_SESSION['user']->id,$cpost_id,$comment,date("Y-m-d H:i:s")]);
            $sql = "SELECT COUNT(*) as comment FROM comments WHERE cpost_id = ?";
            $commentNum = DB::fetch($sql,[$cpost_id]);
            $sql = "UPDATE posts SET `comment` = ? WHERE posts.id = ?";
            DB::query($sql,[(int)$commentNum->comment,$cpost_id]);
        }
        echo json_encode($result);
    }

    public function viewCommentNum(){
        header("Content-Type","application/json");
        extract($_GET);
        $sql = "SELECT COUNT(*) as comment FROM comments WHERE cpost_id = ?";
        $result = DB::fetch($sql,[$cpost_id]);
        echo json_encode((int)$result->comment);
    }

    public function viewDelete(){
        header("Content-Type","application/json");
        extract($_POST);
        $result = "";
        if($_SESSION['user']->id !== $writer_id) $result = "해당권한이 없습니다.";
        else{
            $sql = "SELECT * FROM posts WHERE id = ? AND writer_id = ?";
            $check = DB::query($sql,[$id,$writer_id]);
            if($check){
                $sql = "SELECT img FROM posts WHERE id = ? AND writer_id = ?";
                $img = DB::fetch($sql,[$id,$writer_id])->img;
                foreach(explode(",",$img) as $item){
                    if(is_file(ROOT."/public".$item)) unlink(ROOT."/public".$item);
                }
                $sql = "DELETE FROM posts WHERE id = ? AND writer_id = ?";
                $delete = DB::query($sql,[$id,$writer_id]);
                $result = $delete !== false ? "삭제되었습니다." : "삭제도중 문제가 발생했습니다.";
            }else $result = "존재하지 않거나 잘못된 글입니다.";
        }
        echo json_encode($result);
    }

    public function viewModify(){
        header("Content-Type","application/json");
        extract($_POST);
        $result = "";
        if($_SESSION['user']->id !== $writer_id) $result = "해당권한이 없습니다.";
        else{
            $sql = "SELECT * FROM posts WHERE id = ? AND writer_id = ?";
            $check = DB::query($sql,[$id,$writer_id]);
            if($check) $result = true;
            else $check = "존재하지 않거나 잘못된 글입니다.";
        }
        echo json_encode($result);
    }

    public function viewModPage($id,$write){
        $sql = "SELECT * FROM posts WHERE id = ? AND writer_id = ?";
        $data = DB::fetch($sql,[$id,$write]);
        Lib::view("write",[$data]);
    }
}