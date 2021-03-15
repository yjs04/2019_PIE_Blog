class Board{
    constructor(){
        this.BoardIndex = 0;
        this.BoardMaxIndex = 0;
        this.BoardURI = "/board/nomal";
        this.BoardTitle = ["게시판","공지사항","오늘의 포스팅","인기 포스팅","질문 게시판"];
        this.buttonLimit = "";
        this.BoardtitleNum = 0;
        this.BoardPage();
        this.BoardEvent();
        this.BoardButton();
    }

    BoardEvent(){
        window.addEventListener("click",(e)=>{
            if(e.target.classList.contains("board_button")){
                this.BoardIndex = Number((e.target.id).split("_")[1])-1;
                this.BoardPage();
                for(let i = 0; i < document.querySelectorAll(".board_button").length; i++){
                    let backgroundColor = this.BoardIndex == i ? "#CBCBCB" : '#E3E3E3',color = this.BoardIndex == i ? "#fff" : '#000';
                    document.querySelectorAll(".board_button")[i].style.backgroundColor = backgroundColor;
                    document.querySelectorAll(".board_button")[i].style.color = color;
                }
            }
            if(e.target.classList.contains("board_buttons_page") || (e.target.parentNode && e.target.parentNode.classList.contains("board_buttons_page"))){
                if(e.target.parentNode.classList.contains("board_buttons_page")){
                    if(e.target.parentNode.id == "board_button_right") this.BoardIndex = this.BoardIndex + 1 >= this.BoardMaxIndex ? this.BoardMaxIndex : this.BoardIndex + 1;
                    else this.BoardIndex = this.BoardIndex - 1 <= 0 ? 0 : this.BoardIndex - 1;
                }else{
                    if(e.target.id == "board_button_right") this.BoardIndex = this.BoardIndex + 1 >= this.BoardMaxIndex ? this.BoardMaxIndex : this.BoardIndex + 1;
                    else this.BoardIndex = this.BoardIndex - 1 <= 0 ? 0 : this.BoardIndex - 1;
                }
                this.BoardPage();
                this.BoardButton();
            }
            if(e.target.classList.contains("board_page_menu_li")){
                switch(e.target.id){
                    case "nomal_board_page" : this.BoardURI = "/board/nomal"; this.BoardtitleNum = 0; this.buttonLimit=""; break;
                    case "notice_board_page" : this.BoardURI = "/board/notice"; this.BoardtitleNum = 1; this.buttonLimit=" WHERE posts.category = 'notice'"; break;
                    case "today_board_page" : this.BoardURI = "/board/today"; this.BoardtitleNum = 2; this.buttonLimit = "WHERE (CONVERT(posts.date,date)) = (SELECT CONVERT(now(),date)) ORDER BY `date`"; break;
                    case "favorite_board_page" : this.BoardURI = "/board/favorite"; this.BoardtitleNum = 3; this.buttonLimit=""; break;
                    case "question_board_page" : this.BoardURI = "/board/question"; this.BoardtitleNum = 4; this.buttonLimit="WHERE posts.category = 'question'"; break;
                }
                this.BoardIndex = 0;
                this.BoardMaxIndex = 0;
                this.BoardPage();
                this.BoardButton();
                for(let i = 0; i<document.querySelectorAll(".board_page_menu_li").length; i++){
                    let li_color = document.querySelectorAll(".board_page_menu_li")[i].id == e.target.id ? "#A7A7A7" : "#fff";
                    document.querySelectorAll(".board_page_menu_li")[i].style.color = li_color;
                }
                document.querySelector("#board_page_title").innerText = this.BoardTitle[this.BoardtitleNum];
            }
            if((e.target && e.target.classList.contains("board_posting")) ||( e.target.parentNode && e.target.parentNode.classList.contains("board_posting")) ||  (e.target.parentNode.parentNode && e.target.parentNode.parentNode.classList.contains("board_posting"))){
                let view_num = "";
                if(e.target.parentNode.parentNode && e.target.parentNode.parentNode.classList.contains("board_posting")) view_num = e.target.parentNode.parentNode.id.split("_")[1];
                if(e.target.parentNode && e.target.parentNode.classList.contains("board_posting")) view_num = e.target.parentNode.id.split("_")[1];
                if(e.target.classList.contains("board_posting")) view_num = e.target.id.split("_")[1];
                if(view_num !== ""){
                    $.ajax({
                        url:"/board/viewAdd/"+view_num,
                        method:"get",
                        data:{"id":Number(view_num)},
                        success:()=>{
                            location = "/board/view/"+view_num;
                        }
                    });
                }
            }
        });
    }

    BoardButton(){
        $.ajax({
            url:"/board/pageNum",
            method:"get",
            data:{"Limit":this.buttonLimit},
            success:(data)=>{
                let num = JSON.parse(data)["page"],boardpagenum = Math.ceil(num / 5),button_width = 100;
                let listNum = Math.floor(this.BoardIndex/5) * 5,end = listNum + 5 > boardpagenum ? boardpagenum : listNum+ 5 ;
                if(document.querySelector("#board_button_numbers")){
                    document.querySelector("#board_button_numbers").innerHTML = "";
                    this.BoardMaxIndex = boardpagenum - 1;
                    for(let i = listNum; i< end; i++){
                        let pagenum = document.createElement("div");
                        pagenum.id = "board_"+(i+1);
                        pagenum.innerText = (i+1);
                        pagenum.classList.add("board_button");
                        document.querySelector("#board_button_numbers").appendChild(pagenum);
                        button_width+=40;
                    }
                    for(let i = 0; i < (Math.abs(end - listNum)); i++){
                        let check = this.BoardIndex - listNum;
                        let backgroundColor = i == check ? "#CBCBCB" : '#E3E3E3',color = i == check ? "#fff" : '#000';
                        document.querySelectorAll(".board_button")[i].style.backgroundColor = backgroundColor;
                        document.querySelectorAll(".board_button")[i].style.color = color;
                    }
                    document.querySelector("#board_pagenation_box").style.width = button_width+"px";
                }
            }
        });
    }

    MakeboardPage(postings){
        document.querySelector("#board_content_box").innerHTML = "";
        for(let i = 0 ; i<postings.length;i++){
            this.MakePost(postings[i]);
            setTimeout(()=>{
                document.querySelectorAll(".board_posting")[i].classList.add("active");
            },200 * (i+1));
        }
    }

    BoardPage(){
        $.ajax({
            url:this.BoardURI,
            method:"get",
            data:{"BoardIndex":this.BoardIndex},
            success:(data)=>{
                let postings = JSON.parse(data);
                if(document.querySelector("#board_content_box")){
                    if(postings.length > 0){
                        if(document.querySelector("#board_page_posting_not")){
                            setTimeout(()=>{
                                if(document.querySelector("#board_page_posting_not") && document.querySelector("#board_page_posting_not").classList.contains("active"))document.querySelector("#board_page_posting_not").classList.remove("active");
                                setTimeout(()=>{
                                    this.MakeboardPage(postings);
                                },400);
                            },500);
                        }else if(document.querySelectorAll(".board_posting").length !== 0){
                            for(let i = 0; i<document.querySelectorAll(".board_posting").length; i++){
                                setTimeout(()=>{
                                    document.querySelectorAll(".board_posting")[i].classList.remove("active");
                                    if(i == document.querySelectorAll(".board_posting").length -1) setTimeout(()=>{this.MakeboardPage(postings);},400)
                                },200 * (i+1));
                            }
                        }else{
                            this.MakeboardPage(postings);
                        }
                    }else{
                        if(document.querySelectorAll(".board_posting").length !== 0){
                            for(let i = 0; i<document.querySelectorAll(".board_posting").length; i++){
                                setTimeout(()=>{
                                    document.querySelectorAll(".board_posting")[i].classList.remove("active");
                                    if(i == document.querySelectorAll(".board_posting").length -1){
                                        setTimeout(()=>{
                                            setTimeout(()=>{
                                            document.querySelector("#board_content_box").innerHTML=`<div id="board_page_posting_not">이런! 관련 포스팅이 하나도 없네요!</div>`;
                                                setTimeout(()=>{
                                                    document.querySelector("#board_page_posting_not").classList.add("active");
                                                },500);
                                            },400);
                                        },400);
                                    }
                                },200 * (i+1));
                            }
                        }else{
                            setTimeout(()=>{
                                document.querySelector("#board_content_box").innerHTML+=`<div id="board_page_posting_not">이런! 관련 포스팅이 하나도 없네요!</div>`;
                                setTimeout(()=>{
                                    document.querySelector("#board_page_posting_not").classList.add("active");
                                },500);
                            },400);
                        }
                    }
                }
            }
        });
    }

    MakePost(item){
        document.querySelector("#board_content_box").innerHTML+= `<div class="board_posting" id="posting_${item['id']}">
                        <div class="board-preimg">?</div>
                        <div class="board-pcontent">
                            <div class = "board-arrowBox"><i class="fas fa-caret-down board-readmore"></i></div>
                            <p class="board-pwrite">${item['username']}</p>
                            <h6>${item['title']}</h6>
                            <p class="board-pcategory">${item['category']}</p>
                            <div class="board-pcontent_text">
                            ${item['content']}
                            </div>
                            <p class="board-pdate">${this.MakeDateLater(item['date'])}</p>
                        </div>
                    </div>`;
    }

    MakeDateLater(date){
        let time = new Date(),status = ["방금 전",0],status_date = new Array("년 전","월 전","일 전","시간 전","분 전","초 전");
        let nowDate = this.leadingZeros(time.getFullYear(),4)+'-'+this.leadingZeros(time.getMonth()+1,2)+'-'+this.leadingZeros(time.getDate(),2)+' '+this.leadingZeros(time.getHours(),2)+':'+this.leadingZeros(time.getMinutes(),2)+':'+this.leadingZeros(time.getSeconds(),2);
        let a = nowDate.split(" "),b = date.split(" ");
        let nowdate = a[0].split("-"),dbdate = b[0].split("-"),nowsecond,dbsecond;
        nowsecond = dbsecond = 0;
        for(let i = 0; i<3; i++){
            nowdate.push(a[1].split(":")[i]);
            dbdate.push(b[1].split(":")[i]);
        }
        for(let i = 0; i<6; i++){
            nowsecond += this.DateReturnSecond(1,Number(nowdate[i]),i);
            dbsecond += this.DateReturnSecond(1,Number(dbdate[i]),i);
        }
        let minus = nowsecond - dbsecond;
        for(let i = 0; i<6; i++){
            let nowdef = this.DateReturnSecond(0,minus,i);
            minus -= nowdef;
            if(nowdef >= 1){
                status[0] = status_date[i];
                status[1] = Math.floor(nowdef);
                break;
            }
        }
        return status[1] + status[0];
    }

    leadingZeros(n,digits){
        let zero = '';
        n = n.toString();
        if(n.length < digits) for(let i=0; i<digits - n.length; i++) zero += '0';
        return zero + n;
    }

    DateReturnSecond(turn,time,mode){
        if(turn == 1){
            switch(mode){
                case 0 : return time * 3.154e+7;
                case 1 : return time * 2.628e+6;
                case 2 : return time * 86400;
                case 3 : return time * 3600;
                case 4 : return time * 60;
                case 5 : return time;
            }
        }else{
            switch(mode){
                case 0 : return time / 3.154e+7;
                case 1 : return time / 2.628e+6;
                case 2 : return time / 86400;
                case 3 : return time / 3600;
                case 4 : return time / 60;
                case 5 : return time;
            }
        }
    }
}

window.onload = ()=>{
    let base = new Base();
    let board = new Board();
}