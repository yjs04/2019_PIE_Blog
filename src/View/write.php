<link rel="stylesheet" href="/css/write.css">
<script src="/js/write.js"></script>
<div id="content">
    <div id="writePage">
        <div id="write_top">
            <?php if(isset($data) && $data !== []):?>
            <h2>수정하기</h2>
            <?php else:?>
            <h2>글쓰기</h2>
            <?php endif;?>
            <select id="write_category">
                <?php if(isset($data) && $data !== [] && $data[0]->category == "all"):?>
                <option value="all" selected>전체</option>
                <?php else:?>
                <option value="all">전체</option>
                <?php endif?>
                <?php if(isset($data) && $data !== [] &&$data[0]->category == "question"):?>
                <option value="question" selected>질문 게시판</option>
                <?php else:?>
                <option value="question">질문 게시판</option>
                <?php endif?>
                <?php if(isset($_SESSION['user']) && $_SESSION['user']->admin == 1): ?>
                    <?php if(isset($data) && $data !== [] &&$data[0]->category == "notice"):?>
                    <option value="notice" selected>공지사항</option>
                    <?php else:?>
                    <option value="notice">공지사항</option>
                    <?php endif?>
                <?php endif;?>
            </select>
            <div id="write_toolBox">
                <button class="write_Tool_button" id="write_link"><i class="fas fa-link write_Tool_button_icon" id="write_link_icon"></i></button>
                <button class="write_Tool_button" id="write_bold"><i class="fas fa-bold write_Tool_button_icon" id="write_bold_icon"></i></button>
                <button class="write_Tool_button" id="write_italic"><i class="fas fa-italic write_Tool_button_icon" id="write_italic_icon"></i></button>
                <button class="write_Tool_button" id="write_color"><i class="fas fa-palette write_Tool_button_icon" id="write_color_icon"></i></button>
                <button class="write_Tool_button" id="write_backcolor"><p id="write_backcolor_icon">T</p></button>
                <button class="write_Tool_button" id="write_img"><i class="far fa-image write_Tool_button_icon" id="write_img_icon"></i></button>
                <button class="write_Tool_button" id="write_aleft"><i class="fas fa-align-left write_Tool_button_icon" id="write_aleft_icon"></i></button>
                <button class="write_Tool_button" id="write_acenter"><i class="fas fa-align-center write_Tool_button_icon" id="write_acenter_icon"></i></button>
                <button class="write_Tool_button" id="write_aright"><i class="fas fa-align-right write_Tool_button_icon" id="write_aright_icon"></i></button>
                <button class="write_Tool_button" id="write_afull"><i class="fas fa-align-justify write_Tool_button_icon" id="write_afull_icon"></i></button>
                <div id="write_toolBox_door"><p id="write_toolBox_door_title">Tool</p> <i class="fas fa-caret-right" id="write_toolBox_door_icon"></i></div>
            </div>
        </div>
        <div id="write_bottom">
            <div class = "writeBox">
                <?php if(isset($data) && $data !== []):?>
                <input type="text" id="write_title" name="writeTitle" class="write_input" placeholder="제목을 입력해주세요!" value="<?=$data[0]->title?>">
                <?php else:?>
                <input type="text" id="write_title" name="writeTitle" class="write_input" placeholder="제목을 입력해주세요!">
                <?php endif?>
            </div>
            <div class = "writeBox">
                <?php if(isset($data) && $data !== []):?>
                <div contentEditable = "true" id="write_content" class="write_input">
                    <?= $data[0]->content?>
                </div>
                <?php else:?>
                <div contentEditable = "true" id="write_content" class="write_input">
                </div>
                <?php endif?>
            </div>
        </div>
        <?php if(isset($data) && $data !== []):?>
        <button id="modify_ok" class="modify_<?=$data[0]->id?>_<?=$data[0]->writer_id?>">수정</button>
        <?php else:?>
        <button id="write_ok">포스팅</button>
        <?php endif?>
    </div>
</div>