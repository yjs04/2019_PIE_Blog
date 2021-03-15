class Join{
    constructor(){
        this.button = document.querySelector("#click-down");
        this.circle = this.button.parentNode;
        this.visual = this.button.parentNode.parentNode;
        this.joinEvent();
        this.join_ok_value = 0;
    }

    joinEvent(){
        window.addEventListener("click",(e)=>{
            let target = e.target.id;
            if(target == "join_go")this.joinpage();
            if(target == "join_ok")this.joinProcess();
            if(target == "join_nope_y"){
                document.querySelector("#join_nope").classList.remove("active");
                setTimeout(()=>{
                    document.querySelector(".joinPage").classList.remove("active");
                    setTimeout(()=>{
                        document.querySelector("#join_nope").remove();
                        document.querySelector(".joinPage").remove();
                        this.circle.classList.remove("active");
                        this.visual.classList.remove("active");
                        this.button.classList.remove("active");
                    },500);
                },10);
            }
            if(target == "join_nope_n"){
                setTimeout(()=>{
                    document.querySelector("#join_nope").classList.remove("active");
                    setTimeout(()=>{document.querySelector("#join_nope").remove();},500);
                },10);
            }
        });
        window.addEventListener("keyup",(e)=>{
            if(e.target.classList.contains("join_input")) this.joinVcheck(e.target.id);
        });
    }

    joinpage(){
        setTimeout(()=>{
            if(document.querySelector(".blog_word"))document.querySelector(".blog_word").classList.remove("active");
            setTimeout(()=>{
                if(document.querySelector(".blog_word"))document.querySelector(".blog_word").remove();
                let join_c =document.createElement("div");
                join_c.classList.add("joinPage");
                join_c.innerHTML+= `
                    <link rel="stylesheet" href="/css/join.css">
                        <div class="join_check">
                            <div class="join_box">
                                <label for="join_username" class="join_label">이름</label>
                                <input type="text" class="join_input" id="join_username" name="username" placeholder = "이름을 입력해주세요.">
                            </div>
                            <div class="join_box">
                                <label for="join_userid" class="join_label">아이디</label>
                                <input type="text" class="join_input" id="join_userid" name="userid" placeholder = "아이디를 입력해주세요.">
                            </div>
                            <div class="join_box">
                                <label for="join_password" class="join_label">비밀번호</label>
                                <input type="password" class="join_input" id="join_password" name="password" placeholder = "비밀번호를 입력해주세요.">
                            </div>
                            <div class="join_box">
                                <label for="join_passwordC" class="join_label">비밀번호확인</label>
                                <input type="password" class="join_input" id="join_passwordC" name="passwordC" placeholder="비밀번호를 한번더 입력해주세요.">
                            </div>
                        </div>
                        <button id="join_ok">회원가입</button>
                `;

                this.circle.classList.add("active");
                this.visual.classList.add("active");
                this.button.classList.add("active");
                setTimeout(()=>{
                    this.visual.appendChild(join_c);
                    setTimeout(()=>{
                        document.querySelector(".joinPage").classList.add("active");
                    },100);
                },500);
            },1000);
        },500);
    }

    joinProcess(){
        this.joinVcheck();
        if(!(document.querySelector("#username_error") || document.querySelector("#userid_error1") || document.querySelector("#userid_error2") || document.querySelector("#password_error1") || document.querySelector("#password_error2") || document.querySelector("#passwordC_error") )){
            $.ajax({
                url:"/user/join",
                method:"post",
                data:{"userid":this.userid,"username":this.username,"password":this.password},
                success:(data)=>{
                    setTimeout(()=>{
                        document.querySelector("#join_nope").classList.remove("active");
                        setTimeout(()=>{document.querySelector("#join_nope").remove();},500);
                    },10);
                    alert("회원가입이 완료되었습니다.");
                }
            });
        }
    }

    joinVcheck(target){
        console.log(target);
        this.userid = document.querySelector("#join_userid").value;
        this.username = document.querySelector("#join_username").value;
        this.password = document.querySelector("#join_password").value;
        this.passwordC = document.querySelector("#join_passwordC").value;
        let parent = document.querySelectorAll(".join_box");
        //조건식

        //name
        if(target == "join_username"){
            //1.1글자 이상
            this.joinerrormade((this.username.length == 0 || this.username > 30),"username_error1","이름은 1글자 이상, 30글자 이하여야 합니다.",parent[0]);
            //2.중복 X
            $.ajax({
                url:"/user/search",
                method:"post",
                data:{"search":"username","search_word":this.username},
                success:(data)=>{   
                    this.joinerrormade((data !== 'false' && !(this.username.length == 0 || this.username > 30) ),"username_error2","같은 이름의 유저가 존재합니다.",parent[0]);
                    if(document.querySelector("#username_error2") && (this.username.length == 0 || this.username > 30)) this.joinerrormade(0,"username_error2");
                }
            });
        }

        //id
        if(target == "join_userid"){
            //1.3글자 이상
            this.joinerrormade(!(/^.{3,}$/.test(this.userid)),"userid_error1","아이디는 3글자 이상이어야 합니다.",parent[1]);
            //2.영문 혹은 숫자포함
            if(/^.{3,}$/.test(this.userid))this.joinerrormade(!(/^[a-z||A-Z||0-9]+$/.test(this.userid)),"userid_error2","아이디는 영문 혹은 숫자로 이루어져야 합니다.",parent[1]);
            if(document.querySelector("#userid_error2") && !(/^.{3,}$/.test(this.userid))) this.joinerrormade(0,"userid_error2");
            //3.중복 X
            $.ajax({
                url:"/user/search",
                method:"post",
                data:{"search":"userid","search_word":this.userid},
                success:(data)=>{
                    this.joinerrormade((data !== 'false' && (/^[a-z||A-Z||0-9]+$/.test(this.userid)) ),"userid_error3","같은 아이디의 유저가 존재합니다.",parent[1]);
                    if(document.querySelector("#userid_error3") && !(/^[a-z||A-Z||0-9]+$/.test(this.userid))) this.joinerrormade(0,"userid_error3");
                }
            });
        }

        //password
        if(target == "join_password"){
            //1. 8글자이상
            this.joinerrormade((this.password.length < 8),"passwrod_error1","비밀번호는 8글자 이상이어야합니다.",parent[2]);
            //2.영문 + 숫자 + 특수기호
            let reg = (/[a-zA-Z]/.test(this.password) && /[0-9]/.test(this.password) && /[~!@#$%^&*()_+|<>?:{}]/.test(this.password));
            if((this.password.length >= 8)) this.joinerrormade(!reg,"password_error2","비밀번호는 영문,숫자,특수기호를 한번씩 포함해야 합니다.",parent[2]);
            if(document.querySelector("#password_error2") && (this.password.length < 8)) this.joinerrormade(0,"password_error2");
        }

        //password check
        if(target == "join_passwordC" && this.password){
            //1. 비밀번호 == 비밀번호 확인 ?
            this.joinerrormade((this.password !== this.passwordC),"passwordC_error","비밀번호와 비밀번호확인이 같지 않습니다.",parent[3]);
        }
    }

    joinerrormade(mode,id,item,parent){
        if(mode == 1){
            if(document.querySelector("#"+id)) return;
            let error = document.createElement("div");
            error.classList.add("join_error");
            error.id = id;
            error.innerText = item;
            parent.appendChild(error);
        }else{
            if(document.querySelector("#"+id))document.querySelector("#"+id).remove();
        }
    }
}