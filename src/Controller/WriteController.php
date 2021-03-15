<?php

namespace Base\Controller;

use Base\App\{DB,Lib};

class WriteController{
    function write(){
        $data = false;
        if(isset($_SESSION['user'])) $data = true;
        echo json_encode($data);
    }

    function writePage(){
        Lib::view("write");
    }

    function writeImage(){
        header("Content-Type","application/json");
        extract($_POST);
        $exp = explode("/",$_FILES['img']['type'])[1]; 
        if( explode("/",$_FILES['img']['type'])[0] !== "image") $result = "이미지 파일만 업로드할 수 있습니다.";
        else if( $_FILES['img']['size'] >= 10485760) $result = "10MB 이하의 이미지 파일만 업로드 할 수 있습니다.";
        else if( $exp !== "jpg" && $exp !== "jpeg" && $exp !== "png" && $exp !== "gif" && $exp !== "JPG" && $exp !== "PNG" && $exp !== "GIF" && $exp !== "JPEG") $result = "확장자가 올바르지 않습니다.";
        else {
            do{$image_name = Lib::randstring(30).".".$exp;}while(is_file(ROOT."/public/image/upload/".$_FILES['img']['name']));
            $uploadfile = ROOT."/public/image/upload/";
            move_uploaded_file($_FILES['img']['tmp_name'],$uploadfile.$image_name);
            $result = 'true.'.$image_name;
        }
        echo json_encode($result);
    }

    function writeImageDel(){
        header("Content-Type","application/json");
        extract($_POST);
        $result = unlink(ROOT."/public".$url);
        echo json_encode($result);
    }

    function writeProcess(){
        header("Content-Type","application/json");
        if(!isset($_SESSION['user'])) return false;
        extract($_POST);
        $sql = "INSERT INTO posts(`writer_id`,`title`,`content`,`date`,`img`,`category`) VALUES (?,?,?,?,?,?)";
        $result = DB::query($sql,[$_SESSION['user']->id,$title,$content,date("Y-m-d H:i:s"),$img,$category]);
        echo json_encode($result);
    }

    function ModifyProcess(){
        header("Content-Type","application/json");
        if(!isset($_SESSION['user'])) return false;
        extract($_POST);
        $sql = "UPDATE posts SET `title` = ?,`content` = ?,`date` = ? ,`img` = ? ,`category` = ? WHERE id = ? AND writer_id = ?";
        $result = DB::query($sql,[$title,$content,date("Y-m-d H:i:s"),$img,$category,$id,$writer_id]);
        echo json_encode($result);
    }

    function modifySet(){
        header("Content-Type","application/json");
        if(!isset($_SESSION['user'])) return false;
        extract($_POST);
        $sql = "SELECT * FROM posts WHERE id = ? AND writer_id = ?";
        $result = DB::fetch($sql,[$id,$writer_id]);
        echo json_encode($result);
    }

    function writeImageSer(){
        header("Content-Type","application/json");
        if(!isset($_SESSION['user'])) return false;
        extract($_POST);
        $writer_id = $_SESSION['user']->id;
        $sql = "SELECT img FROM posts WHERE id = ? AND writer_id = ?";
        $result = DB::fetch($sql,[$id,$writer_id]);
        echo json_encode($result);
    }
}