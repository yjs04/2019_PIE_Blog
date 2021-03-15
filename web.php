<?php

use Base\App\Route;

// All
Route::get("/",'MainController@indexPage');
Route::post("/","MainController@mainPost");

// User
Route::post("/user/join","UserController@joinProcess");
Route::post("/user/search","UserController@userSearch");
Route::post("/user/login","UserController@LoginProcess");
Route::get("/user/logout","UserController@LogoutProcess");
Route::get("/user/myPage","UserController@MyPage");
Route::post("/user/userInfo","UserController@Userinfo");
Route::post("/user/mypage/settingcheck","UserController@UserCheck");
Route::post("/user/delete","UserController@UserDelete");
Route::post("/user/modify","UserController@UserModify");
Route::post("/user/commentset","UserController@UserCommentSet");
Route::post("/user/image","UserController@UserPhotoSet");

// Write
Route::get("/user/write","WriteController@write");
Route::get("/write","WriteController@writePage");
Route::post("/user/writeUpload","WriteController@writeProcess");
Route::post("/user/writeModify","WriteController@ModifyProcess");
Route::post("/user/write/modifySet","WriteController@modifySet");
Route::post("/write/image","WriteController@writeImage");
Route::post("/write/image/del","WriteController@writeImageDel");
Route::post("/write/modify/img","WriteController@writeImageSer");

// Board
Route::get("/board","BoardController@boardpage");
Route::get("/board/pageNum","BoardController@boardNum");
Route::get("/board/nomal","BoardController@boardNomal");
Route::get("/board/notice","BoardController@boardNotice");
Route::get("/board/today","BoardController@boardToday");
Route::get("/board/favorite","BoardController@boardFavorite");
Route::get("/board/question","BoardController@boardQuestion");

// view
Route::get("/board/view/{id}","ViewController@viewPage");
Route::get("/board/viewAdd/{id}","ViewController@viewAdd");
Route::get("/board/viewLike","ViewController@viewLike");
Route::get("/board/viewLikeAdd","ViewController@viewLikeAdd");
Route::get("/board/viewComment","ViewController@viewComment");
Route::post("/board/viewCommentAdd","ViewController@viewCommentAdd");
Route::get("/board/viewCommentNum","ViewController@viewCommentNum");
Route::post("/board/delete","ViewController@viewDelete");
Route::post("/board/modify","ViewController@viewModify");
Route::get("/board/mod/{id}/{data}","ViewController@viewModPage");