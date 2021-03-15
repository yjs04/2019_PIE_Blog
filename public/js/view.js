class View{
    constructor(){
        if(!document.querySelector("#view_page")){
            alert("존재하지 않는 페이지입니다.");
            location = "/board";
        }
        else{
            this.ViewEvent();
            this.postid = document.querySelector("#view_like").className.split("_")[2];
            this.goodNum = document.querySelector("#view_like").className.split("_")[3];
            this.viewButton();
        }
    }

    ViewEvent(){
        window.addEventListener("click",(e)=>{
            if(e.target.id == "view_page_comment_box_close" || e.target.id == "view_page_comment_box_close_icon") this.viewCommentClose();
            if(e.target.id == "view_comment" || e.target.id == "view_comment_icon" || e.target.id == "view_page_comment_num") this.viewCommentOpen();
            if(e.target.id == "view_page_comment_box_add_comment" || e.target.id == "view_page_comment_box_add_comment_icon") this.viewCommentAdd();
            if(e.target.id == "view-delete") this.viewDelete(e.target.className.split("_"));
            if(e.target.id == "view-mod") this.viewModifiy(e.target.className.split("_"));
            if(e.target.id == "view_page_mods_button") this.viewPageMode();
            if(!e.target.classList.contains("viewPageModeMenu_buttons") && e.target.id !== "view_page_mods_button" && document.querySelector("#viewPageModeMenu") &&document.querySelector("#viewPageModeMenu").classList.contains("active"))this.viewPageMode();
            if(e.target.id == "view_in_board_page_go" || e.target.id == "view_in_board_page_go_animation"){location="/board"}
        });
        document.querySelector("#view_like").addEventListener("click",()=>{this.viewLike();});
    }

    viewWrapwidth(){
        let wrap =Number( $("#wrap").css("height").split("px")[0]),add = Number($("#view_page").css("height").split("px")[0]);
        if(add >=600) wrap += 100;
        document.querySelector("#wrap").style.height = wrap+"px";
    }

    viewCommentClose(){
        setTimeout(() => {
            document.querySelector("#view_page_comment_box").classList.remove("active");
            setTimeout(() => {
                document.querySelector("#view_page").removeChild(document.querySelector("#view_page_comment_box"));
            }, 500);
        }, 100);
    }

    viewCommentAdd(){
        let comment_content = document.querySelector("#view_page_comment_box_add_comment_value").value;
        if(comment_content.length > 0){
            $.ajax({
                url:"/board/viewCommentAdd",
                method:"post",
                data:{"cpost_id":this.postid,"comment":comment_content},
                success:(data)=>{
                    let check = JSON.parse(data);
                    if(check !== "NOTFOUND"){
                        $.ajax({
                            url:"/board/viewCommentNum",
                            method:"get",
                            data:{"cpost_id":this.postid},
                            success:(data)=>{
                                let COMMENT = JSON.parse(data);
                                document.querySelector("#view_page_comment_num").innerText = COMMENT;
                                this.viewCommentClose();
                            }
                        });
                    }else alert("로그인 후 이용가능합니다.");
                }
            });
        }
    }

    viewCommentOpen(){
        $.ajax({
            url:"/board/viewComment",
            method:"get",
            data:{"cpost_id":this.postid},
            success:(data)=>{
                let item = JSON.parse(data);
                setTimeout(() => {
                    let comment =`
                    <div id="view_page_comment_box">
                        <div id="view_page_comment_box_header">
                            <h2>댓글</h2>
                            <button id="view_page_comment_box_close"><i class="fas fa-times" id="view_page_comment_box_close_icon"></i></button>
                        </div>
                        <div id="view_page_comment_box_comments">
                            `
                            if(item.length == 0) comment +=`댓글이 없습니다.`;
                            else {
                                for(let i = 0; i<item.length; i++){
                                    comment += this.viewCommentMake(item[i]);
                                }
                            }
                        comment+=`
                        </div>
                        <div id="view_page_comment_box_buttons">
                            <textarea id="view_page_comment_box_add_comment_value" cols="100" rows="3"></textarea>
                            <button id="view_page_comment_box_add_comment"><i class="fas fa-pen" id="view_page_comment_box_add_comment_icon"></i> 댓글 쓰기</button>
                        </div>
                    </div>`;
                    document.querySelector("#view_page").innerHTML += comment;
                    setTimeout(() => {
                        this.viewWrapwidth();
                        document.querySelector("#view_page_comment_box").classList.add("active");
                    }, 500);
                }, 100);
            }
        });
    }

    viewCommentMake(item){
        let comment = `
        <div class="view_page_comment_box_comment">
                <div class="view_page_comment_box_comment_content">
                   ${item['comment']}
                </div>
                <div class="view_page_comment_box_comment_detail">
                    <p>${item['username']}</p>
                    <p> </p>
                    <p>${item['cdate']}</p>
                </div>
            </div>
        `;
        return comment;
    }

    viewDelete(view){
        let check = confirm("해당글을 삭제하시겠습니까?");
        if(check){
            $.ajax({
                url:"/board/delete",
                method:"post",
                data:{"id":view[0],"writer_id":view[1]},
                success:(data)=>{
                    let alert_data = JSON.parse(data);
                    alert(alert_data);
                    location = "/board";
                }
            });
        }
    }

    viewModifiy(view){
        let check = confirm("수정페이지로 이동할까요?");
        if(check){
            $.ajax({
                url:"/board/modify",
                method:"post",
                data:{"id":view[0],"writer_id":view[1]},
                success:(data)=>{
                    let msg = JSON.parse(data);
                    if(msg !== true) alert(msg);
                    else{
                        let title = $("#view_page_title").html();
                        let content = $("#view_content").html();
                        location = "/board/mod/"+view[0]+"/"+view[1];
                    }
                }
            });
        }
    }

    viewButton(){
        $.ajax({
            url:"/board/viewLike",
            method:"get",
            data:{"p_id":this.postid},
            success:(data)=>{
                let LIKE = JSON.parse(data);
                if(LIKE !== "NOTFOUND"){
                    if(Number(LIKE["COUNT(*)"]) == 1)document.querySelector("#view_like_button").style.color = "#EA4C4C";
                    else document.querySelector("#view_like_button").style.color = "#959595";
                }else document.querySelector("#view_like_button").style.color = "#959595";
            }
        });
    }

    viewLike(){
        $.ajax({
            url:"/board/viewLike",
            method:"get",
            data:{"p_id":this.postid},
            success:(data)=>{
                let LIKE = JSON.parse(data);
                if(LIKE !== "NOTFOUND"){
                    if(Number(LIKE["COUNT(*)"]) == 0){
                        document.querySelector("#view_like_button").style.color = "#EA4C4C";
                        document.querySelector("#view_like_button").classList.add("active");
                    }
                    else{
                        document.querySelector("#view_like_button").style.color = "#959595";
                        document.querySelector("#view_like_button").classList.remove("active");
                    }
                    $.ajax({
                        url:"/board/viewLikeAdd",
                        method:"get",
                        data:{"p_id":this.postid,"goodNum":this.goodNum,"mode":Number(LIKE["COUNT(*)"])},
                        success:(data)=>{
                            let likeNum = Number(JSON.parse(data));
                            document.querySelector("#view_page_like_num").innerText = likeNum;
                        }
                    });
                }else alert("로그인 후 이용할 수 있습니다.");
            }
        });
    }

    viewPageMode(){
        if(document.querySelector("#viewPageModeMenu").classList.contains("active")){
            document.querySelector("#viewPageModeMenu").classList.remove("active");
            setTimeout(()=>{
                document.querySelector("#viewPageModeMenu").style.display = "none";
            },500);
        }
        else{
            document.querySelector("#viewPageModeMenu").style.display = "block";
            setTimeout(()=>{
                document.querySelector("#viewPageModeMenu").classList.add("active");
            },100);
        }
    }
}

window.onload = ()=>{
    let base = new Base();
    let view = new View();
}