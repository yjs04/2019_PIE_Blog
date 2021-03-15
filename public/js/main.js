class Main{
    constructor(){
        this.Events();
        this.mainBoard = ["new","many like","today","many view"];
        this.mainBoardIndex = 0;
        this.main_board_load(0);
        this.mainBoardpostlistnum = 0;
    }

    Events(){
        
        if(document.querySelector("#menu_board_last")){
            document.querySelector("#menu_board_last").addEventListener("click",()=>{
                this.mainBoardIndex = (this.mainBoardIndex - 1) < 0 ? 3 : (this.mainBoardIndex - 1);
                this.main_board_load(1);
            });
        }

        if(document.querySelector("#menu_board_next")){
            document.querySelector("#menu_board_next").addEventListener("click",()=>{
                this.mainBoardIndex = (this.mainBoardIndex + 1) > 3 ? 0 : (this.mainBoardIndex + 1);
                this.main_board_load(0);
            });
        }

        for(let i = 0; i<4; i++){
            if(document.querySelectorAll(".main_posting_button")[i]){
                document.querySelectorAll(".main_posting_button")[i].addEventListener("click",(e)=>{
                    let target = Number(e.path[0].id.substring(0,1));
                    let arrow = target > this.mainBoardIndex ? 0 : 1;
                    this.mainBoardIndex = target;
                    this.main_board_load(arrow);
                });
            }
        }

        window.addEventListener("click",(e)=>{
            if((e.target && e.target.classList.contains("new_posting")) ||( e.target.parentNode && e.target.parentNode.classList.contains("new_posting")) ||  (e.target.parentNode.parentNode && e.target.parentNode.parentNode.classList.contains("new_posting"))){
                let view_num = "";
                if(e.target.parentNode.parentNode && e.target.parentNode.parentNode.classList.contains("new_posting")) view_num = e.target.parentNode.parentNode.id.split("_")[1];
                if(e.target.parentNode && e.target.parentNode.classList.contains("new_posting")) view_num = e.target.parentNode.id.split("_")[1];
                if(e.target.classList.contains("new_posting")) view_num = e.target.id.split("_")[1];
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

    main_board_load(){
        if(document.querySelector(".new_posting") || document.querySelector("#new_posting_zero")){
            $.ajax({
                url:"/",
                method:"post",
                data:{"status": this.mainBoard[this.mainBoardIndex]},
                success:(data)=>{
                    let posting = JSON.parse(data);
                    this.mainBoardpostlistnum  = posting.length;
                    for(let i = 0; i<3; i++){
                        let target = document.querySelectorAll(".new_posting")[i];
                        setTimeout(()=>{
                            if(document.querySelector("#new_posting_zero"))document.querySelector("#new_posting_zero").classList.add("go"); 
                            if(target){
                                target.classList.add("go");
                                if(i ==2) this.slide_board();
                            }else if(i == 2) this.slide_board();
                        },100);
                    }
                }
            });
        }
    }

    slide_board(){
        setTimeout(()=>{
            let h2,p,status = this.mainBoard[this.mainBoardIndex];
            switch(this.mainBoardIndex){
                case 0 : h2 = "최근 포스팅";p="- 가장 최근 쓰여진 글들입니다.";break;
                case 1 : h2 = "인기 포스팅";p="- PIE 블로그에서 가장 인기있는 글들입니다.";break;
                case 2 : h2 = "오늘의 포스팅";p="- 오늘 포스팅된 글들입니다.";break;
                case 3 : h2 = "많이 본 포스팅";p="- PIE 블로그에서 가장 많이 보여진 글들입니다.";break;
            }
            $.ajax({
                url:"/",
                method:"post",
                data:{"status":status},
                success:(data)=>{
                    this.menu_buttons();
                    let posting = JSON.parse(data);
                    if(document.querySelector("#menu_title_box").classList.contains("active"))document.querySelector("#menu_title_box").classList.remove("active");
                    setTimeout(()=>{
                        document.querySelector("#menu_title_box").classList.add("active")
                        setTimeout(()=>{
                            document.querySelector("#main_content_h2").innerText = h2;
                            document.querySelector("#main_content_comment").innerText = p;
                            document.querySelector(".post").innerHTML = '';
                            let list = [];
                            this.mainBoardpostlistnum  = posting.length;
                            for(let i = 0; i<posting.length; i++) list[i] = i;
                            if(posting.length == 0){
                                document.querySelector(".post").innerHTML +=`
                                <div id="new_posting_zero">
                                    <h2>이런! 관련 포스팅이 하나도없네요</h2>
                                    <h2>글을 한번 써보는건 어떤가요?</h2>
                                </div>
                                ` ;
                                setTimeout(()=>{
                                    document.querySelector("#new_posting_zero").classList.add("active");
                                },100);
                            }
                            list.forEach(item =>{
                                document.querySelector(".post").innerHTML +=this.MakeMainPosting(item,posting);
                                setTimeout(()=>{
                                    document.querySelectorAll(".new_posting")[item].classList.add("active");
                                },100);
                            });
                        },200);
                    },500);
                }
            });
        },400);
    }

    MakeMainPosting(item,posting){
        let post = `<div class="new_posting" id="page_${posting[item].id}">
                        <div class="new-preimg">?</div>
                        <div class="new-pcontent">
                            <div class = "new-arrowBox"><i class="fas fa-caret-down new-readmore"></i></div>
                            <p class="new-pwrite">${posting[item].username}</p>
                            <h6>${posting[item].title}</h6>
                            <p class="new-pcategory">${posting[item].category}</p>
                            <div class="new-pcontent_text">
                                ${posting[item].content}
                            </div>
                            <p class="new-pdate">${this.MakeDateLater(posting[item].date)}</p>
                        </div>
                    </div>`;
        return post;
    }

    menu_buttons(){
        for(let i = 0; i<4; i++){
            let styleColor = i !== this.mainBoardIndex ? "#CCCCCC" : "#5B5B5B";
            document.querySelectorAll(".main_posting_button")[i].style.backgroundColor = styleColor;
        }
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

window.onload=()=>{
    let base = new Base();
    let main = new Main();
    let join = new Join();
    let login = new Login();
}