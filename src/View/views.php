<link rel="stylesheet" href="/css/view.css">
<script src="/js/view.js"></script>
<?php if(isset($view) && $view  !== false):?>
<div id="view_page">
    <div id="view_header">
        <div id="view_header_title">
            <h1 id="view_page_title"><?= $view->title?></h1>
            <div id="view_page_modes">
            <?php if(isset($_SESSION['user'])&&$_SESSION['user']->id == $view->writer_id):?>
            <div id="viewPageModeMenu">
                <a href="#" id="view-delete" class="<?=$view->id?>_<?=$view->writer_id?>_ viewPageModeMenu_buttons">삭제</a> 
                <a href="#" id="view-mod"    class="<?=$view->id?>_<?=$view->writer_id?>_ viewPageModeMenu_buttons">수정</a>
            </div>
            <i class="fas fa-ellipsis-v" id = "view_page_mods_button"></i>
            <?php endif?>
            </div>
        </div>
        <div id ="view_header_info">
            <p id="view_date"><?= $view->date?></p>
            <p></p>
            <p id="view_writer">작성자 : <?= $view->username?></p>
            <p id="view_viewNumber">view : <?= $view->view?></p>
        </div>
    </div>
    <div id="view_content">
        <?= $view->content?>
        <div id="view_content_detail">
            category : <?= $view->category?>
        </div>
    </div>
    <button id="view_comment"><i class="far fa-comment-alt" id="view_comment_icon"></i> <p id="view_page_comment_num"><?=$view->comment?></p></button>
    <button id="view_like" class="view_like_<?=$view->id?>_<?=$view->good?>"><i class="fas fa-heart" id="view_like_button"></i> <p id="view_page_like_num"><?= $view->good?></p></button>
    <button id="view_in_board_page_go" class="board_view_<?=$view->id?>_page_menu_list"><i class="fas fa-list" id="view_likes"></i> 목록으로 <div id="view_in_board_page_go_animation"></div></button>

</div>
<?php endif;?>