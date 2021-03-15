<?php

namespace Base\Controller;

use Base\App\DB;
use Base\App\Lib;

class UserController{
    function joinProcess(){
        if(isset($_SESSION['user'])) return;
        header("Content-Type","application/json");
        extract($_POST);
        $password = hash("SHA256",$password);
        $sql = "INSERT INTO users(`userid`,`username`,`password`) VALUES(?,?,?)";
        $result = DB::query($sql,[$userid,$username,$password]);
        echo json_encode($result);
    }

    function userSearch(){
        header("Content-Type","application/json");
        extract($_POST);
        if(!isset($_SESSION['user'])){
            $sql = "SELECT $search FROM users WHERE $search = ?";
            $result = DB::fetch($sql,[$search_word]);
        }
        if(isset($_SESSION['user'])){
            $sql = "SELECT $search FROM users WHERE $search = ? AND NOT id = ?";
            $result = DB::fetch($sql,[$search_word,$_SESSION['user']->id]);
        }
        echo json_encode($result);
    }

    function LoginProcess(){
        if(isset($_SESSION['user'])) return;
        header("Content-Type","application/json");
        extract($_POST);
        $password = hash("SHA256",$password);
        $sql = "SELECT * FROM users WHERE `userid` = ? AND `password` = ?";
        $result = DB::fetch($sql,[$userid,$password]);
        if($result !== false)$_SESSION['user'] = $result;
        echo json_encode($result);
    }

    function LogoutProcess(){
        if(isset($_SESSION['user'])) unset($_SESSION['user']);
    }

    function MyPage(){
        if(isset($_SESSION['user'])) Lib::view("user");
        else header("/board");
    }

    function Userinfo(){
        header("Content-Type","application/json");
        extract($_POST);
        $result = "";
        if(!isset($_SESSION['user'])) $result = false;
        else{
            if($mode == 1){
                $sql = "SELECT U.* FROM users AS U  WHERE U.id = ?";
                $result = DB::fetch($sql,[$_SESSION['user']->id]);
            }
            else{
                $sql = "SELECT U.username, P.* FROM users AS U ,posts AS P WHERE U.id = ? AND P.writer_id = ?";
                $result = DB::fetchAll($sql,[$_SESSION['user']->id,$_SESSION['user']->id]);
            }
        }
        echo json_encode($result);
    }

    function UserCheck(){
        header("Content-Type","application/json");
        $result = "";
        extract($_POST);
        if(!isset($_SESSION['user']) || $_SESSION['user']->id !== $id) $result = false;
        else{
            $pass = hash("SHA256",$password);
            $sql = "SELECT * FROM users WHERE id = ? AND `password` = ?";
            $result = DB::fetch($sql,[$id,$pass]);
        }
        echo json_encode($result);
    }

    function UserDelete(){
        header("Content-Type","application/json");
        extract($_POST);
        $result = false;
        if(isset($_SESSION['user']) && $_SESSION['user']->id == $id){
            $sql = "SELECT img FROM users WHERE id = ?";
            $img = DB::fetch($sql,[$id])['img'];
            if($img !== ''){
                unlink(ROOT."/public".$item);
            }
            $sql = "DELETE FROM users WHERE id = ?";
            DB::query($sql,[$id]);
            $result = true;
        }

        echo json_encode($result);
    }

    function UserModify(){
        header("Content-Type","application/json");
        extract($_POST);
        $result = false;
        if(isset($_SESSION['user'])&&$_SESSION['user']->id == $id){
            $sql = "UPDATE users SET `userid` = ?, `username` = ? , `password` = ? WHERE id = ?";
            $result = DB::query($sql,[$userid,$username,hash("SHA256",$password),$id]);
            $sql = "SELECT * FROM users WHERE id = ?";
            $user = DB::fetch($sql,[$_SESSION['user']]);
            $_SESSION['user'] = $user;
        }
        echo json_encode($result);
    }

    function UserCommentSet(){
        header("Content-Type","application/json");
        extract($_POST);
        $result = false;
        if(isset($_SESSION['user']) && $_SESSION['user']->id = $id){
            $sql = "UPDATE users SET `usercomment` = ? WHERE id = ?";
            $result = DB::query($sql,[$comment,$id]);
            $sql = "SELECT * FROM users WHERE id = ?";
            $user = DB::fetch($sql,[$_SESSION['user']]);
            $_SESSION['user'] = $user;
        }
        echo json_encode($result);
    }

    function UserPhotoSet(){
        header("Content-Type","application/json");
        extract($_POST);
        
        if(isset($reset)){
            $sql = "SELECT userphoto FROM users WHERE id = ?";
            $lastimg = DB::fetch($sql,[$_SESSION['user']->id])->userphoto;
            if($lastimg !== '') unlink(ROOT."/public".$lastimg);
            $sql = "UPDATE users SET `userphoto` = ? WHERE id = ?";
            DB::query($sql,['',$_SESSION['user']->id]);
            $result = "reset.변경사항이 저장되었습니다.";
        }else{
            if($_FILES['img']['type'] !== '' || $_FILES['img']['name'] !== '' || $_FILES['img']['tmp_name'] !== ''){
                $exp = explode("/",$_FILES['img']['type'])[1]; 
                if( explode("/",$_FILES['img']['type'])[0] !== "image") $result = "이미지 파일만 업로드할 수 있습니다.";
                else if( $_FILES['img']['size'] >= 10485760) $result = "10MB 이하의 이미지 파일만 업로드 할 수 있습니다.";
                else if( $exp !== "jpg" && $exp !== "jpeg" && $exp !== "png" && $exp !== "gif" && $exp !== "JPG" && $exp !== "PNG" && $exp !== "GIF" && $exp !== "JPEG") $result = "확장자가 올바르지 않습니다.";
                else {
                    $sql = "SELECT userphoto FROM users WHERE id = ?";
                    $lastimg = DB::fetch($sql,[$_SESSION['user']->id])->userphoto;
                    if($lastimg !== '') unlink(ROOT."/public".$lastimg);
                    do{$image_name = Lib::randstring(30).".".$exp;}while(is_file(ROOT."/public/image/user/".$_FILES['img']['name']));
                    $uploadfile = ROOT."/public/image/user/";
                    move_uploaded_file($_FILES['img']['tmp_name'],$uploadfile.$image_name);
                    $result = 'true.'.$image_name;
                    $photo = '/image/user/'.$image_name;
                    $sql = "UPDATE users SET `userphoto` = ? WHERE id = ?";
                    DB::query($sql,[$photo,$_SESSION['user']->id]);
                    $sql = "SELECT * FROM users WHERE id = ?";
                    $user = DB::fetch($sql,[$_SESSION['user']->id]);
                    $_SESSION['user'] = $user;
                }
            }else $result = "이미지를 설정해주세요!";
        }
        echo json_encode($result);
    }
}