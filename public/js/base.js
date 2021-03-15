class Base{
    constructor(){
        this.BaseEvent();
    }

    BaseEvent(){
        // document.querySelector("#click-down").addEventListener("click",()=>{this.click_slide_down("click-down")});
        window.addEventListener("click",(e)=>{
            switch(e.target.id){
                case "click-down": this.click_slide_down("click-down"); break;
                case "write_go": this.writePage_load(); break;
                case "login_go": this.loginPage(); break;
                case "logout_go" : this.logout(); break;
            }
            let target = e.target;
            if(document.querySelector("#loginPage") && target.id !== "loginPage" && target.parentNode.id !== "loginPage" && target.parentNode.parentNode.id !== "loginPage" && target.parentNode.parentNode.parentNode.id !== "loginPage") this.loginPageOut();
            if(target.id == "login_ok") this.loginProcess();
        });
    }

    click_slide_down(target){
        let button = document.querySelector("#"+target),isset = false;
        let circle = button.parentNode;
        let visual = button.parentNode.parentNode;
        let blogs_word = document.createElement("div");
        blogs_word.classList.add("blog_word");
        blogs_word.innerHTML = `
            <div id="menu">
                PIE blog에 오신것을 환영합니다.<br>
                게시판에서 다양한 글들을 읽어보세요!
            </div>
            <div class="blog_word_animation"></div>
            <div class="blog_word_animation"></div>
            <div class="blog_word_animation"></div>
            <div class="blog_word_animation"></div>
            <div class="blog_word_animation"></div>
        `;
        button.classList.forEach(item =>{if(item == "active"){isset = true;}});
        if(!document.querySelector(".joinPage")){
            if(isset){
                setTimeout(()=>{
                    document.querySelector(".blog_word").classList.remove("active");
                    setTimeout(()=>{
                        circle.classList.remove("active");
                        visual.classList.remove("active");
                        button.classList.remove("active");
                        visual.removeChild(document.querySelector(".blog_word")); 
                    },500);
                },10);
            }else{
                circle.classList.add("active");
                visual.classList.add("active");
                button.classList.add("active");
                setTimeout(()=>{
                    visual.appendChild(blogs_word);
                    setTimeout(()=>{
                        document.querySelector(".blog_word").classList.add("active");
                    },100);
                },500);
            }
        }

        if(document.querySelector(".joinPage") && !document.querySelector("#join_nope")){
            let popup = document.createElement("div");
            popup.id = "join_nope";
            popup.innerHTML+= `
                <h2>회원가입을 취소하시겠습니까?</h2>
                <button id="join_nope_y" class='join_nope_btn'>네</button>
                <button id="join_nope_n" class='join_nope_btn'>아니요</button>
            `;
            setTimeout(()=>{
                document.querySelector("body").appendChild(popup);
                setTimeout(()=>{
                    document.querySelector("#join_nope").classList.add("active");
                },500);
            },10);
        }
    }

    writePage_load(){
        $.ajax({
            url:"/user/write",
            method:"get",
            success:(data)=>{
                let user = JSON.parse(data);
                if(user == false){
                    alert("로그인 후 이용하실 수 있습니다.");
                    this.loginPage();
                }else{
                    setTimeout(()=>{
                        if(document.querySelectorAll(".new_posting")[0])document.querySelectorAll(".new_posting")[0].classList.add("go");
                        if(document.querySelectorAll(".new_posting")[1])document.querySelectorAll(".new_posting")[1].classList.add("go");
                        if(document.querySelectorAll(".new_posting")[2])document.querySelectorAll(".new_posting")[2].classList.add("go");
                        setTimeout(()=>{
                            location="/write";
                        },1000);
                    },100);
                }
            }
        });
    }

    loginPage(){
        let login = document.createElement("div");
        login.id="loginPage";
        login.innerHTML=`
            <div id = "login_side">
                <h2>Login</h2>
            </div>
            <div id = "login_form">
                <h3 id="login_error"></h3>
                <div class = "login_box">
                    <label for="login_id" class="login_label">ID</label>
                    <input type = "text" id="login_id" name = "login_id" class="login_input" placeholder="ID를 입력해주세요">
                </div>
                <div class = "login_box">
                    <label for="login_password" class="login_label">Password</label>
                    <input type = "password" id="login_password" name = "login_password" class="login_input" placeholder="Password를 입력해주세요">
                </div>
                <button id = "login_ok">로그인</button>
            </div>
        `;
        setTimeout(()=>{
            if(!document.querySelector("#loginPage"))document.querySelector("body").appendChild(login);
            let login_bc = document.createElement("div");
            login_bc.id = "login_bc";
            if(!document.querySelector("#login_bc"))document.querySelector("body").appendChild(login_bc);
            setTimeout(()=>{
                document.querySelector("#loginPage").classList.add("active");
                document.querySelector("#login_bc").classList.add("active");
            },500);
        },10);
    }

    logout(){
        $.ajax({
            url:"/user/logout",
            success:()=>{
                location = "/";
                alert("로그아웃 되었습니다.");
            }
        });
    }

    loginPageOut(){
        setTimeout(()=>{
            document.querySelector("#loginPage").classList.remove("active");
            document.querySelector("#login_bc").classList.remove("active");
            setTimeout(() => {
                if(document.querySelector("#loginPage"))document.querySelector("body").removeChild(document.querySelector("#loginPage"));
                if(document.querySelector("#login_bc"))document.querySelector("body").removeChild(document.querySelector("#login_bc"));
            }, 500);
        },10);
    }

    loginProcess(){
        let id = document.querySelector("#login_id").value;
        let password = document.querySelector("#login_password").value;
        if(id !== "" && password !==""){
            $.ajax({
                url:"/user/login",
                method:"post",
                data:{
                    "userid":id,
                    "password":password
                },
                success:(data)=>{
                    let name = JSON.parse(data);
                    if(name !== false){
                        setTimeout(()=>{
                            this.loginPageOut();
                            setTimeout(()=>{
                                this.Maketoast("환영합니다, "+(name['username'])+" 님");
                                setTimeout(()=>{
                                    location = "/";
                                },1000);
                            },100);
                        },500);
                    }else document.querySelector("#login_error").innerText = "* ID 또는 Password가 일치하지않습니다.";
                }
            });
        }
    }

    Maketoast(msg){
        if(!document.querySelector("#toast")){
            let toast = document.createElement("div");
            toast.id = "toast";
            toast.innerText = msg;
            document.querySelector("body").appendChild(toast);
            setTimeout(() => {
                document.querySelector("#toast").classList.add("active");
                setTimeout(() => {
                    document.querySelector("#toast").classList.remove("active");
                    setTimeout(()=>{
                        document.querySelector("body").removeChild(document.querySelector("#toast"));
                    },500);
                }, 2000);
            }, 500);
        }
    }
}